import Image from "next/image";
import { FiArrowUpRight, FiGithub, FiPlus } from "react-icons/fi";
import { archive, projects, type Project } from "../data";
import SectionHeader from "./SectionHeader";

function ExternalLink({
  href,
  label,
  project,
  icon,
}: {
  href: string;
  label: string;
  project: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium link-underline"
    >
      {icon}
      {label}
      <span className="sr-only">
        {" "}
        for {project} (opens in a new tab)
      </span>
    </a>
  );
}

function ProjectMedia({
  project,
  sizes,
  className = "",
}: {
  project: Project;
  sizes: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-line bg-surface ${className}`}
    >
      {project.image ? (
        <Image
          src={project.image}
          alt={project.imageAlt ?? ""}
          fill
          sizes={sizes}
          placeholder="blur"
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      ) : (
        // Typographic cover for projects without a screenshot
        <div
          aria-hidden="true"
          className="absolute inset-0 flex flex-col justify-between bg-ink p-6 text-paper sm:p-8"
        >
          <span className="eyebrow text-paper/60">{project.kind}</span>
          <span className="display text-5xl sm:text-6xl [text-wrap:balance]">
            {project.title}
          </span>
          <span className="flex flex-wrap gap-x-3 font-mono text-xs text-paper/60">
            {project.stack.slice(0, 4).map((s) => (
              <span key={s}>{s}</span>
            ))}
          </span>
        </div>
      )}
    </div>
  );
}

function ProjectLinks({ project }: { project: Project }) {
  if (!project.live && !project.github) return null;
  return (
    <div className="flex flex-wrap gap-x-6">
      {project.live && (
        <ExternalLink
          href={project.live}
          label="Live site"
          project={project.title}
          icon={<FiArrowUpRight aria-hidden="true" />}
        />
      )}
      {project.github && (
        <ExternalLink
          href={project.github}
          label="GitHub"
          project={project.title}
          icon={<FiGithub aria-hidden="true" />}
        />
      )}
    </div>
  );
}

function Stack({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
      {items.map((item) => (
        <li key={item} className="chip">
          {item}
        </li>
      ))}
    </ul>
  );
}

function ProjectMeta({ project }: { project: Project }) {
  return (
    <p className="eyebrow flex flex-wrap gap-x-3">
      <span>{project.kind}</span>
      {project.year && <span>{project.year}</span>}
    </p>
  );
}

function FeaturedProject({ project }: { project: Project }) {
  return (
    <article
      aria-labelledby={`project-${project.slug}`}
      className="group reveal grid gap-8 md:grid-cols-12"
    >
      <ProjectMedia
        project={project}
        sizes="(max-width: 768px) 100vw, 60vw"
        className="aspect-[16/10] md:sticky md:top-24 md:col-span-7 md:self-start"
      />
      <div className="flex flex-col gap-5 md:col-span-5">
        <ProjectMeta project={project} />
        <h3
          id={`project-${project.slug}`}
          className="display text-5xl lg:text-6xl"
        >
          {project.title}
        </h3>
        <p className="leading-relaxed text-muted">{project.description}</p>
        {project.highlights && (
          <ul className="space-y-2 text-sm leading-relaxed">
            {project.highlights.map((h) => (
              <li key={h} className="flex gap-3">
                <span aria-hidden="true" className="mt-2 h-px w-3 shrink-0 bg-accent" />
                {h}
              </li>
            ))}
          </ul>
        )}
        <Stack items={project.stack} />
        <ProjectLinks project={project} />
      </div>
    </article>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      aria-labelledby={`project-${project.slug}`}
      className="group reveal flex flex-col gap-5"
    >
      <ProjectMedia
        project={project}
        sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 600px"
        className="aspect-[16/10]"
      />
      <div className="flex flex-1 flex-col gap-4">
        <ProjectMeta project={project} />
        <h3
          id={`project-${project.slug}`}
          className="display text-4xl"
        >
          {project.title}
        </h3>
        <p className="leading-relaxed text-muted">{project.description}</p>
        <Stack items={project.stack} />
        <div className="mt-auto">
          <ProjectLinks project={project} />
        </div>
      </div>
    </article>
  );
}

export default function Portfolio() {
  const [featured, ...rest] = projects;

  return (
    <section
      id="portfolio"
      aria-labelledby="work-title"
      className="container-x py-20 lg:py-28"
    >
      <SectionHeader index="01" label="Selected work" id="work-title">
        Things I&apos;ve <em>built</em>
      </SectionHeader>

      <div className="mt-14 space-y-20">
        {featured && <FeaturedProject project={featured} />}
        <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2">
          {rest.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>

      <details className="group/archive mt-20 border-y border-line">
        <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
          <span>
            <span className="display text-3xl">Earlier experiments</span>
            <span className="eyebrow ml-3">{archive.length} projects</span>
          </span>
          <FiPlus
            aria-hidden="true"
            className="h-5 w-5 transition-transform group-open/archive:rotate-45"
          />
        </summary>
        <ul className="divide-y divide-line border-t border-line">
          {archive.map((item) => (
            <li
              key={item.title}
              className="grid gap-1 py-4 sm:grid-cols-12 sm:items-center sm:gap-4"
            >
              <span className="font-medium sm:col-span-4">{item.title}</span>
              <span className="text-sm text-muted sm:col-span-5">
                {item.note}
              </span>
              <span className="flex gap-5 sm:col-span-3 sm:justify-end">
                {item.live && (
                  <ExternalLink
                    href={item.live}
                    label="Live"
                    project={item.title}
                    icon={<FiArrowUpRight aria-hidden="true" />}
                  />
                )}
                {item.github && (
                  <ExternalLink
                    href={item.github}
                    label="Code"
                    project={item.title}
                    icon={<FiGithub aria-hidden="true" />}
                  />
                )}
              </span>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
