import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/ui";
import { getProjects, getSections, getServices, getTestimonials } from "@/lib/data";
import { RenderSection } from "@/components/sections/render";
import { EditorHero } from "@/components/sections/editor-hero";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const ui = t(locale);

  const sections = await getSections();
  const types = new Set(sections.data.map((s) => s.section_type));
  const [services, projects, testimonials] = await Promise.all([
    types.has("services_grid") ? getServices() : { data: [], error: false },
    types.has("projects_grid") ? getProjects() : { data: [], error: false },
    types.has("testimonials") ? getTestimonials() : { data: [], error: false },
  ]);

  return (
    <div className="pt-16">
      <EditorHero locale={locale} />
      {sections.error && <p role="alert" className="px-5 py-10 text-center text-muted">{ui.error}</p>}
      {sections.data.map((section) => (
        <RenderSection key={section.id} section={section} locale={locale} data={{ services: services.data, projects: projects.data, testimonials: testimonials.data }} />
      ))}
    </div>
  );
}
