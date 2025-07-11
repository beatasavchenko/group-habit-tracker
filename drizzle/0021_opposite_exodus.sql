CREATE TABLE `__new_group-habit-tracker_habit_logs` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`user_habit_id` bigint unsigned NOT NULL,
	`date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`value` bigint unsigned NOT NULL,
	`is_completed` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp,
	CONSTRAINT `group-habit-tracker_habit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
INSERT INTO `__new_group-habit-tracker_habit_logs`(`id`, `user_habit_id`, `date`, `value`, `is_completed`, `created_at`, `updated_at`) SELECT `id`, `user_habit_id`, `date`, `value`, `is_completed`, `created_at`, `updated_at` FROM `group-habit-tracker_habit_logs`;--> statement-breakpoint
DROP TABLE `group-habit-tracker_habit_logs`;--> statement-breakpoint
ALTER TABLE `__new_group-habit-tracker_habit_logs` RENAME TO `group-habit-tracker_habit_logs`;--> statement-breakpoint
CREATE TABLE `__new_group-habit-tracker_messages` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`type` enum('message','event') NOT NULL,
	`eventType` enum('habit_created','habit_completed'),
	`contents` text NOT NULL,
	`group_id` bigint unsigned NOT NULL,
	`user_id` bigint unsigned NOT NULL,
	`habit_id` bigint unsigned,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp,
	CONSTRAINT `group-habit-tracker_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
INSERT INTO `__new_group-habit-tracker_messages`(`id`, `type`, `eventType`, `contents`, `group_id`, `user_id`, `habit_id`, `created_at`, `updated_at`) SELECT `id`, `type`, `eventType`, `contents`, `group_id`, `user_id`, `habit_id`, `created_at`, `updated_at` FROM `group-habit-tracker_messages`;--> statement-breakpoint
DROP TABLE `group-habit-tracker_messages`;--> statement-breakpoint
ALTER TABLE `__new_group-habit-tracker_messages` RENAME TO `group-habit-tracker_messages`;