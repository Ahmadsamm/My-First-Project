// Allgemeine Module ================================
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import gulpIf from 'gulp-if';
import color from 'chalk';

const devMode = !(process.env.NODE_ENV === 'production');
console.log(color.green(devMode ? 'DEVELOPMENT MODE' : 'PRODUCTION MODE'));

// CSS Task =========================================
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import autoPrefixer from 'autoprefixer';
import postCss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';

const sass = gulpSass(dartSass);

const { src, dest, task, watch, series, parallel } = gulp;

task('css', (done) => {
  const sourceFile = './dev/assets/scss/main.scss';
  const targetFolder = './assets/css';

  src(sourceFile)
    .pipe(gulpIf(devMode, sourcemaps.init()))
    .pipe(plumber())
    .pipe(
      sass({
        outputStyle: 'expanded',
        sourceMap: false,
        debug: true,
      }).on('error', sass.logError)
    )
    .pipe(postCss([autoPrefixer()]))
    .pipe(gulpIf(devMode, sourcemaps.write('../map')))
    .pipe(dest(targetFolder));

  done();
});

// Server Task ========================================
import browserSync from 'browser-sync';

task('server', () => {
  browserSync.init({
    port: 3000,
    server: {
      baseDir: './',
    },
  });
});

task('reload', (done) => {
  browserSync.reload();
  done();
});

// FONTS ==============================================
task('fonts', (done) => {
  const sourceFiles = ['./dev/assets/fonts/**/*.+(woff|woff2)', './dev/assets/fonts/*.+(woff|woff2)'];
  const targetFolder = './assets/fonts';

  return src(sourceFiles, { allowEmpty: true }).pipe(dest(targetFolder));

  done();
});

// HTML Task ===========================================
import fileInclude from 'gulp-file-include';

task('html', (done) => {
  const sourceFiles = ['./dev/html/pages/**/*.html', './dev/html/pages/*.html'];
  const targetFolder = './';

  src(sourceFiles)
    .pipe(plumber())
    .pipe(
      fileInclude({
        prefix: '@@',
        basepath: './dev/html/includes',
      })
    )
    .pipe(dest(targetFolder));

  done();
});

// JS  Task ======================

import rollupStream from '@rollup/stream';
import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonJs from '@rollup/plugin-commonjs';

import rollupReplace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';

let cache;

task('js', (done) => {
  const sourceFile = './dev/assets/js/main.js';
  const targetFolder = './assets/js';
  return rollupStream({
    input: sourceFile,
    output: {
      sourcemapFile: 'bundle.js.map',
      sourcemap: devMode, // https://github.com/rollup/rollup/issues/717
      format: 'iife',
    },
    // define the cache in Rollup options
    cache,
    plugins: [
      rollupReplace({
        preventAssignment: true,
        'process.env.NODE_ENV': devMode ? JSON.stringify('development') : JSON.stringify('production'),
        'process.env.BABEL_ENV': devMode ? JSON.stringify('development') : JSON.stringify('production'),
        __buildDate__: () => JSON.stringify(new Date()),
        __buildVersion: 15,
      }),
      commonJs({
        include: 'node_modules/**',
      }),

      nodeResolve({
        jsnext: true,
        preferBuiltins: true,
        browser: true,
      }),
      json(),
      // rollupSourceMaps(),
      babel({
        sourceMaps: devMode,
        babelHelpers: 'bundled',
        compact: true,
        presets: [
          [
            '@babel/env',
            {
              targets: {
                browsers: 'last 2 versions, > 0.5%, ie >= 11',
              },
              modules: false,
            },
          ],
          [
            '@babel/preset-react',
            {
              runtime: 'automatic', // https://stackoverflow.com/a/70051350/17210139
              development: process.env.BABEL_ENV === 'development',
            },
          ],
        ],

        plugins: [],
      }),
    ],
  })
    .on('bundle', (bundle) => {
      // update the cache after every new bundle is created
      cache = bundle;
    })

    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(dest(targetFolder));
  done();
});

