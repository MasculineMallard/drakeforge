"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface RainSystemProps {
  active: boolean;
  onRipple?: (x: number, z: number) => void;
}

const rainVertexShader = `
attribute float aSpeed;
attribute float aOffset;

varying float vAlpha;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  float distance = length(mvPosition.xyz);
  gl_PointSize = 40.0 / distance;

  // Fade based on height
  vAlpha = smoothstep(-2.0, 2.0, position.y);
}
`;

const rainFragmentShader = `
varying float vAlpha;

void main() {
  vec2 center = gl_PointCoord - vec2(0.5);
  float dist = length(center);

  // Elongated raindrop shape
  float streak = smoothstep(0.5, 0.0, abs(center.x)) * smoothstep(0.8, 0.0, center.y + 0.3);
  float alpha = streak * vAlpha * 0.6;

  if (alpha < 0.01) discard;

  vec3 color = vec3(0.7, 0.8, 1.0); // Light blue-white
  gl_FragColor = vec4(color, alpha);
}
`;

export default function RainSystem({ active, onRipple }: RainSystemProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const dropCount = 500;
  const opacityRef = useRef(0);

  const { geometry, material } = useMemo(() => {
    const geom = new THREE.BufferGeometry();

    const positions = new Float32Array(dropCount * 3);
    const speeds = new Float32Array(dropCount);
    const offsets = new Float32Array(dropCount);

    for (let i = 0; i < dropCount; i++) {
      const i3 = i * 3;

      positions[i3] = (Math.random() - 0.5) * 40;
      positions[i3 + 1] = Math.random() * 20 + 5;
      positions[i3 + 2] = (Math.random() - 0.5) * 40;

      speeds[i] = Math.random() * 0.5 + 0.5;
      offsets[i] = Math.random() * 100;
    }

    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    geom.setAttribute("aOffset", new THREE.BufferAttribute(offsets, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader: rainVertexShader,
      fragmentShader: rainFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      opacity: 0,
    });

    return { geometry: geom, material: mat };
  }, [dropCount]);

  useEffect(() => {
    opacityRef.current = active ? 1 : 0;
  }, [active]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const positions = geometry.attributes.position.array as Float32Array;
    const speeds = geometry.attributes.aSpeed.array as Float32Array;

    for (let i = 0; i < dropCount; i++) {
      const i3 = i * 3;

      positions[i3 + 1] -= speeds[i] * delta * 15;

      if (positions[i3 + 1] < 0) {
        if (onRipple && active) {
          onRipple(positions[i3], positions[i3 + 2]);
        }

        positions[i3] = (Math.random() - 0.5) * 40;
        positions[i3 + 1] = 25;
        positions[i3 + 2] = (Math.random() - 0.5) * 40;
      }
    }

    geometry.attributes.position.needsUpdate = true;

    // Fade in/out
    const targetOpacity = active ? 1 : 0;
    const currentOpacity = (material as any).opacity || 0;
    (material as any).opacity = THREE.MathUtils.lerp(
      currentOpacity,
      targetOpacity,
      delta * 2
    );
  });

  if ((material as any).opacity < 0.01 && !active) {
    return null;
  }

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}
