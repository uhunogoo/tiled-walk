// import React from 'react'
import useGame from '@stores/useGame';

// import { addEffect } from '@react-three/fiber'

export default function Interface() {
  const restart = useGame( (state) => state.restart );
  const phase = useGame( (state) => state.phase );
  
  return (
    <div className="interface">
      {/* Restart */}
      { phase === 'end' && (
        <div style={{ background: 'white', borderRadius: '10px', padding: '10px', cursor: 'pointer', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 100 }} onClick={ restart }>Restart</div>
      ) }
    </div>
  )
}