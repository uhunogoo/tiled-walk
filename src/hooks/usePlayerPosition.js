import React from 'react';

function usePlayerPosition( player ) {
  const [ position, setPosition ] = React.useState( { x: 0, y: 0, z: 0 } );

  React.useEffect(() => {
    if (!player) return;
    
    const intervalId = window.setInterval(() => {
      const newPosition = player.current.translation();
      setPosition(newPosition);
    }, 1000);
    
    return () => {
      window.clearInterval( intervalId );
    };
  }, [ player ]);

  return position;
}

export default usePlayerPosition;