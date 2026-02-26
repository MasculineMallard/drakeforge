"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useFBO } from "@react-three/drei";
import * as THREE from "three";

const waterVertexShader = `
uniform float uTime;
uniform sampler2D uRippleTexture;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);

  vec3 pos = position;

  // Layered sine waves for gentle undulation
  float wave1 = sin(pos.x * 0.5 + uTime * 0.3) * 0.15;
  float wave2 = sin(pos.z * 0.7 - uTime * 0.4) * 0.1;
  float wave3 = sin((pos.x + pos.z) * 0.3 + uTime * 0.2) * 0.08;

  // Sample ripple texture for mouse-driven displacement
  vec4 ripple = texture2D(uRippleTexture, uv);
  float rippleDisplacement = ripple.r * 0.5;

  // Combine all displacement
  pos.y += wave1 + wave2 + wave3 + rippleDisplacement;

  vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
  vWorldPosition = worldPosition.xyz;

  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`;

const waterFragmentShader = `
uniform float uTime;
uniform sampler2D uRippleTexture;
uniform vec2 uMousePos;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;

// Hash function for pseudo-random noise
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// Smooth noise
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

void main() {
  // Base dark blue color
  vec3 deepColor = vec3(0.012, 0.051, 0.102); // #030d1a
  vec3 shallowColor = vec3(0.039, 0.086, 0.157); // #0a1628

  // Animated caustics using layered sine waves
  float caustic1 = sin(vUv.x * 10.0 + uTime * 0.5) * sin(vUv.y * 10.0 - uTime * 0.3);
  float caustic2 = sin(vUv.x * 15.0 - uTime * 0.4) * sin(vUv.y * 12.0 + uTime * 0.6);
  float caustics = (caustic1 + caustic2) * 0.5 + 0.5;
  caustics = pow(caustics, 3.0) * 0.15;

  // Sample ripple texture
  vec4 ripple = texture2D(uRippleTexture, vUv);
  float rippleStrength = ripple.r;

  // Bioluminescent ripple highlights
  vec3 rippleColor = vec3(0.2, 0.8, 0.9); // Teal
  vec3 rippleColor2 = vec3(0.6, 0.3, 0.8); // Purple
  vec3 glowColor = mix(rippleColor, rippleColor2, sin(uTime * 2.0) * 0.5 + 0.5);

  // Create ring effect from ripples
  float rippleRing = smoothstep(0.3, 0.5, rippleStrength) - smoothstep(0.5, 0.7, rippleStrength);
  rippleRing *= 2.0;

  // Fresnel effect (edges brighter)
  vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
  float fresnel = pow(1.0 - max(0.0, dot(viewDirection, vNormal)), 3.0);
  fresnel *= 0.4;

  // Moonlight specular
  vec3 lightDir = normalize(vec3(0.5, 1.0, 0.3));
  vec3 halfVector = normalize(lightDir + viewDirection);
  float specular = pow(max(0.0, dot(vNormal, halfVector)), 32.0);
  specular *= 0.3;

  // Noise-based subtle surface variation
  float surfaceNoise = noise(vUv * 20.0 + uTime * 0.1);
  surfaceNoise = surfaceNoise * 0.05;

  // Combine all effects
  vec3 baseColor = mix(deepColor, shallowColor, vUv.y);
  baseColor += caustics;
  baseColor += glowColor * rippleRing;
  baseColor += fresnel * vec3(0.1, 0.3, 0.4);
  baseColor += specular * vec3(0.8, 0.9, 1.0);
  baseColor += surfaceNoise;

  // Subtle pulsing glow
  float pulse = sin(uTime * 0.8) * 0.5 + 0.5;
  baseColor += glowColor * pulse * 0.05;

  gl_FragColor = vec4(baseColor, 0.85);
}
`;

const rippleVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const rippleFragmentShader = `
uniform sampler2D uPrevTexture;
uniform sampler2D uCurrentTexture;
uniform vec2 uResolution;
uniform float uDamping;
uniform vec4 uDrops[5]; // xy: position, z: radius, w: strength

varying vec2 vUv;

void main() {
  vec2 texel = 1.0 / uResolution;

  // Sample current and previous states
  float current = texture2D(uCurrentTexture, vUv).r;
  float prev = texture2D(uPrevTexture, vUv).r;

  // Sample neighbors
  float left = texture2D(uCurrentTexture, vUv + vec2(-texel.x, 0.0)).r;
  float right = texture2D(uCurrentTexture, vUv + vec2(texel.x, 0.0)).r;
  float top = texture2D(uCurrentTexture, vUv + vec2(0.0, texel.y)).r;
  float bottom = texture2D(uCurrentTexture, vUv + vec2(0.0, -texel.y)).r;

  // Wave equation: new = (neighbors_avg * 2 - previous) * damping
  float neighborsAvg = (left + right + top + bottom) * 0.25;
  float newHeight = (neighborsAvg * 2.0 - prev) * uDamping;

  // Add new drops
  for (int i = 0; i < 5; i++) {
    vec4 drop = uDrops[i];
    if (drop.w > 0.0) {
      float dist = distance(vUv, drop.xy);
      if (dist < drop.z) {
        float influence = (1.0 - dist / drop.z) * drop.w;
        newHeight += influence;
      }
    }
  }

  // Clamp to prevent runaway values
  newHeight = clamp(newHeight, -1.0, 1.0);

  gl_FragColor = vec4(newHeight, 0.0, 0.0, 1.0);
}
`;

export default function WaterSurface() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { gl } = useThree();

  const rippleRes = 512;
  const fboA = useFBO(rippleRes, rippleRes, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
  });
  const fboB = useFBO(rippleRes, rippleRes, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
  });

  const rippleScene = useMemo(() => new THREE.Scene(), []);
  const rippleCamera = useMemo(
    () => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1),
    []
  );

  const rippleMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: rippleVertexShader,
        fragmentShader: rippleFragmentShader,
        uniforms: {
          uPrevTexture: { value: null },
          uCurrentTexture: { value: null },
          uResolution: { value: new THREE.Vector2(rippleRes, rippleRes) },
          uDamping: { value: 0.98 },
          uDrops: {
            value: [
              new THREE.Vector4(0, 0, 0, 0),
              new THREE.Vector4(0, 0, 0, 0),
              new THREE.Vector4(0, 0, 0, 0),
              new THREE.Vector4(0, 0, 0, 0),
              new THREE.Vector4(0, 0, 0, 0),
            ],
          },
        },
      }),
    [rippleRes]
  );

  const rippleMesh = useMemo(() => {
    const geom = new THREE.PlaneGeometry(2, 2);
    return new THREE.Mesh(geom, rippleMaterial);
  }, [rippleMaterial]);

  useMemo(() => {
    rippleScene.add(rippleMesh);
  }, [rippleScene, rippleMesh]);

  const waterMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: waterVertexShader,
        fragmentShader: waterFragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uRippleTexture: { value: fboA.texture },
          uMousePos: { value: new THREE.Vector2(0, 0) },
        },
        transparent: true,
        side: THREE.DoubleSide,
      }),
    [fboA.texture]
  );

  const pingPong = useRef({ current: fboA, prev: fboB });

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    waterMaterial.uniforms.uTime.value = time;

    // Decay drops
    rippleMaterial.uniforms.uDrops.value.forEach((drop: THREE.Vector4) => {
      drop.w *= 0.95;
    });

    // Ping-pong ripple simulation
    rippleMaterial.uniforms.uCurrentTexture.value = pingPong.current.current.texture;
    rippleMaterial.uniforms.uPrevTexture.value = pingPong.current.prev.texture;

    const temp = pingPong.current.prev;
    pingPong.current.prev = pingPong.current.current;
    pingPong.current.current = temp;

    gl.setRenderTarget(pingPong.current.current);
    gl.render(rippleScene, rippleCamera);
    gl.setRenderTarget(null);

    waterMaterial.uniforms.uRippleTexture.value = pingPong.current.current.texture;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} material={waterMaterial}>
      <planeGeometry args={[40, 40, 128, 128]} />
    </mesh>
  );
}
