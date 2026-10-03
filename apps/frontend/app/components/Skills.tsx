import { skillGroups } from "../data";
import SectionHeader from "./SectionHeader";

export default function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className="container-x py-20 lg:py-28"
    >
      <SectionHeader index="03" label="Skills" id="skills-title">
        The <em>toolkit</em>
      </SectionHeader>

      <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group) => (
          <div key={group.title} className="bg-paper p-6 sm:p-8">
            <h3 className="eyebrow">{group.title}</h3>
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
              {group.items.map((item) => (
                <li key={item} className="display text-2xl sm:text-[1.75rem]">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
