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
