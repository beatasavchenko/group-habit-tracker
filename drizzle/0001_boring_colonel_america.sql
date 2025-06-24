DROP INDEX `email` ON `group-habit-tracker_users`;--> statement-breakpoint
ALTER TABLE `group-habit-tracker_users` ADD `username` text NOT NULL;--> statement-breakpoint
ALTER TABLE `group-habit-tracker_users` ADD `image` text;--> statement-breakpoint
CREATE INDEX `email_idx` ON `group-habit-tracker_users` (`email`);--> statement-breakpoint
CREATE INDEX `username_idx` ON `group-habit-tracker_users` (`username`);