export type WorldConfig = {
  background_type: "none" | "particles" | "aurora" | "code-rain" | "waves" | "morph" | "scene-3d" | "video";
  intensity: number;
  color_accent: string;
  motion_preset: "flow" | "calm" | "energetic";
  parallax: boolean;
};

export const defaultWorld: WorldConfig = {
  background_type: "aurora",
  intensity: 0.45,
  color_accent: "#22D3EE",
  motion_preset: "flow",
  parallax: true,
};

export type Section = {
  id: string;
  section_type:
    | "hero"
    | "text_image"
    | "services_grid"
    | "projects_grid"
    | "video_showcase"
    | "statistics"
    | "testimonials"
    | "faq"
    | "logo_wall"
    | "process_timeline"
    | "cta"
    | "custom_content"
    | "reels";
  title: string;
  content: Record<string, unknown>;
  settings: Record<string, unknown>;
  is_enabled: boolean;
  display_order: number;
};
