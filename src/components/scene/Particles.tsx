"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const fireflyVertexShader = `
uniform float uTime;

attribute vec3 aOffset;
attribute float aSpeed;
attribute float aPhase;

varying float vAlpha;

void main() {
  // Lissajous drift pattern
  float t = uTime * aSpeed + aPhase;

  vec3 pos = position;
  pos.x += sin(t * 0.5) * 2.0 + aOffset.x;
  pos.y += cos(t * 0.7) * 1.5 + aOffset.y + sin(t * 0.3) * 0.5;
  pos.z += sin(t * 0.4) * 2.0 + aOffset.z;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // Size attenuation
  float distance = length(mvPosition.xyz);
  gl_PointSize = (30.0 / distance) * (1.0 + sin(t * 2.0) * 0.3);

  // Oscillating alpha (fade in/out)
  vAlpha = (sin(t * 1.5 + aPhase) * 0.5 + 0.5) * 0.8 + 0.2;
}
`;

const fireflyFragmentShader = `
varying float vAlpha;

void main() {
  // Soft circular glow (radial gradient)
  vec2 center = gl_PointCoord - vec2(0.5);
  float dist = length(center);

  // Smooth falloff
  float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
  alpha = pow(alpha, 2.0);

  // Warm yellow-gold color with slight variation
  vec3 color1 = vec3(1.0, 0.9, 0.4); // Warm yellow
  vec3 color2 = vec3(1.0, 0.7, 0.2); // Orange-gold

  vec3 color = mix(color1, color2, dist);

  // Add bright core
  float core = 1.0 - smoothstep(0.0, 0.2, dist);
  color += vec3(1.0) * core * 0.5;

  // Apply alpha from vertex shader
  alpha *= vAlpha;

  if (alpha < 0.01) discard;

  gl_FragColor = vec4(color, alpha);
}
`;

export default function Particles() {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 150;

  const { geometry, material } = useMemo(() => {
    const geom = new THREE.BufferGeometry();

    const positions = new Float32Array(particleCount * 3);
    const offsets = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    const phases = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      positions[i3] = 0;
      positions[i3 + 1] = 0;
      positions[i3 + 2] = 0;

      offsets[i3] = (Math.random() - 0.5) * 16;
      offsets[i3 + 1] = Math.random() * 2.5 + 0.5;
      offsets[i3 + 2] = (Math.random() - 0.5) * 16;

      speeds[i] = Math.random() * 0.5 + 0.5;
      phases[i] = Math.random() * Math.PI * 2;
    }

    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("aOffset", new THREE.BufferAttribute(offsets, 3));
    geom.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    geom.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader: fireflyVertexShader,
      fragmentShader: fireflyFragmentShader,
      uniforms: {
        uTime: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return { geometry: geom, material: mat };
  }, [particleCount]);

  useFrame(({ clock }) => {
    if (material.uniforms) {
      material.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}
