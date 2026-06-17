import { useMemo } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export function Earth() {
  const [earthMap, bumpMap, nightMap] = useTexture([
    "/img/earth-blue-marble.jpg",
    "/img/earth-topology.png",
    "/img/earth-night.jpg",
  ]);
  earthMap.colorSpace = THREE.SRGBColorSpace;
  nightMap.colorSpace = THREE.SRGBColorSpace;

  const earthGeo = useMemo(() => new THREE.SphereGeometry(1, 128, 128), []);
  const earthMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: earthMap,
        bumpMap: bumpMap,
        bumpScale: 0.03,
        emissiveMap: nightMap,
        emissive: new THREE.Color("#ffaa66"),
        emissiveIntensity: 0.4,
        roughness: 0.7,
        metalness: 0.05,
      }),
    [earthMap, bumpMap, nightMap],
  );

  return <mesh geometry={earthGeo} material={earthMat} />;
}
