import { User as PrismaUser } from '@prisma/client';

export type Role = PrismaUser['role'];

export interface UserProfile extends Omit<PrismaUser, 'password'> {
  createdAt: Date;
  updatedAt: Date;
}