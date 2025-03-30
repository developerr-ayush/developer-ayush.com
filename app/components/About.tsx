"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import aboutProfile from "../assets/img/personal/about-profile.png";

const About = () => {
  return (
    <section id="about" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            About <span className="text-sky-500">Me</span>
          </h2>
          <div className="mt-4 h-1 w-16 bg-sky-500 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative mx-auto w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-sky-500 to-indigo-500 opacity-30"></div>
            <div className="absolute inset-0 p-1">
              <div className="w-full h-full bg-foreground/5 backdrop-blur-sm rounded-2xl flex items-center justify-center overflow-hidden">
                <Image
                  src={aboutProfile}
                  alt="Ayush Shah"
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col space-y-6"
          >
            <h3 className="text-2xl font-bold">UI/UX Developer</h3>
            <p className="text-foreground/70">
              I'm a passionate UI/UX Developer with expertise in building
              modern, responsive web applications. With a strong foundation in
              front-end technologies and a growing knowledge of back-end
              development, I strive to create intuitive, user-friendly digital
              experiences.
            </p>
            <p className="text-foreground/70">
              Currently working at Sportz Interactive, I specialize in
              developing high-profile websites using technologies like HTML,
              CSS, SCSS, JavaScript, and various frameworks. I have a keen eye
              for design and enjoy collaborating with teams to bring creative
              ideas to life.
            </p>
            <p className="text-foreground/70">
              Throughout my career, I've worked on a wide range of projects,
              from building dashboards and AI model interfaces to creating
              responsive websites for various clients. I'm always eager to learn
              new technologies and improve my skills to deliver the best
              possible results.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <div className="h-1.5 w-1.5 rounded-full bg-sky-500"></div>
                <span className="font-medium">Name:</span>
                <span className="text-foreground/70">Ayush Shah</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-1.5 w-1.5 rounded-full bg-sky-500"></div>
                <span className="font-medium">Email:</span>
                <span className="text-foreground/70">
                  developerr.ayush@gmail.com
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-1.5 w-1.5 rounded-full bg-sky-500"></div>
                <span className="font-medium">Phone:</span>
                <span className="text-foreground/70">+91 90498 77048</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-1.5 w-1.5 rounded-full bg-sky-500"></div>
                <span className="font-medium">From:</span>
                <span className="text-foreground/70">Mumbai, India</span>
              </div>
            </div>

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded-full bg-sky-500 text-white font-medium hover:bg-sky-600 transition-colors"
            >
              Download Resume
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 ml-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
