ALTER TABLE `group-habit-tracker_habits` ADD `is_every_day` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `group-habit-tracker_habits` ADD `specific_days` text;--> statement-breakpoint
ALTER TABLE `group-habit-tracker_habits` ADD `num_days_per_week` int DEFAULT 7;--> statement-breakpoint
ALTER TABLE `group-habit-tracker_habits` ADD `enabled_reminder` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `group-habit-tracker_habits` ADD `reminder_time` time DEFAULT '14:13:16';--> statement-breakpoint
ALTER TABLE `group-habit-tracker_user_habits` ADD `is_every_day` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `group-habit-tracker_user_habits` ADD `specific_days` text;--> statement-breakpoint
ALTER TABLE `group-habit-tracker_user_habits` ADD `num_days_per_week` int DEFAULT 7;--> statement-breakpoint
ALTER TABLE `group-habit-tracker_user_habits` ADD `enabled_reminder` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `group-habit-tracker_user_habits` ADD `reminder_time` time DEFAULT '14:13:16';