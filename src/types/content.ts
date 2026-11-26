export type Bilingual = { ar: string; en: string };

export type ButtonConfig = { label: Bilingual; href: string; style?: string };

export type WorldConfig = {
  background_type: string;
  intensity: number;
  color_accent: string;
  motion_preset: string;
  parallax: boolean;
};

export const defaultWorld: WorldConfig = {
  background_type: "aurora",
  intensity: 0.6,
  color_accent: "#00F0FF",
  motion_preset: "flow",
  parallax: true,
};
