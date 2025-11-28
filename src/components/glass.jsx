/* LensOnly.jsx — The smallest possible lens component */

import * as THREE from 'three';
import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useFBO, useGLTF, MeshTransmissionMaterial } from '@react-three/drei';
import { easing } from 'maath';

export default function LensOnly({
  glb = "/assets/3d/lens.glb",
  geometryKey = "Cylinder",
  props = {}
}) {
  const ref = useRef();
  const buffer = useFBO();
  const { nodes } = useGLTF(glb);

  useFrame((state, delta) => {
    const { gl, camera, pointer, viewport } = state;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);

    // Lens follows the cursor
    const destX = (pointer.x * v.width) / 2;
    const destY = (pointer.y * v.height) / 2;

    easing.damp3(ref.current.position, [destX, destY, 15], 0.15, delta);

    // Render the scene into buffer
    gl.setRenderTarget(buffer);
    gl.render(state.scene, camera);
    gl.setRenderTarget(null);
  });

  return (
    <mesh
      ref={ref}
      geometry={nodes[geometryKey].geometry}
      scale={0.15}
      rotation-x={Math.PI / 2}
      {...props}
    >
      <MeshTransmissionMaterial
        buffer={buffer.texture}
        ior={1.15}
        thickness={5}
        chromaticAberration={0.1}
        anisotropy={0.01}
      />
    </mesh>
  );
}
