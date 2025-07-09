ALTER TABLE `group-habit-tracker_groups` CHANGE `createdAt` `created_at`;--> statement-breakpoint
ALTER TABLE `group-habit-tracker_groups` CHANGE `updatedAt` `updated_at`;--> statement-breakpoint
ALTER TABLE `group-habit-tracker_habits` CHANGE `createdAt` `created_at`;--> statement-breakpoint
ALTER TABLE `group-habit-tracker_habits` CHANGE `updatedAt` `updated_at`;--> statement-breakpoint
ALTER TABLE `group-habit-tracker_messages` CHANGE `createdAt` `created_at`;--> statement-breakpoint
ALTER TABLE `group-habit-tracker_messages` CHANGE `updatedAt` `updated_at`;--> statement-breakpoint
ALTER TABLE `group-habit-tracker_user_habits` CHANGE `habitId` `habit_id`;--> statement-breakpoint
ALTER TABLE `group-habit-tracker_user_habits` CHANGE `userId` `user_id`;--> statement-breakpoint
ALTER TABLE `group-habit-tracker_user_habits` CHANGE `createdAt` `created_at`;--> statement-breakpoint
ALTER TABLE `group-habit-tracker_user_habits` CHANGE `updatedAt` `updated_at`;--> statement-breakpoint
ALTER TABLE `group-habit-tracker_users` CHANGE `isVerified` `is_verified`;--> statement-breakpoint
ALTER TABLE `group-habit-tracker_users` CHANGE `createdAt` `created_at`;--> statement-breakpoint
ALTER TABLE `group-habit-tracker_users` CHANGE `updatedAt` `updated_at`;--> statement-breakpoint
CREATE TABLE `group-habit-tracker_habit_log` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`user_habit_id` bigint unsigned NOT NULL,
	`date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`value` bigint unsigned NOT NULL,
	`is_completed` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp,
	CONSTRAINT `group-habit-tracker_habit_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `group-habit-tracker_group_members` ADD `created_at` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE `group-habit-tracker_group_members` ADD `updated_at` timestamp;