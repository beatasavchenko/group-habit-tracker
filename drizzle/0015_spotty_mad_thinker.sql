ALTER TABLE `group-habit-tracker_groups` ADD `description` text;--> statement-breakpoint
ALTER TABLE `group-habit-tracker_groups` ADD `invite_code` text;--> statement-breakpoint
ALTER TABLE `group-habit-tracker_groups` DROP COLUMN `habits`;