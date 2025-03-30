"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import aboutImage from "../assets/img/personal/about-profile.png";
import { personalInfo } from "../data";
import {
  FaDownload,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa";

export default function About() {
  // Key skills to highlight
  const keySkills = [
    "React.js",
    "Next.js",
    "TypeScript",
    "Node.js",
    "UI/UX Design",
    "Responsive Design",
    "Tailwind CSS",
    "SCSS",
  ];

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
            KNOW MORE
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">About Me</h2>
          <div className="h-1 w-16 bg-sky-500 mx-auto rounded-full"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left column - Image and quick info */}
          <div className="lg:w-5/12 xl:w-4/12">
            <div className="relative mx-auto max-w-md">
              {/* Main image with decorations */}
              <div className="relative z-10 rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                <Image
                  src={aboutImage}
                  alt="About Ayush Shah"
                  width={500}
                  height={500}
                  className="object-cover w-full aspect-square"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full border-8 border-sky-500/20 -z-10"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full border-8 border-purple-500/20 -z-10"></div>
            </div>

            {/* Quick info cards */}
            <div className="mt-12 grid gap-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 flex items-center gap-4 transform transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="h-10 w-10 rounded-full bg-sky-500/10 flex items-center justify-center">
                  <FaMapMarkerAlt className="text-sky-500" />
                </div>
                <div>
                  <h4 className="text-sky-500 text-sm">Location</h4>
                  <p className="font-medium">Mumbai, India</p>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 flex items-center gap-4 transform transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="h-10 w-10 rounded-full bg-sky-500/10 flex items-center justify-center">
                  <FaPhone className="text-sky-500" />
                </div>
                <div>
                  <h4 className="text-sky-500 text-sm">Phone</h4>
                  <a
                    href={`tel:${personalInfo.phone}`}
                    className="font-medium hover:text-sky-400 transition-colors"
                  >
                    {personalInfo.phone}
                  </a>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 flex items-center gap-4 transform transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="h-10 w-10 rounded-full bg-sky-500/10 flex items-center justify-center">
                  <FaEnvelope className="text-sky-500" />
                </div>
                <div>
                  <h4 className="text-sky-500 text-sm">Email</h4>
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="font-medium hover:text-sky-400 transition-colors"
                  >
                    {personalInfo.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Text content */}
          <div className="lg:w-7/12 xl:w-8/12">
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold leading-tight">
                I'm a <span className="text-sky-500">UI/UX Developer</span> with
                <span className="bg-gradient-to-r from-sky-500/20 to-indigo-500/20 ml-2 px-3 py-1 rounded-full text-white">
                  3+ Years
                </span>
                of Experience
              </h3>

              <div className="space-y-4 text-foreground/80">
                <p className="leading-relaxed">
                  With over 3 years of experience in web development, I
                  specialize in creating modern, responsive interfaces that
                  provide exceptional user experiences. My passion lies in
                  transforming ideas into functional and aesthetically pleasing
                  websites and applications.
                </p>
                <p className="leading-relaxed">
                  My expertise includes front-end development with React,
                  Next.js, and modern CSS frameworks, as well as back-end
                  integration using Node.js and MongoDB. I'm passionate about
                  creating clean, efficient code that translates designs into
                  seamless interactive experiences.
                </p>
                <p className="leading-relaxed">
                  Currently working at Sportz Interactive as an Associate Front
                  End Developer, I've had the opportunity to build high-profile
                  websites and contribute to numerous projects that have
                  improved my skills and perspective as a developer.
                </p>
              </div>

              {/* Skill badges */}
              <div className="pt-6">
                <h4 className="text-xl font-semibold mb-4">My Specialties</h4>
                <div className="flex flex-wrap gap-2">
                  {keySkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-sky-500/10 to-sky-600/10 border border-sky-500/20 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="pt-8 flex flex-wrap gap-4">
                <Link
                  href="/resume.pdf"
                  target="_blank"
                  className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-full font-medium transition-all transform hover:-translate-y-1 hover:shadow-lg inline-flex items-center"
                >
                  <FaDownload className="mr-2" /> Download Resume
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
}
