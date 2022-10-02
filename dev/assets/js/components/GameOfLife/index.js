import { useRef, useEffect, useState, useCallback } from 'react';

const GameOfLife = (props) => {
  // const {} = props;
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const w = 1000; // breite von canvas
  const h = 800; // höhe von canvas
  const r = 10; // Auflösung bzw. Pixelbreite und -höhe.

  const cols = parseInt(w / r);
  const rows = parseInt(h / r);

  const colsArray = new Array(cols).fill(0);
  const rowsArray = new Array(rows).fill(0);

  const neighbours = [
    [0, -1], // n
    [1, -1], // ne
    [1, 0], // e
    [1, 1], // se
    [0, 1], // s
    [-1, 1], //sw
    [-1, 0], // w
    [-1, -1], // nw
  ];

  const createGrid = (cols, rows) => {
    return Array(rows)
      .fill(0)
      .map(() =>
        Array(cols)
          .fill(0)
          .map(() => Math.floor(Math.random() * 2))
      );
  };

  const createEmptyGrid = (cols, rows) => {
    return Array(rows)
      .fill(0)
      .map(() => Array(cols).fill(0));
  };

  const run = useCallback(() => {
    const ctx = ctxRef.current;
    const copyGrid = [...grid];

    rowsArray.forEach((row, i, rows) => {
      colsArray.forEach((col, j, cols) => {
        const x = j * r;
        const y = i * r;

        // https://math.stackexchange.com/a/1781233
        let nc = 0; // Nachbarschaft-Counter
        neighbours.forEach(([n1, n2]) => {
          const newI = i + n1;
          const newJ = j + n2;

          if (newI > 0 && newI < rows.length && newJ >= 0 && newJ < cols.length) {
            nc += copyGrid[newI][newJ];
          }

          if (nc < 2 || nc > 4) {
            ctx.fillStyle = 'black';
            copyGrid[i][j] = 0; // Zelle stirbt
          } else if (grid[i][j] === 0 && nc === 3) {
            ctx.fillStyle = 'steelblue';
            copyGrid[i][j] = 1;
          }

          ctx.fillRect(x, y, r, r);
        });
      });
      setGrid(copyGrid);
    });
  });
  setTimeout(run, 100);

  //  console.table(createGrid(cols, rows));
  // console.table(createEmptyGrid(cols, rows));

  const [grid, setGrid] = useState(createGrid(cols, rows));

  useEffect(() => {
    console.table(grid);
    const canvas = canvasRef.current;
    canvas.width = w * 2;
    canvas.height = h * 2;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext('2d');
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'red';
    ctx.fillStyle = 'black';
    ctx.lineWidth = '1';
    ctxRef.current = ctx; // Referenz über useRef auch auf Objekt bzw. Variablen möglich

    rowsArray.forEach((row, i) => {
      colsArray.forEach((col, j) => {
        let x = j * r;
        let y = i * r;

        if (grid[i][j] === 1) {
          ctx.fillStyle = 'steelblue';
        } else {
          ctx.fillStyle = 'black';
        }

        ctx.fillRect(x, y, r, r);
      });
    });

    return () => {
      // clean
    };
  }, []);

  return (
    <div className="m-game-of-life game-of-life">
      <div className="container py-5">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default GameOfLife;
