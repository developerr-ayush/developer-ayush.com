import Image from "next/image";
import Link from "next/link";
import { FiArrowDownRight, FiDownload } from "react-icons/fi";
import profileImage from "../assets/img/personal/portrait-hero.jpg";
import { personalInfo, stats } from "../data";

export default function Hero() {
  return (
    <section id="home" aria-labelledby="hero-title" className="relative">
      <div className="container-x grid gap-10 pb-14 pt-10 sm:pt-16 md:grid-cols-12 md:gap-8 lg:pb-20 lg:pt-24">
        <div className="md:col-span-8">
          <p className="eyebrow fade flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="inline-flex items-center gap-2 text-ink">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-accent"
              />
              {personalInfo.role}
            </span>
            <span>{personalInfo.location}</span>
          </p>

          <h1
            id="hero-title"
            className="display mt-6 text-[3.25rem] sm:text-7xl lg:text-[6.5rem] [text-wrap:balance]"
          >
            I build <em className="text-accent">fast</em>, accessible
            interfaces for products millions use.
          </h1>

          <p
            className="fade mt-8 max-w-xl text-lg leading-relaxed text-muted"
            style={{ "--d": "120ms" } as React.CSSProperties}
          >
            I&apos;m Ayush, a frontend engineer and associate manager at
            Sportz Interactive. For five years I&apos;ve shipped React,
            Next.js and Nuxt apps for sports platforms like WPL, ISL and
            Gujarat Titans, and lately my own full-stack tools.
          </p>

          <div
            className="fade mt-8 flex flex-wrap gap-3"
            style={{ "--d": "200ms" } as React.CSSProperties}
          >
            <Link href="#portfolio" className="btn btn-primary">
              See selected work
              <FiArrowDownRight aria-hidden="true" />
            </Link>
            <a href={personalInfo.resumePdf} className="btn btn-ghost">
              <FiDownload aria-hidden="true" />
              Résumé <span className="text-muted">(PDF)</span>
            </a>
          </div>
        </div>

        <div className="md:col-span-4 md:self-end">
          <figure className="relative mx-auto max-w-[15rem] sm:max-w-[19rem] md:ml-auto md:mr-0">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-[#0b0a08]">
              <Image
                src={profileImage}
                alt="Ayush Shah in profile under a spotlight, wearing glasses"
                priority
                sizes="(max-width: 640px) 15rem, (max-width: 768px) 19rem, 22vw"
                className="h-full w-full object-cover"
                placeholder="blur"
              />
            </div>
            <figcaption className="eyebrow mt-3 flex justify-between">
              <span>Ayush Shah</span>
              <span>Mumbai</span>
            </figcaption>
          </figure>
        </div>
      </div>

      <div className="container-x">
        <dl className="grid grid-cols-2 gap-px border-y border-line bg-line md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col-reverse justify-end gap-2 bg-paper py-6 pr-4 [&:nth-child(even)]:pl-4 md:[&:not(:first-child)]:pl-6"
            >
              <dt className="text-sm text-muted">{stat.label}</dt>
              <dd className="display text-5xl lg:text-6xl">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
