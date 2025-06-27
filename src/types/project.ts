import { EntitySkill, EntityTechnology, ProjectImage } from '@/types/entity';

export interface Project {
  id: string;
  title: string;
  description: string;
  category: keyof typeof Category;
  status: keyof typeof Status;
  demoUrl?: string | null;
  githubUrl?: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  skills: EntitySkill[];
  technologies: EntityTechnology[];
  images: ProjectImage[];
}

export const Category = {
  FRONTEND: 'FRONTEND',
  BACKEND: 'BACKEND',
  FULLSTACK: 'FULLSTACK',
  MOBILE: 'MOBILE',
  OTHER: 'OTHER'
} as const;

export const Status = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED'
} as const; 

export const EntityType = {
  PROJECT: 'PROJECT',
  EXPERIENCE: 'EXPERIENCE'
} as const;

export type Category = (typeof Category)[keyof typeof Category];
export type Status = (typeof Status)[keyof typeof Status];
export type EntityType = (typeof EntityType)[keyof typeof EntityType];