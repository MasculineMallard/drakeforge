"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree, extend } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water.js";

extend({ Water });

declare module "@react-three/fiber" {
  interface ThreeElements {
    water: any;
  }
}

export default function WaterSurface() {
  const waterRef = useRef<any>(null);
  const { gl } = useThree();

  const waterNormals = useTexture("/textures/waternormals.jpg");
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

  const waterGeometry = useMemo(() => new THREE.PlaneGeometry(100, 100, 1, 1), []);

  const config = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: waterNormals,
      sunDirection: new THREE.Vector3(0.3, 0.5, 0.2),
      sunColor: 0x0a1a3a,
      waterColor: 0x020810,
      distortionScale: 2.0,
      fog: false,
      alpha: 0.9,
    }),
    [waterNormals]
  );

  useFrame((_, delta) => {
    if (waterRef.current) {
      waterRef.current.material.uniforms["time"].value += delta * 0.25;
    }
  });

  return (
    <water
      ref={waterRef}
      args={[waterGeometry, config]}
      rotation-x={-Math.PI / 2}
      position={[0, 0, 0]}
    />
  );
}
