CREATE TABLE `__new_group-habit-tracker_habit_logs` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`user_habit_id` bigint unsigned NOT NULL,
	`date` date NOT NULL DEFAULT CURRENT_DATE,
	`value` bigint unsigned NOT NULL,
	`is_completed` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp,
	CONSTRAINT `group-habit-tracker_habit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
INSERT INTO `__new_group-habit-tracker_habit_logs`(`id`, `user_habit_id`, `date`, `value`, `is_completed`, `created_at`, `updated_at`) SELECT `id`, `user_habit_id`, `date`, `value`, `is_completed`, `created_at`, `updated_at` FROM `group-habit-tracker_habit_logs`;--> statement-breakpoint
DROP TABLE `group-habit-tracker_habit_logs`;--> statement-breakpoint
ALTER TABLE `__new_group-habit-tracker_habit_logs` RENAME TO `group-habit-tracker_habit_logs`;