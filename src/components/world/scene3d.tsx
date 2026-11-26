"use client";
import { Canvas, useThree } from "@react-three/fiber";
import { ClapperBoard } from "./clapper";

function Board({ accent }: { accent: string }) {
  const { viewport } = useThree();
  const wide = viewport.width > viewport.height;
  const scale = Math.min(1, (viewport.width * (wide ? 0.4 : 0.8)) / 4.4);
  return <ClapperBoard accent={accent} second="#FF2BD6" auto scale={scale} position={[wide ? viewport.width * 0.22 : 0, wide ? 0 : viewport.height * 0.2, 0]} />;
}

/** "scene-3d" world: a neon clapperboard that claps by itself. */
export default function Scene3D({ accent }: { accent: string; speed: number }) {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5], fov: 45 }} gl={{ antialias: true, powerPreference: "low-power" }} style={{ position: "absolute", inset: 0 }}>
      <ambientLight intensity={0.8} />
      <Board accent={accent} />
    </Canvas>
  );
}
