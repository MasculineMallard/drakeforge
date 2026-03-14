"use client";

import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

export default function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.6}
        intensity={0.8}
        radius={0.6}
        mipmapBlur
      />
      <Vignette
        offset={0.3}
        darkness={0.8}
      />
    </EffectComposer>
  );
}
