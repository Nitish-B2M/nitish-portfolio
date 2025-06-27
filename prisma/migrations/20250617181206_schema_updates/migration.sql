/*
  Warnings:

  - You are about to drop the column `experienceId` on the `entity_skills` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `entity_skills` table. All the data in the column will be lost.
  - You are about to alter the column `entityType` on the `entity_skills` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(4))`.
  - You are about to drop the column `experienceId` on the `entity_technologies` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `entity_technologies` table. All the data in the column will be lost.
  - You are about to alter the column `entityType` on the `entity_technologies` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(4))`.

*/
-- DropForeignKey
ALTER TABLE `entity_skills` DROP FOREIGN KEY `entity_skills_experienceId_fkey`;

-- DropForeignKey
ALTER TABLE `entity_skills` DROP FOREIGN KEY `entity_skills_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `entity_technologies` DROP FOREIGN KEY `entity_technologies_experienceId_fkey`;

-- DropForeignKey
ALTER TABLE `entity_technologies` DROP FOREIGN KEY `entity_technologies_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `project_images` DROP FOREIGN KEY `project_images_projectId_fkey`;

-- DropIndex
DROP INDEX `entity_skills_experienceId_fkey` ON `entity_skills`;

-- DropIndex
DROP INDEX `entity_skills_projectId_fkey` ON `entity_skills`;

-- DropIndex
DROP INDEX `entity_technologies_experienceId_fkey` ON `entity_technologies`;

-- DropIndex
DROP INDEX `entity_technologies_projectId_fkey` ON `entity_technologies`;

-- DropIndex
DROP INDEX `project_images_projectId_fkey` ON `project_images`;

-- AlterTable
ALTER TABLE `Experience` MODIFY `startDate` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `entity_skills` DROP COLUMN `experienceId`,
    DROP COLUMN `projectId`,
    MODIFY `entityType` ENUM('PROJECT', 'EXPERIENCE') NOT NULL DEFAULT 'PROJECT';

-- AlterTable
ALTER TABLE `entity_technologies` DROP COLUMN `experienceId`,
    DROP COLUMN `projectId`,
    MODIFY `entityType` ENUM('PROJECT', 'EXPERIENCE') NOT NULL DEFAULT 'PROJECT';

-- AlterTable
ALTER TABLE `project_images` ADD COLUMN `caption` VARCHAR(191) NULL,
    ADD COLUMN `order` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `project_images` ADD CONSTRAINT `project_images_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `entity_skills` ADD CONSTRAINT `entity_skills_project_fkey` FOREIGN KEY (`entityId`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `entity_skills` ADD CONSTRAINT `entity_skills_experience_fkey` FOREIGN KEY (`entityId`) REFERENCES `Experience`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `entity_technologies` ADD CONSTRAINT `entity_technologies_project_fkey` FOREIGN KEY (`entityId`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `entity_technologies` ADD CONSTRAINT `entity_technologies_experience_fkey` FOREIGN KEY (`entityId`) REFERENCES `Experience`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
