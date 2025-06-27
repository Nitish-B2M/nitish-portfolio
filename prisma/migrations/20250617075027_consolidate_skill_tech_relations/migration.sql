/*
  Warnings:

  - You are about to drop the `ExperienceTechnology` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectSkill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectTechnology` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `experience_skills` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ExperienceTechnology` DROP FOREIGN KEY `ExperienceTechnology_experienceId_fkey`;

-- DropForeignKey
ALTER TABLE `ExperienceTechnology` DROP FOREIGN KEY `ExperienceTechnology_techId_fkey`;

-- DropForeignKey
ALTER TABLE `ProjectSkill` DROP FOREIGN KEY `ProjectSkill_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `ProjectSkill` DROP FOREIGN KEY `ProjectSkill_skillId_fkey`;

-- DropForeignKey
ALTER TABLE `ProjectTechnology` DROP FOREIGN KEY `ProjectTechnology_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `ProjectTechnology` DROP FOREIGN KEY `ProjectTechnology_techId_fkey`;

-- DropForeignKey
ALTER TABLE `experience_skills` DROP FOREIGN KEY `experience_skills_experienceId_fkey`;

-- DropForeignKey
ALTER TABLE `experience_skills` DROP FOREIGN KEY `experience_skills_skillId_fkey`;

-- DropTable
DROP TABLE `ExperienceTechnology`;

-- DropTable
DROP TABLE `ProjectSkill`;

-- DropTable
DROP TABLE `ProjectTechnology`;

-- DropTable
DROP TABLE `experience_skills`;

-- CreateTable
CREATE TABLE `entity_skills` (
    `id` VARCHAR(191) NOT NULL,
    `entityType` VARCHAR(191) NOT NULL,
    `entityId` VARCHAR(191) NOT NULL,
    `skillId` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NULL,
    `experienceId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `entity_skills_entityType_entityId_skillId_key`(`entityType`, `entityId`, `skillId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `entity_technologies` (
    `id` VARCHAR(191) NOT NULL,
    `entityType` VARCHAR(191) NOT NULL,
    `entityId` VARCHAR(191) NOT NULL,
    `techId` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NULL,
    `experienceId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `entity_technologies_entityType_entityId_techId_key`(`entityType`, `entityId`, `techId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `entity_skills` ADD CONSTRAINT `entity_skills_skillId_fkey` FOREIGN KEY (`skillId`) REFERENCES `skills`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `entity_skills` ADD CONSTRAINT `entity_skills_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `entity_skills` ADD CONSTRAINT `entity_skills_experienceId_fkey` FOREIGN KEY (`experienceId`) REFERENCES `Experience`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `entity_technologies` ADD CONSTRAINT `entity_technologies_techId_fkey` FOREIGN KEY (`techId`) REFERENCES `Technology`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `entity_technologies` ADD CONSTRAINT `entity_technologies_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `entity_technologies` ADD CONSTRAINT `entity_technologies_experienceId_fkey` FOREIGN KEY (`experienceId`) REFERENCES `Experience`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
