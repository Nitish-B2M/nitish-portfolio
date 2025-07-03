"use client";

import { useState } from "react";
import { CloudinaryImage } from '@/components/ui/CloudinaryImage';
import { FaChevronLeft, FaChevronRight, FaExternalLinkAlt, FaGithub } from 'react-icons/fa';
import { Project as PrismaProject, ProjectImage, EntityTechnology, EntitySkill } from "@prisma/client";
import ProjectModal from "./ProjectModal";

type Project = PrismaProject & {
  images: ProjectImage[];
  technologies: (EntityTechnology & { technology: { name: string } })[];
  skills: (EntitySkill & { skill: { name: string } })[];
};

const CATEGORIES = ["ALL", "FRONTEND", "BACKEND", "FULLSTACK"] as const;

export default function ProjectsGallery({ projects }: { projects: Project[] }) {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("ALL");
  const [activeImageIndex, setActiveImageIndex] = useState<Record<string, number>>({});
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered = projects.filter(
    (p) => category === "ALL" || p.category === category
  );

  const nextImage = (projectId: string, totalImages: number) => {
    if (totalImages === 0) return;
    setActiveImageIndex(prev => ({
      ...prev,
      [projectId]: ((prev[projectId] || 0) + 1) % totalImages
    }));
  };

  const prevImage = (projectId: string, totalImages: number) => {
    if (totalImages === 0) return;
    setActiveImageIndex(prev => ({
      ...prev,
      [projectId]: ((prev[projectId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  return (
    <div className="space-y-8 px-4 sm:px-6">
      {/* Category filters */}
      <div className="flex flex-wrap justify-center gap-3">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-full text-sm transition-all transform hover:scale-105 ${
              category === c
                ? "bg-primary-600 text-white shadow-lg"
                : "bg-primary-900/30 text-primary-200 hover:bg-primary-900/50"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Projects grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((project) => (
          <div
            key={project.id}
            className="group bg-primary-900/30 rounded-xl overflow-hidden border border-primary-800/50 hover:border-primary-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary-900/20 cursor-pointer"
            onClick={() => setSelectedProject(project)}
          >
            <div className="relative">
              {project.images.length > 0 ? (
                <>
                  <CloudinaryImage
                    src={project.images[activeImageIndex[project.id] || 0].url}
                    alt={project.title}
                    width={300}
                    height={200}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Navigation arrows - only show if there are multiple images */}
                  {project.images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage(project.id, project.images.length);
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-primary-900/50 rounded-full text-white/75 hover:text-white hover:bg-primary-900/75 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <FaChevronLeft />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage(project.id, project.images.length);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-900/50 rounded-full text-white/75 hover:text-white hover:bg-primary-900/75 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <FaChevronRight />
                      </button>
                    </>
                  )}

                  {/* Image indicators - only show if there are multiple images */}
                  {project.images.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {project.images.map((_, idx) => (
                        <div
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${
                            (activeImageIndex[project.id] || 0) === idx
                              ? "bg-white w-3"
                              : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-[200px] flex items-center justify-center bg-primary-800/30">
                  <span className="text-primary-200/50">No images available</span>
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-primary-100">
                {project.title}
              </h3>
              <p className="text-sm sm:text-base text-primary-200 mb-4 line-clamp-2">
                {project.description}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  ...(project.technologies?.map(t => t.technology.name) || []),
                  ...(project.skills?.map(s => s.skill.name) || [])
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs rounded-full bg-primary-900/30 text-primary-200 border border-primary-800/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex gap-3">
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-100 hover:text-blue-300 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaExternalLinkAlt />
                    <span>Live Demo</span>
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-100 hover:text-blue-300 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaGithub />
                    <span>Source Code</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
} 