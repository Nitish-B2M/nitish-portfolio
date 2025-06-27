/*
  Warnings:

  - You are about to drop the column `addressId` on the `Experience` table. All the data in the column will be lost.
  - You are about to drop the column `isCurrent` on the `Experience` table. All the data in the column will be lost.
  - You are about to drop the `ExperienceSkill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExperienceTechnology` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `postalCode` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Made the column `street` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `state` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `location` to the `Experience` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Experience` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Experience` DROP FOREIGN KEY `Experience_addressId_fkey`;

-- DropForeignKey
ALTER TABLE `Experience` DROP FOREIGN KEY `Experience_userId_fkey`;

-- DropForeignKey
ALTER TABLE `ExperienceSkill` DROP FOREIGN KEY `ExperienceSkill_experienceId_fkey`;

-- DropForeignKey
ALTER TABLE `ExperienceSkill` DROP FOREIGN KEY `ExperienceSkill_skillId_fkey`;

-- DropForeignKey
ALTER TABLE `ExperienceTechnology` DROP FOREIGN KEY `ExperienceTechnology_experienceId_fkey`;

-- DropForeignKey
ALTER TABLE `ExperienceTechnology` DROP FOREIGN KEY `ExperienceTechnology_techId_fkey`;

-- DropIndex
DROP INDEX `Experience_addressId_fkey` ON `Experience`;

-- DropIndex
DROP INDEX `Experience_userId_fkey` ON `Experience`;

-- AlterTable
ALTER TABLE `Address` ADD COLUMN `postalCode` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `street` VARCHAR(191) NOT NULL,
    MODIFY `state` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Experience` DROP COLUMN `addressId`,
    DROP COLUMN `isCurrent`,
    ADD COLUMN `location` VARCHAR(191) NOT NULL,
    MODIFY `description` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `ExperienceSkill`;

-- DropTable
DROP TABLE `ExperienceTechnology`;

-- CreateTable
CREATE TABLE `Profile` (
    `id` VARCHAR(191) NOT NULL,
    `bio` TEXT NOT NULL,
    `avatar` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Profile_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Education` (
    `id` VARCHAR(191) NOT NULL,
    `institution` VARCHAR(191) NOT NULL,
    `degree` VARCHAR(191) NOT NULL,
    `field` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NULL,
    `current` BOOLEAN NOT NULL DEFAULT false,
    `userId` VARCHAR(191) NOT NULL,
    `addressId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Experience` ADD CONSTRAINT `Experience_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Education` ADD CONSTRAINT `Education_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Education` ADD CONSTRAINT `Education_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `Address`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
