CREATE TABLE `__new_group-habit-tracker_groups` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`group_username` text NOT NULL,
	`image` text,
	`habits` text,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp,
	CONSTRAINT `group-habit-tracker_groups_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
INSERT INTO `__new_group-habit-tracker_groups`(`id`, `name`, `group_username`, `image`, `habits`, `createdAt`, `updatedAt`) SELECT `id`, `name`, `group_username`, `image`, `habits`, `createdAt`, `updatedAt` FROM `group-habit-tracker_groups`;--> statement-breakpoint
DROP TABLE `group-habit-tracker_groups`;--> statement-breakpoint
ALTER TABLE `__new_group-habit-tracker_groups` RENAME TO `group-habit-tracker_groups`;--> statement-breakpoint
CREATE INDEX `group_username_idx` ON `group-habit-tracker_groups` (`group_username`);