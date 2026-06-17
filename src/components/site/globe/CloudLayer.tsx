import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function CloudLayer() {
  const groupRef = useRef<THREE.Group>(null);

  const cloudPositions = useMemo(() => {
    const pts: number[] = [];
    const count = 400;
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const rOff = 1.005 + Math.random() * 0.01;
      pts.push(Math.cos(theta) * r * rOff, y * rOff, Math.sin(theta) * r * rOff);
    }
    return new Float32Array(pts);
  }, []);

  const cloudGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(cloudPositions, 3));
    return g;
  }, [cloudPositions]);

  const cloudMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: new THREE.Color("#c4b5a0"),
        size: 0.02,
        transparent: true,
        opacity: 0.08,
        sizeAttenuation: true,
      }),
    [],
  );

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      <points geometry={cloudGeo} material={cloudMat} />
    </group>
  );
}
