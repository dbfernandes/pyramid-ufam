-- AlterTable
ALTER TABLE `activities` ADD COLUMN `searchHash` TEXT NULL;

-- AlterTable
ALTER TABLE `courses` ADD COLUMN `searchHash` TEXT NULL;

-- AlterTable
ALTER TABLE `submissions` ADD COLUMN `searchHash` TEXT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `searchHash` TEXT NULL;
