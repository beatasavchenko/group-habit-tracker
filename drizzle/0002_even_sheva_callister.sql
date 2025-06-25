CREATE TABLE `group-habit-tracker_groupMembers` (
	`group_id` bigint unsigned NOT NULL,
	`user_id` bigint unsigned NOT NULL,
	`role` text DEFAULT 'member',
	CONSTRAINT `group-habit-tracker_groupMembers_user_id_group_id_pk` PRIMARY KEY(`user_id`,`group_id`)
);
--> statement-breakpoint
ALTER TABLE `group-habit-tracker_groups` DROP COLUMN `members`;