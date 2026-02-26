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
