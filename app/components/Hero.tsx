"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { personalInfo, socialLinks } from "../data";
import profileImage from "../assets/img/personal/ayush-shah.png";
import { useEffect, useState } from "react";

const titleVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const Hero = () => {
  const [titleIndex, setTitleIndex] = useState(0);
  const titles = ["UI/UX", "Front end", "Full Stack"];

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % titles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center py-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 -left-32 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl"></div>
      </div>

      <div className="absolute right-0 top-0 w-full h-full bg-grid-white/[0.05] bg-[length:40px_40px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          {/* Text content */}
          <div className="lg:w-1/2 space-y-8">
            <div className="space-y-4">
              <p
                className="text-lg text-sky-500 font-medium animate-fade-in opacity-0"
                style={{
                  animationDelay: "0.2s",
                  animationFillMode: "forwards",
                }}
              >
                Hello there, I'm
              </p>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in opacity-0"
                style={{
                  animationDelay: "0.4s",
                  animationFillMode: "forwards",
                }}
              >
                <span className="text-foreground">{personalInfo.name}</span>
                <span className="block mt-2">
                  <span className="text-sky-500">UI/UX</span> Developer
                </span>
              </h1>
              <p
                className="text-xl text-foreground/70 leading-relaxed max-w-2xl animate-fade-in opacity-0"
                style={{
                  animationDelay: "0.6s",
                  animationFillMode: "forwards",
                }}
              >
                I create responsive, user-friendly web experiences with modern
                technologies, focusing on clean code and seamless interactions.
              </p>
            </div>

            <div
              className="flex flex-wrap gap-4 animate-fade-in opacity-0"
              style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
            >
              <Link
                href="#contact"
                className="bg-sky-500 hover:bg-sky-600 text-white font-medium px-8 py-3 rounded-full transition-all transform hover:translate-y-[-2px] hover:shadow-lg"
              >
                Contact Me
              </Link>
              <Link
                href="#portfolio"
                className="border border-foreground/20 bg-foreground/5 hover:bg-foreground/10 text-foreground font-medium px-8 py-3 rounded-full transition-all transform hover:translate-y-[-2px]"
              >
                View Work
              </Link>
            </div>

            <div
              className="animate-fade-in opacity-0"
              style={{ animationDelay: "1s", animationFillMode: "forwards" }}
            >
              <p className="text-foreground/60 mb-3 font-medium">
                Connect with me:
              </p>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-foreground/10 hover:bg-foreground/15 p-3 rounded-full transition-all transform hover:translate-y-[-2px] group"
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5 text-sky-500 group-hover:text-sky-400" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Image */}
          <div
            className="lg:w-1/2 flex justify-center lg:justify-end animate-fade-in opacity-0"
            style={{ animationDelay: "1.2s", animationFillMode: "forwards" }}
          >
            <div className="relative w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96">
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-500/20 to-purple-500/20 animate-pulse"
                style={{ animationDuration: "4s" }}
              ></div>
              <div className="absolute inset-2 rounded-full bg-foreground/5 backdrop-blur-sm border border-white/10 overflow-hidden">
                <Image
                  src={profileImage}
                  alt={personalInfo.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 85vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 rounded-full border-2 border-foreground/20 flex justify-center pt-2">
          <div className="w-1 h-3 rounded-full bg-sky-500"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default Hero;
