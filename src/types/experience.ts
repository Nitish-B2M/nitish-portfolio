import { z } from 'zod';
import { Experience as PrismaExperience, EntitySkill as PrismaEntitySkill, EntityTechnology as PrismaEntityTechnology } from '@prisma/client';

export const experienceFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().min(1, 'Description is required'),
  startDate: z.date(),
  endDate: z.date().optional(),
  isCurrent: z.boolean(),
  address: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    country: z.string().min(1, 'Country is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
  }).optional(),
});

export type ExperienceFormValues = z.infer<typeof experienceFormSchema>;

export type Experience = PrismaExperience;

export type EntitySkill = PrismaEntitySkill & {
  skill: {
    name: string;
  };
};

export type EntityTechnology = PrismaEntityTechnology & {
  technology: {
    name: string;
  };
};

export type ExperienceWithRelations = Experience & {
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  } | null;
  skills: EntitySkill[];
  technologies: EntityTechnology[];
}; 