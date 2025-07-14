ALTER TABLE `group-habit-tracker_user_habits` CHANGE `joinedAt` `joined_at`;--> statement-breakpoint
ALTER TABLE `group-habit-tracker_user_habits` ADD `streak_count` bigint unsigned DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `group-habit-tracker_user_habits` ADD `last_logged_at` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE `group-habit-tracker_users` ADD `global_streak_count` bigint unsigned DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `group-habit-tracker_users` ADD `global_last_logged_at` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL;