"use client";

import Image from "next/image";
import { FaLinkedin, FaGithub, FaDribbble, FaArrowDown } from "react-icons/fa";

export default function Hero() {
  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="home"
      className="relative overflow-hidden pt-40 pb-32 text-white"
    >
      {/* blue gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-orange-900 via-orange-800 to-orange-900" />

      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
        {/* text */}
        <div className="flex-1 max-w-xl">
          <p className="uppercase tracking-widest text-primary-300 mb-2">
            Welcome to my world ✨
          </p>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-primary-200">
            Hi, I'm <span className="text-primary-300">Nitish Sharma</span>
          </h1>
          <h2 className="mt-2 text-4xl md:text-5xl font-extrabold text-primary-200">
            Full Stack Developer
          </h2>

          <p className="mt-6 text-primary-200">
            Passionate Full Stack Developer, I create intuitive and visually appealing
            digital experiences. I transform ideas into seamless designs that
            meet users' expectations.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            <a
              href="#projects"
              className="px-6 py-3 bg-primary-300 text-primary-900 font-semibold rounded-full shadow hover:opacity-90 transition"
            >
              My Projects
            </a>
            <a
              href="/cv.pdf"
              className="px-6 py-3 border border-primary-300 text-primary-200 rounded-full hover:bg-primary-300/10 transition"
            >
              Download CV
            </a>
          </div>

          {/* socials */}
          <div className="flex gap-4 mt-10">
            <a
              href="#"
              className="p-3 bg-white/10 rounded-full hover:bg-primary-300/20 transition"
            >
              <FaLinkedin className="text-xl" />
            </a>
            <a
              href="#"
              className="p-3 bg-white/10 rounded-full hover:bg-primary-300/20 transition"
            >
              <FaGithub className="text-xl" />
            </a>
            <a
              href="#"
              className="p-3 bg-white/10 rounded-full hover:bg-primary-300/20 transition"
            >
              <FaDribbble className="text-xl" />
            </a>
          </div>
        </div>

        {/* avatar */}
        <div className="flex-1 flex justify-center md:justify-end">
          <div className="relative w-72 h-72 md:w-80 md:h-80">
            <Image
              src="https://i.pravatar.cc/400?img=65"
              alt="Avatar"
              fill
              sizes="300px"
              className="object-cover rounded-3xl shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* arrow */}
      <button 
        onClick={scrollToProjects}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce p-2 hover:text-primary-300 transition-colors cursor-pointer"
        aria-label="Scroll to projects"
      >
        <FaArrowDown className="text-2xl" />
      </button>
    </header>
  );
} 