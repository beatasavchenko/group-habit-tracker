ALTER TABLE `group-habit-tracker_groups` ADD `group_username` text NOT NULL;--> statement-breakpoint
CREATE INDEX `group_username_idx` ON `group-habit-tracker_groups` (`group_username`);