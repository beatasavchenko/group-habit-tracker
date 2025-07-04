CREATE TABLE `__new_group-habit-tracker_habits` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`color` text NOT NULL DEFAULT '#54478c',
	`goal` bigint unsigned,
	`unit` text,
	`frequency` enum('day','week','month') NOT NULL,
	`group_id` bigint unsigned NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp,
	CONSTRAINT `group-habit-tracker_habits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
INSERT INTO `__new_group-habit-tracker_habits`(`id`, `name`, `description`, `color`, `goal`, `unit`, `frequency`, `group_id`, `createdAt`, `updatedAt`) SELECT `id`, `name`, `description`, `color`, `goal`, `unit`, `frequency`, `group_id`, `createdAt`, `updatedAt` FROM `group-habit-tracker_habits`;--> statement-breakpoint
DROP TABLE `group-habit-tracker_habits`;--> statement-breakpoint
ALTER TABLE `__new_group-habit-tracker_habits` RENAME TO `group-habit-tracker_habits`;