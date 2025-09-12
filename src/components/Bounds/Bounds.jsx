// 3D libraries
import { CuboidCollider, RigidBody } from '@react-three/rapier';

function Bounds({ ...delegated }) {
  return (
    <RigidBody type="fixed" restitution={0.2} friction={0}>
      <CuboidCollider 
        args={[ 0.5, 0.1, 0.5 ]}
        restitution={ 0.2 } 
        friction={ 1 }
        {...delegated} 
      />
    </RigidBody>
  )
}

export default Bounds;