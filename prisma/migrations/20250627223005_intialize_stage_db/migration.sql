/*
  Warnings:

  - You are about to drop the column `entityId` on the `entity_skills` table. All the data in the column will be lost.
  - You are about to drop the column `entityId` on the `entity_technologies` table. All the data in the column will be lost.
  - You are about to drop the `Technology` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[entityType,skillId,projectId,experienceId]` on the table `entity_skills` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[entityType,techId,projectId,experienceId]` on the table `entity_technologies` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `entity_skills` DROP FOREIGN KEY `entity_skills_experience_fkey`;

-- DropForeignKey
ALTER TABLE `entity_skills` DROP FOREIGN KEY `entity_skills_project_fkey`;

-- DropForeignKey
ALTER TABLE `entity_skills` DROP FOREIGN KEY `entity_skills_skillId_fkey`;

-- DropForeignKey
ALTER TABLE `entity_technologies` DROP FOREIGN KEY `entity_technologies_experience_fkey`;

-- DropForeignKey
ALTER TABLE `entity_technologies` DROP FOREIGN KEY `entity_technologies_project_fkey`;

-- DropForeignKey
ALTER TABLE `entity_technologies` DROP FOREIGN KEY `entity_technologies_techId_fkey`;

-- DropIndex
DROP INDEX `entity_skills_entityType_entityId_skillId_key` ON `entity_skills`;

-- DropIndex
DROP INDEX `entity_skills_experience_fkey` ON `entity_skills`;

-- DropIndex
DROP INDEX `entity_skills_skillId_fkey` ON `entity_skills`;

-- DropIndex
DROP INDEX `entity_technologies_entityType_entityId_techId_key` ON `entity_technologies`;

-- DropIndex
DROP INDEX `entity_technologies_experience_fkey` ON `entity_technologies`;

-- DropIndex
DROP INDEX `entity_technologies_techId_fkey` ON `entity_technologies`;

-- AlterTable
ALTER TABLE `entity_skills` DROP COLUMN `entityId`,
    ADD COLUMN `experienceId` VARCHAR(191) NULL,
    ADD COLUMN `projectId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `entity_technologies` DROP COLUMN `entityId`,
    ADD COLUMN `experienceId` VARCHAR(191) NULL,
    ADD COLUMN `projectId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `Technology`;

-- CreateTable
CREATE TABLE `technologies` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `technologies_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `entity_skills_entityType_skillId_projectId_experienceId_key` ON `entity_skills`(`entityType`, `skillId`, `projectId`, `experienceId`);

-- CreateIndex
CREATE UNIQUE INDEX `entity_technologies_entityType_techId_projectId_experienceId_key` ON `entity_technologies`(`entityType`, `techId`, `projectId`, `experienceId`);

-- AddForeignKey
ALTER TABLE `technologies` ADD CONSTRAINT `technologies_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `entity_skills` ADD CONSTRAINT `entity_skills_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `entity_skills` ADD CONSTRAINT `entity_skills_experienceId_fkey` FOREIGN KEY (`experienceId`) REFERENCES `Experience`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `entity_skills` ADD CONSTRAINT `entity_skills_skillId_fkey` FOREIGN KEY (`skillId`) REFERENCES `skills`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `entity_technologies` ADD CONSTRAINT `entity_technologies_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `entity_technologies` ADD CONSTRAINT `entity_technologies_experienceId_fkey` FOREIGN KEY (`experienceId`) REFERENCES `Experience`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `entity_technologies` ADD CONSTRAINT `entity_technologies_techId_fkey` FOREIGN KEY (`techId`) REFERENCES `technologies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
