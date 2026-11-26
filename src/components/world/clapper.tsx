"use client";
import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import { CanvasTexture, Group, SRGBColorSpace } from "three";

const OPEN = 0.72;
const pad = (n: number) => String(n).padStart(2, "0");

function texture(c: HTMLCanvasElement) {
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.needsUpdate = true;
  return t;
}

function stripes(a: string, b: string, shift: number) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 64;
  const g = c.getContext("2d")!;
  g.fillStyle = "#070916";
  g.fillRect(0, 0, 512, 64);
  for (let i = -2; i < 12; i++) {
    const o = i * 64 + shift;
    g.fillStyle = i % 2 ? b : a;
    g.beginPath();
    g.moveTo(o, 64);
    g.lineTo(o + 24, 64);
    g.lineTo(o + 56, 0);
    g.lineTo(o + 32, 0);
    g.fill();
  }
  return texture(c);
}

function useBoard(a: string, b: string) {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 640;
    c.height = 352;
    const g = c.getContext("2d")!;
    const tex = texture(c);
    const draw = (take: number) => {
      g.shadowBlur = 0;
      g.fillStyle = "#070916";
      g.fillRect(0, 0, 640, 352);
      g.strokeStyle = a;
      g.lineWidth = 4;
      g.shadowColor = a;
      g.shadowBlur = 12;
      g.strokeRect(6, 6, 628, 340);
      g.beginPath();
      [96, 190, 284].forEach((y) => {
        g.moveTo(6, y);
        g.lineTo(634, y);
      });
      g.moveTo(330, 96);
      g.lineTo(330, 284);
      g.stroke();
      const cell = (label: string, val: string, x: number, y: number) => {
        g.shadowBlur = 0;
        g.fillStyle = "#8feaff";
        g.font = '22px "Share Tech Mono", monospace';
        g.fillText(label, x, y + 26);
        g.shadowColor = b;
        g.shadowBlur = 14;
        g.fillStyle = "#fff";
        g.font = '48px "Share Tech Mono", monospace';
        g.fillText(val, x, y + 78);
      };
      cell("PROD", "KARAM", 22, 6);
      cell("SCENE", "01", 22, 96);
      cell("ROLL", "A", 346, 96);
      cell("TAKE", pad(take), 22, 190);
      cell("EDITOR", "CUTS", 346, 190);
      g.shadowBlur = 0;
      g.fillStyle = "#8feaff";
      g.font = '22px "Share Tech Mono", monospace';
      g.fillText("DATE  " + new Date().toISOString().slice(0, 10), 22, 322);
      tex.needsUpdate = true;
    };
    draw(1);
    return { tex, draw };
  }, [a, b]);
}

function Slab({
  size,
  map,
  edge,
  position,
}: {
  size: [number, number, number];
  map?: CanvasTexture;
  edge: string;
  position?: [number, number, number];
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#0a0c18" map={map ?? null} roughness={0.45} metalness={0.2} />
      <Edges color={edge} threshold={15} />
    </mesh>
  );
}

/** Neon 3D clapperboard. Claps when `clapKey` changes, or on a loop when `auto`. */
export function ClapperBoard({
  accent,
  second,
  auto,
  clapKey = 0,
  scale = 1,
  position = [0, 0, 0] as [number, number, number],
  startOpen = true,
}: {
  accent: string;
  second: string;
  auto?: boolean;
  clapKey?: number;
  scale?: number;
  position?: [number, number, number];
  startOpen?: boolean;
}) {
  const clock = useThree((s) => s.clock);
  const root = useRef<Group>(null);
  const hinge = useRef<Group>(null);
  const clapAt = useRef(startOpen ? -10 : -0.01);
  const ang = useRef(startOpen ? OPEN : 0);
  const take = useRef(1);
  const bumped = useRef(true);
  const board = useBoard(accent, second);
  const bar = useMemo(() => stripes(accent, second, 0), [accent, second]);
  const stick = useMemo(() => stripes(accent, second, 32), [accent, second]);

  const clap = (t: number) => {
    clapAt.current = t;
    bumped.current = false;
  };
  useEffect(() => {
    if (clapKey > 0) clap(clock.elapsedTime);
  }, [clapKey, clock]);

  useFrame(({ clock: ck }, dt) => {
    const t = ck.elapsedTime;
    if (auto && t - clapAt.current > 5) clap(t);
    const since = t - clapAt.current;
    if (!bumped.current && since > 0.55) {
      bumped.current = true;
      take.current++;
      board.draw(take.current);
    }
    const target = since >= 0 && since < 0.5 ? 0 : OPEN;
    ang.current += (target - ang.current) * Math.min(1, dt * (target === 0 ? 28 : 4.5));
    if (hinge.current) hinge.current.rotation.z = ang.current;
    if (root.current) {
      root.current.rotation.y = -0.35 + Math.sin(t * 0.45) * 0.1;
      root.current.position.y = position[1] + Math.sin(t * 0.85) * 0.05;
    }
  });

  return (
    <group ref={root} scale={scale} position={position}>
      <Slab size={[4, 2.2, 0.22]} map={board.tex} edge={accent} />
      <Slab size={[4, 0.42, 0.22]} map={bar} edge={accent} position={[0, 1.32, 0]} />
      <group ref={hinge} position={[-2, 1.55, 0]}>
        <Slab size={[4, 0.42, 0.22]} map={stick} edge={second} position={[2, 0.22, 0.03]} />
      </group>
    </group>
  );
}

export default function ClapperCanvas({
  accent,
  second = "#FF2BD6",
  auto,
  clapKey,
  scale = 0.85,
  cameraZ = 7.2,
}: {
  accent: string;
  second?: string;
  auto?: boolean;
  clapKey?: number;
  scale?: number;
  cameraZ?: number;
}) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0.2, cameraZ], fov: 42 }}
      gl={{ alpha: true, antialias: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 6, 8]} intensity={1.1} />
      <directionalLight position={[-4, -2, 4]} intensity={0.35} color={second} />
      <ClapperBoard accent={accent} second={second} auto={auto} clapKey={clapKey} scale={scale} position={[0, -0.35, 0]} />
    </Canvas>
  );
}
