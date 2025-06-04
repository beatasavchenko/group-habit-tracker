CREATE TABLE `group-habit-tracker_communities` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`name` text,
	`tags` text,
	`members` text,
	`image` text,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp,
	CONSTRAINT `group-habit-tracker_communities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `group-habit-tracker_groups` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`name` text,
	`members` text,
	`image` text,
	`habits` text,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp,
	CONSTRAINT `group-habit-tracker_groups_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `group-habit-tracker_habits` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`name` text,
	`description` text,
	`basicGoal` text,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp,
	CONSTRAINT `group-habit-tracker_habits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `group-habit-tracker_personalHabits` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`habitId` bigint unsigned,
	`userId` bigint unsigned,
	`groupId` bigint unsigned,
	`personalGoal` text,
	`basicGoal` text,
	`isCompleted` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp,
	CONSTRAINT `group-habit-tracker_personalHabits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `group-habit-tracker_tags` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`icon` text,
	`name` text,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp,
	CONSTRAINT `group-habit-tracker_tags_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `group-habit-tracker_users` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`name` text,
	`email` text NOT NULL,
	`code` text,
	`codeExpiresAt` timestamp DEFAULT CURRENT_TIMESTAMP,
	`isVerified` boolean NOT NULL DEFAULT false,
	`friends` text,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp,
	CONSTRAINT `group-habit-tracker_users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `email` ON `group-habit-tracker_users` (`email`);