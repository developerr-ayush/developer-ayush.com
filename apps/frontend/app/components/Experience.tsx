import { experienceData } from "../data";
import SectionHeader from "./SectionHeader";

export default function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="container-x py-20 lg:py-28"
    >
      <SectionHeader index="02" label="Experience" id="experience-title">
        Where I&apos;ve <em>worked</em>
      </SectionHeader>

      <ol className="mt-14">
        {experienceData.map((job, i) => (
          <li
            key={`${job.company}-${job.start}`}
            className="reveal grid gap-4 md:grid-cols-12 md:gap-6"
          >
            <div className="md:col-span-3">
              <p className="font-mono text-sm">{job.period}</p>
              <p className="mt-1 text-sm text-muted">{job.location}</p>
            </div>

            <div
              className={`relative border-l border-line pl-6 md:col-span-9 md:pl-10 ${
                i < experienceData.length - 1 ? "pb-16" : ""
              }`}
            >
              <span
                aria-hidden="true"
                className={`absolute -left-[5px] top-2 h-[9px] w-[9px] rounded-full ${
                  i === 0 ? "bg-accent" : "border border-ink bg-paper"
                }`}
              />
              <h3 className="display text-4xl sm:text-5xl">{job.company}</h3>
              <p className="mt-2 font-medium">{job.position}</p>
              <p className="mt-4 max-w-2xl leading-relaxed text-muted">
                {job.summary}
              </p>
              <ul className="mt-6 grid max-w-3xl gap-3 text-[0.9375rem] leading-relaxed">
                {job.highlights.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-[0.7em] h-px w-3 shrink-0 bg-accent"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
