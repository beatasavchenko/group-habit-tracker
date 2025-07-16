ALTER TABLE `group-habit-tracker_habits` MODIFY COLUMN `reminder_time` time DEFAULT '16:17:22';--> statement-breakpoint
CREATE TABLE `__new_group-habit-tracker_user_habits` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`habit_id` bigint unsigned NOT NULL,
	`user_id` bigint unsigned NOT NULL,
	`goal` bigint unsigned NOT NULL,
	`frequency` enum('day','week','month') NOT NULL,
	`is_every_day` boolean DEFAULT true,
	`specific_days` text,
	`num_days_per_week` int DEFAULT 7,
	`enabled_reminder` boolean DEFAULT false,
	`reminder_time` time DEFAULT '16:17:22',
	`joined_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`streak_count` bigint unsigned NOT NULL DEFAULT 0,
	`last_logged_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp,
	CONSTRAINT `group-habit-tracker_user_habits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
INSERT INTO `__new_group-habit-tracker_user_habits`(`id`, `habit_id`, `user_id`, `goal`, `frequency`, `is_every_day`, `specific_days`, `num_days_per_week`, `enabled_reminder`, `reminder_time`, `joined_at`, `streak_count`, `last_logged_at`, `created_at`, `updated_at`) SELECT `id`, `habit_id`, `user_id`, `goal`, `frequency`, `is_every_day`, `specific_days`, `num_days_per_week`, `enabled_reminder`, `reminder_time`, `joined_at`, `streak_count`, `last_logged_at`, `created_at`, `updated_at` FROM `group-habit-tracker_user_habits`;--> statement-breakpoint
DROP TABLE `group-habit-tracker_user_habits`;--> statement-breakpoint
ALTER TABLE `__new_group-habit-tracker_user_habits` RENAME TO `group-habit-tracker_user_habits`;