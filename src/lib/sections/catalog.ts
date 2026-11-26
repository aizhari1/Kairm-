import type { SectionType, WorldConfig } from "@/types/content";
import type { FieldSpec } from "@/lib/spec/types";

const heading: FieldSpec[] = [
  { kind: "bi", key: "eyebrow", label: "Small label above the heading" },
  { kind: "bi", key: "heading", label: "Heading" },
  { kind: "bi", key: "body", label: "Text", long: true },
];
const buttons: FieldSpec = { kind: "buttons", key: "buttons", label: "Buttons" };

export type SectionDef = { label: string; description: string; fields: FieldSpec[]; world?: Partial<WorldConfig> };

export const SECTION_CATALOG: Record<SectionType, SectionDef> = {
  hero: {
    label: "Hero",
    description: "Big opening section with heading, buttons and optional media.",
    fields: [...heading, buttons, { kind: "media", key: "media", label: "Image or video poster", folder: "sections" }, { kind: "video", key: "video_url", label: "Background video URL", folder: "sections" }],
    world: { background_type: "aurora", intensity: 0.7 },
  },
  text_image: {
    label: "Text + image",
    description: "Copy beside an image.",
    fields: [...heading, { kind: "image", key: "image", label: "Image", folder: "sections" }, buttons],
  },
  services_grid: {
    label: "Services grid",
    description: "Pulls published services from the CMS.",
    fields: [...heading, { kind: "number", key: "limit", label: "Max items", min: 1, max: 24, default: 6 }],
  },
  projects_grid: {
    label: "Projects grid",
    description: "Featured or recent projects.",
    fields: [...heading, { kind: "bool", key: "only_featured", label: "Only featured", default: true }, { kind: "number", key: "limit", label: "Max items", min: 1, max: 24, default: 6 }],
  },
  video_showcase: {
    label: "Video showcase",
    description: "Embedded video with poster.",
    fields: [...heading, { kind: "video", key: "video_url", label: "Video", folder: "sections" }, { kind: "media", key: "poster", label: "Poster", folder: "sections" }],
  },
  statistics: {
    label: "Statistics",
    description: "Big numbers with labels.",
    fields: [...heading, { kind: "items", key: "items", label: "Stats", itemLabel: "Stat", max: 8, fields: [{ kind: "text", key: "value", label: "Value" }, { kind: "bi", key: "label", label: "Label" }] }],
  },
  testimonials: {
    label: "Testimonials",
    description: "Quotes from the testimonials collection.",
    fields: [...heading, { kind: "number", key: "limit", label: "Max items", min: 1, max: 20, default: 6 }],
  },
  faq: {
    label: "FAQ",
    description: "Questions and answers.",
    fields: [...heading, { kind: "items", key: "items", label: "Items", itemLabel: "Q&A", max: 20, fields: [{ kind: "bi", key: "q", label: "Question" }, { kind: "bi", key: "a", label: "Answer", long: true }] }],
  },
  logo_wall: {
    label: "Logo wall",
    description: "Client or partner logos.",
    fields: [...heading, { kind: "medialist", key: "logos", label: "Logos", folder: "sections" }],
  },
  process_timeline: {
    label: "Process timeline",
    description: "Steps in a process.",
    fields: [...heading, { kind: "items", key: "steps", label: "Steps", itemLabel: "Step", max: 10, fields: [{ kind: "bi", key: "title", label: "Title" }, { kind: "bi", key: "body", label: "Body", long: true }] }],
  },
  cta: {
    label: "Call to action",
    description: "Closing banner with buttons.",
    fields: [...heading, buttons],
    world: { background_type: "morph", intensity: 0.5 },
  },
  custom_content: {
    label: "Custom content",
    description: "Flexible text/image block.",
    fields: [...heading, { kind: "image", key: "image", label: "Image", folder: "sections" }, buttons],
  },
  reels: {
    label: "Reels",
    description: "Short vertical videos.",
    fields: [...heading, { kind: "items", key: "items", label: "Reels", itemLabel: "Reel", max: 12, fields: [{ kind: "video", key: "video", label: "Video", folder: "sections" }, { kind: "media", key: "poster", label: "Poster", folder: "sections" }, { kind: "bi", key: "title", label: "Title" }] }],
  },
};

export const SECTION_SETTINGS: FieldSpec[] = [
  { kind: "group", key: "world", label: "World (animated background)", fields: [
    { kind: "select", key: "background_type", label: "Background", options: [
      { value: "none", label: "None" }, { value: "particles", label: "Particles" }, { value: "aurora", label: "Aurora" },
      { value: "code-rain", label: "Code rain" }, { value: "waves", label: "Waves" }, { value: "morph", label: "Morph" },
      { value: "scene-3d", label: "3D scene" }, { value: "video", label: "Video" },
    ] },
    { kind: "number", key: "intensity", label: "Intensity (0 to 1)", min: 0, max: 1, step: 0.05, default: 0.6 },
    { kind: "color", key: "color_accent", label: "Accent color", default: "#00F0FF" },
    { kind: "select", key: "motion_preset", label: "Motion", options: [
      { value: "flow", label: "Flow" }, { value: "calm", label: "Calm" }, { value: "energetic", label: "Energetic" },
    ] },
    { kind: "bool", key: "parallax", label: "Parallax on scroll", default: true },
  ] },
  { kind: "select", key: "layout", label: "Layout", options: [
    { value: "default", label: "Default" }, { value: "reverse", label: "Reverse" },
    { value: "centered", label: "Centered" }, { value: "split", label: "Split" },
  ] },
  { kind: "group", key: "background", label: "Section background", fields: [
    { kind: "select", key: "kind", label: "Kind", options: [
      { value: "solid", label: "Solid" }, { value: "gradient", label: "Gradient" },
      { value: "image", label: "Image" }, { value: "video", label: "Video" },
    ] },
    { kind: "text", key: "value", label: "Value (color or URL)" },
  ] },
  { kind: "group", key: "visibility", label: "Visibility", fields: [
    { kind: "bool", key: "desktop", label: "Show on desktop", default: true },
    { kind: "bool", key: "mobile", label: "Show on mobile", default: true },
  ] },
];
