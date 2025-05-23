"use client";

import { experienceData } from "../data";

export default function Experience() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-sky-500/5 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent uppercase tracking-wider font-semibold">
            Professional Journey
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            My Experience
          </h2>
          <p className="text-foreground/75 max-w-2xl mx-auto">
            A timeline of my professional career and the skills I&apos;ve
            developed along the way.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 top-0 h-full w-px bg-gradient-to-b from-sky-500/80 via-sky-500/50 to-sky-500/20 transform md:translate-x-[-0.5px] hidden md:block"></div>

          {experienceData.map((item, index) => (
            <div key={index} className="mb-12 md:mb-20 relative">
              <div
                className={`flex flex-col md:flex-row ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Timeline dot indicator */}
                <div className="absolute left-[-12px] md:left-1/2 top-0 md:translate-x-[-12px] hidden md:block">
                  <div className="w-6 h-6 rounded-full border-4 border-sky-500 bg-black"></div>
                </div>

                {/* Visible dot for mobile */}
                <div className="absolute left-[-5px] top-0 md:hidden">
                  <div className="w-3 h-3 rounded-full bg-sky-500"></div>
                </div>

                {/* Date circle - only shows on desktop */}
                <div
                  className={`hidden md:flex items-center justify-center w-1/2 ${
                    index % 2 === 0 ? "md:pl-12" : "md:pr-12"
                  }`}
                >
                  <div className="text-center">
                    <div className="inline-block px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20">
                      <span className="text-sm font-medium text-sky-500">
                        {item.date}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div
                  className={`border-l-2 border-sky-500/30 pl-6 md:border-0 md:pl-0 ${
                    index % 2 === 0
                      ? "md:pr-12 md:text-right md:w-1/2"
                      : "md:pl-12 md:w-1/2"
                  }`}
                >
                  {/* Date for mobile */}
                  <div className="mb-3 md:hidden">
                    <span className="text-sm font-medium text-sky-500">
                      {item.date}
                    </span>
                  </div>

                  <div
                    className={`bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg transform transition-all hover:-translate-y-1 hover:shadow-sky-500/5 ${
                      index % 2 === 0 ? "md:mr-6" : "md:ml-6"
                    }`}
                  >
                    <h3 className="text-xl font-bold mb-2">{item.position}</h3>
                    <h4 className="text-sky-500 font-medium mb-4">
                      {item.from}
                    </h4>
                    <p className="text-foreground/70 mb-4">{item.para}</p>

                    {item.details && (
                      <ul className="space-y-2">
                        {item.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start">
                            <span className="text-sky-500 mr-2">•</span>
                            <span className="text-foreground/80 text-sm">
                              {detail}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
