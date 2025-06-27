'use client';

import { Project, EntitySkill, EntityTechnology, ProjectImage } from "@prisma/client";

interface ExtendedProject extends Project {
  images: ProjectImage[];
  skills: (EntitySkill & { skill: { name: string } })[];
  technologies: (EntityTechnology & { technology: { name: string } })[];
}

interface ProjectListProps {
  projects: ExtendedProject[];
  onProjectDeleted?: () => void;
}

export default function ProjectList({ projects, onProjectDeleted }: ProjectListProps) {
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      // Call the callback if provided
      onProjectDeleted?.();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
    }
  };

  // ... rest of the component code ...
} 