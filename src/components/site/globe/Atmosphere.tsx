import { useAtmosphereMaterial } from "./shaders";

export function Atmosphere({
  scale = 1.18,
  intensity = 1.0,
}: {
  scale?: number;
  intensity?: number;
}) {
  const material = useAtmosphereMaterial(intensity);
  return (
    <mesh scale={[scale, scale, scale]} material={material}>
      <sphereGeometry args={[1, 64, 64]} />
    </mesh>
  );
}
