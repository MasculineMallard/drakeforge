"use client";

import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

export default function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.3}
        intensity={1.5}
        radius={0.8}
        mipmapBlur
      />
      <Vignette
        offset={0.3}
        darkness={0.7}
      />
    </EffectComposer>
  );
}
