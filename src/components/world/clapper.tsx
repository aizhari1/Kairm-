"use client";
import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { CanvasTexture, Group, SRGBColorSpace, DoubleSide } from "three";

/** Stick opens this many radians (matches classic slate silhouette). */
const OPEN = 0.55;
const pad = (n: number) => String(n).padStart(2, "0");

function tex(c: HTMLCanvasElement) {
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.needsUpdate = true;
  return t;
}

/** Classic black/white diagonal stripes — same language as the reference slate. */
function stripeStick(w: number, h: number, flip = false) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  g.fillStyle = "#0a0a0a";
  g.fillRect(0, 0, w, h);
  const step = Math.floor(w / 7);
  for (let i = -2; i < 12; i++) {
    const x = i * step + (flip ? step * 0.35 : 0);
    g.fillStyle = i % 2 === 0 ? "#f5f5f5" : "#0a0a0a";
    g.beginPath();
    g.moveTo(x, h);
    g.lineTo(x + step * 0.55, h);
    g.lineTo(x + step * 0.95, 0);
    g.lineTo(x + step * 0.4, 0);
    g.closePath();
    g.fill();
  }
  return tex(c);
}

/** Slate body: pure black with thin white field lines (like the reference). */
function useSlateFace() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 640;
    c.height = 400;
    const g = c.getContext("2d")!;
    const texture = tex(c);
    const draw = (take: number) => {
      g.fillStyle = "#0a0a0a";
      g.fillRect(0, 0, 640, 400);
      g.strokeStyle = "#f0f0f0";
      g.lineWidth = 3;
      g.beginPath();
      [100, 200, 300].forEach((y) => {
        g.moveTo(24, y);
        g.lineTo(616, y);
      });
      g.moveTo(213, 300);
      g.lineTo(213, 376);
      g.moveTo(427, 300);
      g.lineTo(427, 376);
      g.stroke();

      const label = (t: string, x: number, y: number) => {
        g.fillStyle = "#b0b0b0";
        g.font = '700 18px "Space Grotesk", "Share Tech Mono", sans-serif';
        g.fillText(t, x, y);
      };
      const value = (t: string, x: number, y: number) => {
        g.fillStyle = "#ffffff";
        g.font = '700 36px "Space Grotesk", "Share Tech Mono", sans-serif';
        g.fillText(t, x, y);
      };
      label("PRODUCTION", 36, 40);
      value("KLAKET", 36, 78);
      label("SCENE", 36, 140);
      value("01", 36, 178);
      label("TAKE", 340, 140);
      value(pad(take), 340, 178);
      label("ROLL", 36, 240);
      value("A", 36, 278);
      label("DATE", 340, 240);
      value(new Date().toISOString().slice(5, 10), 340, 278);
      texture.needsUpdate = true;
    };
    draw(1);
    return { texture, draw };
  }, []);
}

function Box({
  args,
  position,
  map,
  color = "#0a0a0a",
}: {
  args: [number, number, number];
  position?: [number, number, number];
  map?: CanvasTexture;
  color?: string;
}) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} map={map ?? null} roughness={0.55} metalness={0.05} side={DoubleSide} />
    </mesh>
  );
}

export function ClapperBoard({
  auto,
  clapKey = 0,
  scale = 1,
  position = [0, 0, 0] as [number, number, number],
}: {
  accent?: string;
  second?: string;
  auto?: boolean;
  clapKey?: number;
  scale?: number;
  position?: [number, number, number];
}) {
  const clock = useThree((s) => s.clock);
  const root = useRef<Group>(null);
  const hinge = useRef<Group>(null);
  const clapAt = useRef(-10);
  const ang = useRef(OPEN);
  const take = useRef(1);
  const bumped = useRef(true);
  const face = useSlateFace();
  const stickMap = useMemo(() => stripeStick(512, 96, false), []);
  const barMap = useMemo(() => stripeStick(512, 96, true), []);

  const clap = (t: number) => {
    clapAt.current = t;
    bumped.current = false;
  };
  useEffect(() => {
    if (clapKey > 0) clap(clock.elapsedTime);
  }, [clapKey, clock]);

  useFrame(({ clock: ck }, dt) => {
    const t = ck.elapsedTime;
    if (auto && t - clapAt.current > 5.2) clap(t);
    const since = t - clapAt.current;
    if (!bumped.current && since > 0.5) {
      bumped.current = true;
      take.current++;
      face.draw(take.current);
    }
    const target = since >= 0 && since < 0.45 ? 0 : OPEN;
    ang.current += (target - ang.current) * Math.min(1, dt * (target === 0 ? 32 : 4.2));
    if (hinge.current) hinge.current.rotation.z = ang.current;
    if (root.current) {
      root.current.rotation.y = -0.28 + Math.sin(t * 0.4) * 0.08;
      root.current.position.y = position[1] + Math.sin(t * 0.7) * 0.04;
    }
  });

  return (
    <group ref={root} scale={scale} position={position}>
      <Box args={[4.2, 2.6, 0.18]} map={face.texture} position={[0, -0.15, 0]} />
      <Box args={[4.2, 0.48, 0.2]} map={barMap} position={[0, 1.28, 0.02]} />
      <group ref={hinge} position={[-2.05, 1.52, 0.04]}>
        <Box args={[4.2, 0.48, 0.18]} map={stickMap} position={[2.05, 0.28, 0]} />
        <mesh position={[0.05, 0, 0.12]}>
          <cylinderGeometry args={[0.07, 0.07, 0.22, 16]} />
          <meshStandardMaterial color="#e8e8e8" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

export default function ClapperCanvas({
  accent = "#00F0FF",
  second = "#FF2BD6",
  auto,
  clapKey,
  scale = 0.9,
  cameraZ = 7,
}: {
  accent?: string;
  second?: string;
  auto?: boolean;
  clapKey?: number;
  scale?: number;
  cameraZ?: number;
}) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.15, cameraZ], fov: 40 }}
      gl={{ alpha: true, antialias: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 8, 6]} intensity={1.15} />
      <directionalLight position={[-5, 2, 4]} intensity={0.35} />
      <ClapperBoard auto={auto} clapKey={clapKey} scale={scale} position={[0, -0.2, 0]} />
    </Canvas>
  );
}
