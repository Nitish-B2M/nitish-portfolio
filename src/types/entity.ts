import { Project, EntityType } from '@/types/project';
import { Experience } from '@/types/experience';

export interface Skill {
  id: string;
  name: string;
}

export interface Technology {
  id: string;
  name: string;
}

export interface EntitySkill {
  id: string;
  entityType: EntityType;
  projectId: string;
  experienceId: string;
  project: Project;
  experience: Experience;
  skillId: string;
  skill: Skill;
}

export interface EntityTechnology {
  id: string;
  entityType: EntityType;
  projectId: string;
  experienceId: string;
  project: Project;
  experience: Experience;
  techId: string;
  technology: Technology;
} 

export interface ProjectImage {
  id: string;
  url: string;
  image: File;
  name: string;
  projectId?: string | null;
  project?: Project | null;
  caption?: string | null;
  order?: number | null;
  createdAt: Date;
  updatedAt: Date;
}