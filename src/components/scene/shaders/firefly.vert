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
