import Image from "next/image";
import { FiDownload, FiFileText } from "react-icons/fi";
import aboutImage from "../assets/img/personal/portrait-about.jpg";
import { educationData, personalInfo } from "../data";
import SectionHeader from "./SectionHeader";

export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="container-x py-20 lg:py-28"
    >
      <SectionHeader index="04" label="About" id="about-title">
        A little about <em>me</em>
      </SectionHeader>

      <div className="mt-14 grid gap-10 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-4 lg:col-span-3">
          <div className="relative mx-auto aspect-square max-w-[18rem] overflow-hidden rounded-full bg-surface md:max-w-none">
            <Image
              src={aboutImage}
              alt="Ayush Shah mid-conversation in front of a blue wall with vintage clocks"
              sizes="(max-width: 768px) 18rem, 25vw"
              placeholder="blur"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="md:col-span-8 md:col-start-5 lg:col-span-5 lg:col-start-5">
          <div className="space-y-5 text-lg leading-relaxed">
            <p>
              I&apos;m Ayush, a frontend engineer in Mumbai. I started building
              websites professionally in 2021, and since 2022 I&apos;ve been at
              Sportz Interactive, where I now lead frontend delivery as an
              Associate Manager.
            </p>
            <p className="text-muted">
              I care most about the parts people feel but rarely notice: pages
              that load quickly, interfaces that work with a keyboard and a
              screen reader, and code a team can keep changing. I mentor five
              developers and have brought AI-assisted workflows into how we
              build.
            </p>
            <p className="text-muted">
              Outside work I build my own full-stack tools, like Typeface Hub
              and FinanceCalc, and write about what I learn on the blog.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={personalInfo.resumePdf} className="btn btn-primary">
              <FiDownload aria-hidden="true" />
              Résumé <span className="opacity-70">PDF</span>
            </a>
            <a href={personalInfo.resumeDocx} className="btn btn-ghost" download>
              <FiFileText aria-hidden="true" />
              Résumé <span className="text-muted">DOCX</span>
            </a>
          </div>
        </div>

        <div className="md:col-span-8 md:col-start-5 lg:col-span-3 lg:col-start-10">
          <h3 className="eyebrow">Education</h3>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {educationData.map((item) => (
              <li key={item.title} className="py-4">
                <p className="font-medium">{item.title}</p>
                <p className="mt-1 text-sm text-muted">
                  {item.school} · {item.period}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
