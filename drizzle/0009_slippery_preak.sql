CREATE TABLE `group-habit-tracker_messages` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`type` enum('message','event') NOT NULL,
	`contents` text NOT NULL,
	`group_id` bigint unsigned NOT NULL,
	`user_id` bigint unsigned NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp,
	CONSTRAINT `group-habit-tracker_messages_id` PRIMARY KEY(`id`)
);
