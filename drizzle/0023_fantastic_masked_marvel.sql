CREATE TABLE `__new_group-habit-tracker_messages` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`type` enum('message','event') NOT NULL,
	`eventType` enum('habit_created','habit_completed','streak_updated'),
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
ALTER TABLE `__new_group-habit-tracker_messages` RENAME TO `group-habit-tracker_messages`;--> statement-breakpoint
ALTER TABLE `group-habit-tracker_habit_logs` ADD `goal` bigint unsigned NOT NULL;