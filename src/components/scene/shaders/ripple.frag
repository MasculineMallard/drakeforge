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
