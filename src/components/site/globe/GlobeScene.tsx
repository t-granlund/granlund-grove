import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { Earth } from "./Earth";
import { Atmosphere } from "./Atmosphere";
import { CloudLayer } from "./CloudLayer";
import { Arcs } from "./Arcs";
import { Markers } from "./Markers";
import { latLngToVector3 } from "./math";
import { LOCATIONS } from "./data";

export function GlobeScene({
  onSelectLocation,
  selectedIndex,
}: {
  onSelectLocation: (index: number) => void;
  selectedIndex: number | null;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Respect prefers-reduced-motion — the globe auto-rotation is JS-driven, so
  // the CSS media query in styles.css can't reach it. Read it once on mount.
  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  useFrame((_, delta) => {
    if (groupRef.current && !reducedMotion) {
      // clamp delta so a tab regaining focus doesn't jump the rotation
      groupRef.current.rotation.y += Math.min(delta, 0.05) * 0.05;
    }
  });

  const positions = useMemo(() => LOCATIONS.map((l) => latLngToVector3(l.lat, l.lng, 1.0)), []);

  const dotPositions = useMemo(() => {
    const pts: number[] = [];
    const count = 1500;
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;
      pts.push(Math.cos(theta) * r * 1.002, y * 1.002, Math.sin(theta) * r * 1.002);
    }
    return new Float32Array(pts);
  }, []);

  const dotGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(dotPositions, 3));
    return g;
  }, [dotPositions]);

  const dotMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: new THREE.Color("#5a6a60"),
        size: 0.006,
        transparent: true,
        opacity: 0.25,
        sizeAttenuation: true,
      }),
    [],
  );

  return (
    <>
      <hemisphereLight color="#e8d5c0" groundColor="#1a1f1c" intensity={0.4} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} color="#e8d5c0" />
      <directionalLight position={[-3, -2, -3]} intensity={0.3} color="#8a9a90" />
      <Stars radius={60} depth={50} count={2000} factor={4} saturation={0} fade />

      <group ref={groupRef}>
        <Earth />
        <points geometry={dotGeo} material={dotMat} />
        <CloudLayer />
        <Atmosphere scale={1.08} intensity={0.6} />
        <Atmosphere scale={1.22} intensity={0.25} />
        <Arcs positions={positions} />
        <Markers positions={positions} selectedIndex={selectedIndex} onSelect={onSelectLocation} />
      </group>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        rotateSpeed={0.4}
        minPolarAngle={Math.PI * 0.15}
        maxPolarAngle={Math.PI * 0.85}
      />
    </>
  );
}
