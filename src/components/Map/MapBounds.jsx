import Bounds from '@components/Bounds/Bounds';

function MapBounds({ rows = null, columns = null}) {
  if (!rows || !columns) return null;

  return (
    <>
      <Bounds args={[ columns * 0.5, 1, 0.1 ]}  position={[ 0, 1, 0.1 ]}/>
      <Bounds args={[ columns * 0.5, 1, 0.1 ]}  position={[ 0, 1, -rows - 0.1 ]}/>

      <Bounds args={[ 0.1, 1, rows * 0.5 ]}  position={[ - columns * 0.5 - 0.1, 1, -rows * 0.5 ]}/>
      <Bounds args={[ 0.1, 1, rows * 0.5 ]}  position={[ columns * 0.5 + 0.1, 1, -rows * 0.5 ]}/>

      <Bounds args={[ columns * 0.5, 0.1, rows * 0.5 ]}  position={[ 0, -0.1, -rows / 2 ]}/>
    </>
  );
}

export default MapBounds