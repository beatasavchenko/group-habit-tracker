CREATE TABLE `__new_group-habit-tracker_users` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`username` text NOT NULL,
	`name` text,
	`image` text,
	`email` text NOT NULL,
	`code` text,
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