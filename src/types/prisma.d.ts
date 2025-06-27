import { PrismaClient } from '@prisma/client';

declare global {
  namespace PrismaJson {
    type PrismaClientOptions = object;
    type PrismaClientConstructorOptions = object;
    type JsonObject = Record<string, unknown>;
    type JsonArray = unknown[];
    type InputJsonObject = Record<string, unknown>;
    type InputJsonArray = unknown[];
  }
}

declare module '@prisma/client' {
  interface PrismaClient {
    _dmmf?: object;
  }
}

export {};

export type Skill = Prisma.SkillGetPayload<{}>
export type Technology = Prisma.TechnologyGetPayload<{}>
export type Project = Prisma.ProjectGetPayload<{}>
export type ProjectImage = Prisma.ProjectImageGetPayload<{}>
export type EntitySkill = Prisma.EntitySkillGetPayload<{}>
export type EntityTechnology = Prisma.EntityTechnologyGetPayload<{}>

declare module "@prisma/client" {
  export * from "@prisma/client/runtime/library";
} 