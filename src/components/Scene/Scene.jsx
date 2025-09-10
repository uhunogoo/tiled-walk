import * as THREE from 'three/webgpu';
import React from 'react';

// 3D libraries
import { useControls } from 'leva';
import { Physics } from '@react-three/rapier';
import { Canvas, extend } from '@react-three/fiber';
import { KeyboardControls, PerspectiveCamera } from '@react-three/drei';

// components
import World from '@components/World/World';
import Player from '@components/Player/Player';
import CameraController from '@components/CameraController/CameraController';


extend( THREE );

function Scene() {
  const { debug } = useControls( "Rapier", { debug: true } );
  const [ frameloop, setFrameloop ] = React.useState( "never" );

  const map = React.useMemo(() => [
    { name: 'forward', keys: [ 'ArrowUp', 'KeyW' ] },
    { name: 'backward', keys: [ 'ArrowDown', 'KeyS' ] },
    { name: 'leftward', keys: [ 'ArrowLeft', 'KeyA' ] },
    { name: 'rightward', keys: [ 'ArrowRight', 'KeyD' ] },
    { name: 'jump', keys: [ 'Space' ] }
  ], []);

  return (
    <KeyboardControls map={ map }>
      <Canvas
        style={{ position: 'fixed', top: 0, left: 0, height: "100vh", width: "100vw" }}
        camera={{ position: [4, 4, 0], fov: 45 }}
        frameloop={ frameloop }
        gl={(props) => {
          const renderer = new THREE.WebGPURenderer({
            powerPreference: "high-performance",
            antialias: true,
            alpha: false,
            stencil: false,
            shadowMap: true,
            ...props,
          });
          renderer.init().then(() => {
            setFrameloop("always");
          });
          return renderer;
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 10, 5]} intensity={1} />
        
        <React.Suspense fallback={null}>
          <Physics debug={ debug } gravity={[0, -9.81, 0]}>
            <Player />
            <CameraController />

            <World />
          </Physics>
        </React.Suspense>
        {/* <OrbitControls makeDefault /> */}
      </Canvas>
    </KeyboardControls>
  )
}

export default Scene;