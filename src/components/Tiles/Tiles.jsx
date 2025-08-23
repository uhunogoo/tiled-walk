import React from 'react';
import { worldToGrid } from '@lib/utils';
import useGame from '@stores/useGame';
import { useFrame } from '@react-three/fiber';
import useMapGenerate from '@hooks/useMapGenerate';

const materials = [
  "black",
  "white",
  "red"
];

function Tiles({ renderRadius = 2, rows = 11, columns = 11, position = [0, 0, 0], ...delegated }) {
  const player = useGame((state) => state.player);
  const phase = useGame((state) => state.phase);

  // generate map
  const mapTiles = useMapGenerate( rows, columns );
  
  // current grid position
  const [gridPos, setGridPos] = React.useState([ 0, 0 ]);

  // move tiles with grid around player
  const cells = React.useMemo(() => {
    const [pr, pc] = gridPos;
    const arr = [];
    for (let r = pr - renderRadius; r <= pr + renderRadius; r++) {
      for (let c = pc - renderRadius; c <= pc + renderRadius; c++) {
        if (r < 0 || r >= rows || c < 0 || c >= columns) continue;
        arr.push({ r, c, key: `${r}-${c}` });
      }
    }
    return arr;
  }, [ gridPos, renderRadius, rows, columns ]);

  // update grid position
  useFrame(() => {
    if (phase === "playing") {
      const { x, z } = player.current.translation();
      const [pr, pc] = worldToGrid(x, z);
      if ( gridPos[0] !== pr || gridPos[1] !== pc ) {
        console.log(pr, pc);
        setGridPos([pr, pc]);
      }
    }
  });

  return (
    <group dispose={ null } position={ position } { ...delegated }>
      { cells.map( ({ r, c, key }) => {
        const tile = mapTiles[r][c];
        
        return (
          <mesh
            key={key}
            scale={[0.9, 0.1, 0.9]}
            position={[c + 0.5, 0, (r + 0.5) - rows ]}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicNodeMaterial color={ materials[tile] } />
          </mesh>
        )
      }) }
    </group>
  )
}

export default Tiles;

// function generateSnakePath(matrix) {
//   const rows = matrix.length;
//   const cols = matrix[0].length;

//   // очистка
//   for (let y = 0; y < rows; y++) {
//     for (let x = 0; x < cols; x++) {
//       matrix[y][x] = 0;
//     }
//   }

//   const startSide = Math.random() < 0.5 ? "top" : "bottom";
//   const endSide = startSide === "top" ? "bottom" : "top";

//   const startX = Math.floor(Math.random() * cols);
//   const startY = startSide === "top" ? 0 : rows - 1;

//   const endX = Math.floor(Math.random() * cols);
//   const endY = endSide === "top" ? 0 : rows - 1;

//   let [x, y] = [startX, startY];
//   matrix[y][x] = 1;

//   let maxSteps = rows * cols * 2; // захист від зависання

//   while (!(x === endX && y === endY) && maxSteps-- > 0) {
//     let options = [];

//     // напрямок у бік фінішу
//     if (endY > y && y + 1 < rows) options.push([x, y + 1]);
//     if (endY < y && y - 1 >= 0) options.push([x, y - 1]);

//     // невелике відхилення вліво/вправо
//     if (Math.random() < 0.5) {
//       if (x > 0) options.push([x - 1, y]);
//       if (x < cols - 1) options.push([x + 1, y]);
//     }

//     // відфільтруємо вже зайняті
//     options = options.filter(([nx, ny]) => matrix[ny][nx] === 0);

//     if (options.length === 0) {
//       break; // більше ходити нема куди → виходимо
//     }

//     // випадковий вибір із доступних
//     let [nx, ny] = options[Math.floor(Math.random() * options.length)];

//     // рухаємося
//     x = nx;
//     y = ny;
//     matrix[y][x] = 1;
//   }

//   return matrix;
// }
