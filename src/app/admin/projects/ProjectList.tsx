'use client';

import { Project } from '@/types/project';

export default function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div key={project.id} className="bg-primary-800/50 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-primary-100">{project.title}</h3>
          <p className="text-primary-300">{project.description}</p>
          
          {/* Skills */}
          <div className="mt-2">
            <h4 className="text-sm font-medium text-primary-200">Skills:</h4>
            <div className="flex flex-wrap gap-2 mt-1">
              {project.skills.map((skillRel) => (
                <span key={skillRel.id} className="px-2 py-1 text-xs rounded-full bg-primary-700 text-primary-100">
                  {skillRel.skill.name}
                </span>
              ))}
            </div>
          </div>

          {/* Technologies */}
          <div className="mt-2">
            <h4 className="text-sm font-medium text-primary-200">Technologies:</h4>
            <div className="flex flex-wrap gap-2 mt-1">
              {project.technologies.map((techRel) => (
                <span key={techRel.id} className="px-2 py-1 text-xs rounded-full bg-primary-700 text-primary-100">
                  {techRel.technology.name}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="mt-4 flex gap-4">
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-300 hover:text-primary-100">
                Demo →
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-300 hover:text-primary-100">
                GitHub →
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 