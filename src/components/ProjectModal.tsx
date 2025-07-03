'use client';

import { useState, useEffect } from 'react';
import { Project as PrismaProject, ProjectImage, EntityTechnology, EntitySkill } from '@prisma/client';
import { FaGithub, FaExternalLinkAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { CloudinaryImage } from '@/components/ui/CloudinaryImage';
import { Button } from '@/components/ui/button';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from '@/components/ui/modal';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Project = PrismaProject & {
  images: ProjectImage[];
  technologies: (EntityTechnology & { technology: { name: string } })[];
  skills: (EntitySkill & { skill: { name: string } })[];
};

interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const [readmeContent, setReadmeContent] = useState<string>('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchReadme = async () => {
      if (!project.githubUrl) return;

      try {
        // Extract owner and repo from GitHub URL
        const match = project.githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) return;

        const [, owner, repo] = match;
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
          headers: {
            Accept: 'application/vnd.github.raw',
          },
        });

        if (response.ok) {
          const content = await response.text();
          setReadmeContent(content);
        }
      } catch (error) {
        console.error('Error fetching README:', error);
      }
    };

    if (isOpen) {
      fetchReadme();
    }
  }, [isOpen, project.githubUrl]);

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % project.images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="max-h-[90vh] overflow-y-auto">
        <ModalHeader>
          <ModalTitle>{project.title}</ModalTitle>
          <ModalDescription>{project.description}</ModalDescription>
        </ModalHeader>

        {/* Image Gallery */}
        {project.images.length > 0 && (
          <div className="relative mt-4">
            <CloudinaryImage
              src={project.images[activeImageIndex].url}
              alt={project.title}
              width={800}
              height={400}
              className="w-full h-[400px] object-cover rounded-lg"
            />
            {project.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/75 transition-colors"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/75 transition-colors"
                >
                  <FaChevronRight />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {project.images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        activeImageIndex === idx ? "bg-white w-3" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Technologies and Skills */}
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Technologies & Skills</h3>
          <div className="flex flex-wrap gap-2">
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
        </div>

        {/* Links */}
        <div className="flex gap-4 mt-6">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600 transition-colors"
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
              className="inline-flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600 transition-colors"
            >
              <FaGithub />
              <span>Source Code</span>
            </a>
          )}
        </div>

        {/* README Content */}
        {readmeContent && (
          <div className="mt-8 prose prose-sm max-w-none dark:prose-invert">
            <h2 className="text-xl font-semibold mb-4">README</h2>
            <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{readmeContent}</ReactMarkdown>
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
} 