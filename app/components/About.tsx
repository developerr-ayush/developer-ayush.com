"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import aboutImage from "../assets/img/about-profile.png";
import { personalInfo } from "../data";

const About = () => {
  return (
    <section id="about" className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent uppercase tracking-wider font-semibold">
            Know More
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">About Me</h2>
          <div className="h-1 w-16 bg-sky-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image column */}
          <div className="order-2 lg:order-1 relative mx-auto max-w-md">
            <div className="relative z-10 rounded-2xl overflow-hidden border border-white/10 shadow-xl">
              <div className="aspect-square relative overflow-hidden">
                <Image
                  src={aboutImage}
                  alt="About Ayush Shah"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
            </div>

            {/* Decoration elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full border-8 border-sky-500/20 -z-10"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full border-8 border-purple-500/20 -z-10"></div>
          </div>

          {/* Text column */}
          <div className="order-1 lg:order-2">
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold">
                I'm a <span className="text-sky-500">UI/UX Developer</span>{" "}
                based in Mumbai, India
              </h3>

              <div className="space-y-4 text-foreground/80">
                <p>
                  With over 3 years of experience in web development, I
                  specialize in creating modern, responsive interfaces that
                  provide exceptional user experiences.
                </p>
                <p>
                  My expertise includes front-end development with React,
                  Next.js, and modern CSS frameworks, as well as back-end
                  integration using Node.js and MongoDB. I'm passionate about
                  creating clean, efficient code that translates designs into
                  seamless interactive experiences.
                </p>
                <p>
                  Currently working at Sportz Interactive as an Associate Front
                  End Developer, I've had the opportunity to build high-profile
                  websites and contribute to numerous projects that have
                  improved my skills and perspective as a developer.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 pt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-sky-500"></div>
                  <span className="text-sm font-medium">
                    Location: Mumbai, India
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-sky-500"></div>
                  <span className="text-sm font-medium">
                    Experience: 3+ Years
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-sky-500"></div>
                  <span className="text-sm font-medium">
                    Email: {personalInfo?.email}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-sky-500"></div>
                  <span className="text-sm font-medium">
                    Phone: {personalInfo?.phone}
                  </span>
                </div>
              </div>

              <div className="pt-6 flex flex-wrap gap-4">
                <Link
                  href="/resume.pdf"
                  target="_blank"
                  className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-full font-medium transition-all transform hover:-translate-y-1 hover:shadow-lg inline-flex items-center"
                >
                  Download Resume
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </Link>
                <Link
                  href="#contact"
                  className="border border-foreground/20 bg-foreground/5 hover:bg-foreground/10 px-6 py-3 rounded-full font-medium transition-all transform hover:-translate-y-1"
                >
                  Contact Me
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
