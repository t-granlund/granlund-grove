import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useArcMaterial } from "./shaders";
import { latLngToVector3 } from "./math";
import { ARCS, LOCATIONS } from "./data";

function buildSurfaceArc(from: THREE.Vector3, to: THREE.Vector3, lift = 0.15): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const start = from.clone().normalize();
  const end = to.clone().normalize();

  const dot = Math.max(-1, Math.min(1, start.dot(end)));
  const angle = Math.acos(dot);
  const steps = Math.max(16, Math.ceil(angle * 20));

  const axis = new THREE.Vector3().crossVectors(start, end).normalize();
  if (axis.lengthSq() < 0.001) {
    for (let i = 0; i <= steps; i++) {
      points.push(new THREE.Vector3().lerpVectors(start, end, i / steps));
    }
    return points;
  }

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const h = 1 + lift * Math.sin(t * Math.PI);
    const q = new THREE.Quaternion().setFromAxisAngle(axis, angle * t);
    const p = start.clone().applyQuaternion(q).multiplyScalar(h);
    points.push(p);
  }
  return points;
}

function AnimatedArc({
  from,
  to,
  speed = 0.3,
}: {
  from: THREE.Vector3;
  to: THREE.Vector3;
  speed?: number;
}) {
  const material = useArcMaterial(speed);

  const geometry = useMemo(() => {
    const pts = buildSurfaceArc(from, to, 0.12);
    const curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.5);
    return new THREE.TubeGeometry(curve, 64, 0.003, 6, false);
  }, [from, to]);

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return <mesh geometry={geometry} material={material} />;
}

export function Arcs({ positions }: { positions: THREE.Vector3[] }) {
  return (
    <>
      {ARCS.map(([from, to], i) => (
        <AnimatedArc
          key={i}
          from={positions[from]}
          to={positions[to]}
          speed={0.2 + (i % 3) * 0.1}
        />
      ))}
    </>
  );
}
