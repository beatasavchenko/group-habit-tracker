CREATE TABLE `__new_group-habit-tracker_group_members` (
	`group_id` bigint unsigned NOT NULL,
	`user_id` bigint unsigned NOT NULL,
	`role` text NOT NULL DEFAULT 'member',
	`status` text NOT NULL DEFAULT 'pending',
	CONSTRAINT `group-habit-tracker_group_members_user_id_group_id_pk` PRIMARY KEY(`user_id`,`group_id`)
);
--> statement-breakpoint
INSERT INTO `__new_group-habit-tracker_group_members`(`group_id`, `user_id`, `role`, `status`) SELECT `group_id`, `user_id`, `role`, `status` FROM `group-habit-tracker_group_members`;--> statement-breakpoint
DROP TABLE `group-habit-tracker_group_members`;--> statement-breakpoint
ALTER TABLE `__new_group-habit-tracker_group_members` RENAME TO `group-habit-tracker_group_members`;--> statement-breakpoint
CREATE TABLE `__new_group-habit-tracker_groups` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`group_username` text NOT NULL,
	`description` text,
	`invite_code` text NOT NULL,
	`image` text,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp,
	CONSTRAINT `group-habit-tracker_groups_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
INSERT INTO `__new_group-habit-tracker_groups`(`id`, `name`, `group_username`, `description`, `invite_code`, `image`, `createdAt`, `updatedAt`) SELECT `id`, `name`, `group_username`, `description`, `invite_code`, `image`, `createdAt`, `updatedAt` FROM `group-habit-tracker_groups`;--> statement-breakpoint
DROP TABLE `group-habit-tracker_groups`;--> statement-breakpoint
ALTER TABLE `__new_group-habit-tracker_groups` RENAME TO `group-habit-tracker_groups`;--> statement-breakpoint
CREATE INDEX `group_username_idx` ON `group-habit-tracker_groups` (`group_username`);--> statement-breakpoint
CREATE TABLE `__new_group-habit-tracker_users` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`username` text NOT NULL,
	`name` text,
	`image` text,
	`email` text NOT NULL,
	`code` text NOT NULL,
	`codeExpiresAt` timestamp DEFAULT CURRENT_TIMESTAMP,
	`isVerified` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp,
	CONSTRAINT `group-habit-tracker_users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
INSERT INTO `__new_group-habit-tracker_users`(`id`, `username`, `name`, `image`, `email`, `code`, `codeExpiresAt`, `isVerified`, `createdAt`, `updatedAt`) SELECT `id`, `username`, `name`, `image`, `email`, `code`, `codeExpiresAt`, `isVerified`, `createdAt`, `updatedAt` FROM `group-habit-tracker_users`;--> statement-breakpoint
DROP TABLE `group-habit-tracker_users`;--> statement-breakpoint
ALTER TABLE `__new_group-habit-tracker_users` RENAME TO `group-habit-tracker_users`;--> statement-breakpoint
CREATE INDEX `email_idx` ON `group-habit-tracker_users` (`email`);--> statement-breakpoint
CREATE INDEX `username_idx` ON `group-habit-tracker_users` (`username`);