// WATCHERS ==========================================
task('watcher', () => {
  watch(['./dev/assets/scss/**/*.+(scss|css)', './dev/assets/scss/main.scss'], series('css', 'reload'));
  watch(
    ['./dev/assets/js/**/**/*.+(js|jsx)', './dev/assets/js/**/*.+(js|jsx)', './dev/assets/js/main.js'],
    series('js', 'reload')
  );

  watch(['./dev/assets/fonts/**/*.+(woff|woff2)', './dev/assets/fonts/*.+(woff|woff2)'], series('fonts', 'reload'));

  watch(
    [
      './dev/html/pages/**/*.html',
      './dev/html/pages/*.html',
      './dev/html/includes/**/*.html',
      './dev/html/includes/*.html',
    ],
    series('html', 'reload')
  );
});

// ====================================================
// Build Mode
// ====================================================

import rename from 'gulp-rename';
import crypto from 'crypto';
const id = crypto.randomBytes(12).toString('base64');

// CLEANER ============================================
import del from 'del';

task('clean', (done) => {
  const deleteFolder = ['./dist'];
  return del(deleteFolder);
});

// COPY ===============================================
task('copy', (done) => {
  const sourceFiles = [
    './**',
    '.htaccess',
    '!./MATERIAL',
    '!./MATERIAL/**',
    '!./dev/**',
    '!./dev',
    '!.browserslistrc',
    '!package-lock.json',
    '!package.json',
    '!.git/',
    '!.git/**',
    '!.gitignore',
    '!README.md',
    '!.DS_STORE',
    '!./gulp/**',
    '!./gulp',
    '!gulpfile.js',
    '!./node_modules/**',
    '!./node_modules',
    '!composer.json',
    '!composer.lock',
  ];
  const targetFolder = './dist';

  return src(sourceFiles, { allowEmpty: true }) //
    .pipe(dest(targetFolder));

  done();
});

// COMPRESS JS ========================================
import terser from 'gulp-terser';
task('compress:js', (done) => {
  const sourceFile = './dist/assets/js/bundle.js';
  const targetFolder = './dist/assets/js';

  src(sourceFile)
    .pipe(terser())
    .pipe(
      rename({
        suffix: `-${id}`,
      })
    )
    .pipe(dest(targetFolder));
  done();
});

// COMPRESS CSS ========================================
import cleanCss from 'gulp-clean-css';

task('compress:css', (done) => {
  const sourceFile = './dist/assets/css/main.css';
  const targetFolder = './dist/assets/css';

  src(sourceFile)
    .pipe(
      cleanCss({
        compatibility: 'ie11',
      })
    )
    .pipe(
      rename({
        suffix: `-${id}`,
      })
    )
    .pipe(dest(targetFolder));
  done();
});

// COMPRESS HTML =======================================
import htmlmin from 'gulp-html-minifier-terser';
task('compress:html', (done) => {
  const sourceFiles = ['./dist/**/*.html', './dist/*.html'];
  const targetFolder = './dist';

  gulp
    .src(sourceFiles)
    .pipe(plumber())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest(targetFolder));

  done();
});

// REPLACE IN FILES ====================================
import replace from 'gulp-replace';

task('replaceString', (done) => {
  return src(['./dist/*.html'])
    .pipe(replace('js/bundle.js', `js/bundle-${id}.js`))
    .pipe(replace('css/main.css', `css/main-${id}.css`))
    .pipe(dest('./dist'));
  done();
});

// SIZE REPORT ==========================================
import sizeReport from 'gulp-sizereport';
task('size', (done) => {
  const sourceFiles = [
    './dist/**/*.html',
    './dev/*.html',
    './dist/**/*.js',
    './dev/*.js',
    './dist/**/*.css',
    './dev/*.css',
  ];

  src(sourceFiles).pipe(sizeReport());

  done();
});

// DEV MODE ===========================================
task('serve', series('html', parallel('css', 'js'), 'fonts', parallel('watcher', 'server')));

// BUILD MODE =========================================
task(
  'build',
  series(
    'clean',
    parallel('css', 'js'),
    'copy',
    'compress:js',
    'compress:css',
    'replaceString',
    'compress:html',
    'size'
  )
);
