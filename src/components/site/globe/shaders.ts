import { useMemo } from "react";
import * as THREE from "three";
import { CEDAR } from "./data";

const atmosphereVertexShader = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragmentShader = `
  varying vec3 vNormal;
  uniform vec3 uColor;
  uniform float uIntensity;
  void main() {
    float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
    gl_FragColor = vec4(uColor, 1.0) * intensity * uIntensity;
  }
`;

export function useAtmosphereMaterial(intensity: number) {
  return useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: atmosphereVertexShader,
        fragmentShader: atmosphereFragmentShader,
        uniforms: {
          uColor: { value: CEDAR },
          uIntensity: { value: intensity },
        },
        transparent: true,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [intensity],
  );
}

const arcVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const arcFragmentShader = `
  varying vec2 vUv;
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uSpeed;
  void main() {
    float flow = fract(vUv.x * 4.0 - uTime * uSpeed);
    float pulse = smoothstep(0.0, 0.15, flow) * smoothstep(0.4, 0.15, flow);
    float base = 0.25;
    float alpha = base + pulse * 0.75;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

export function useArcMaterial(speed: number) {
  return useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: arcVertexShader,
        fragmentShader: arcFragmentShader,
        uniforms: {
          uColor: { value: CEDAR },
          uTime: { value: 0 },
          uSpeed: { value: speed },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [speed],
  );
}
