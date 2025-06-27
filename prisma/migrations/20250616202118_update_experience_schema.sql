-- Drop the old tables and relations first
DROP TABLE IF EXISTS `ExperienceSkill`;
DROP TABLE IF EXISTS `ExperienceTechnology`;

-- Modify Experience table
ALTER TABLE `Experience`
DROP COLUMN `addressId`,
DROP COLUMN `current`,
ADD COLUMN `location` VARCHAR(191) NOT NULL,
MODIFY COLUMN `description` TEXT NOT NULL;

-- Add updatedAt to User table with default value
UPDATE `User` SET `updatedAt` = CURRENT_TIMESTAMP(3) WHERE `updatedAt` IS NULL OR `updatedAt` = '0000-00-00 00:00:00';
ALTER TABLE `User`
ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3); 