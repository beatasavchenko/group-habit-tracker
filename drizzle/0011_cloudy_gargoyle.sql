CREATE TABLE `__new_group-habit-tracker_messages` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`type` enum('message','event') NOT NULL,
	`eventType` enum('habit_created'),
	`contents` text NOT NULL,
	`group_id` bigint unsigned NOT NULL,
	`user_id` bigint unsigned,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp,
	CONSTRAINT `group-habit-tracker_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
INSERT INTO `__new_group-habit-tracker_messages`(`id`, `type`, `eventType`, `contents`, `group_id`, `user_id`, `createdAt`, `updatedAt`) SELECT `id`, `type`, `eventType`, `contents`, `group_id`, `user_id`, `createdAt`, `updatedAt` FROM `group-habit-tracker_messages`;--> statement-breakpoint
DROP TABLE `group-habit-tracker_messages`;--> statement-breakpoint
ALTER TABLE `__new_group-habit-tracker_messages` RENAME TO `group-habit-tracker_messages`;