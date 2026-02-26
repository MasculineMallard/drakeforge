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
