"use client";

import Image from "next/image";

const SKILLS = [
  "Figma",
  "XD",
  "Ai",
  "Ps",
  "HTML",
  "CSS",
  "JavaScript",
  "React",
  "TypeScript",
  "Next.js",
];

export default function AboutSection() {
  return (
    <section id="about" className="py-16 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl font-bold text-center mb-12">About Me</h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="flex justify-center">
            <div className="relative w-48 h-48 md:w-64 md:h-64 clip-hex">
              <Image
                src="https://i.pravatar.cc/400?img=64"
                alt="Profile"
                fill
                className="object-cover rounded-full"
                sizes="(max-width: 768px) 192px, 256px"
              />
            </div>
          </div>

          {/* Content */}
          <div className="text-center md:text-left space-y-6">
            <h3 className="text-2xl font-semibold text-primary-600">
              I'm Sara Howari, UI/UX Designer
            </h3>
            
            <p className="text-primary-700 leading-relaxed">
              Welcome to my portfolio! I'm a passionate UI/UX designer dedicated to creating seamless and visually engaging digital experiences.
            </p>
            
            <p className="text-primary-700 leading-relaxed">
              My skills include wireframing, prototyping, and user research, ensuring that each design is both aesthetically pleasing and functionally efficient.
            </p>

            <ul className="space-y-2 text-primary-700">
              <li className="flex items-start text-left md:text-center md:items-center gap-2">
                <span className="text-primary-400">★</span>
                I am deeply committed to my work, investing creativity and precision into every project.
              </li>
              <li className="flex items-start text-left md:text-center md:items-center gap-2">
                <span className="text-primary-400">★</span>
                I focus on creating unique and effective user experiences.
              </li>
              <li className="flex items-start text-left md:text-center md:items-center gap-2">
                <span className="text-primary-400">★</span>
                I stay updated with the latest design trends and best practices.
              </li>
            </ul>

            {/* Skills */}
            <div className="pt-6">
              <h4 className="text-lg font-semibold mb-4">Skills</h4>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {SKILLS.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-primary-900/30 text-primary-100 rounded-full text-sm border border-primary-800/50"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 