CREATE TABLE `achievements` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text DEFAULT 'certificate' NOT NULL,
	`title` text NOT NULL,
	`issuer` text NOT NULL,
	`issued_at` text,
	`image_url` text,
	`credential_url` text,
	`description` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `achievements_status_sort_idx` ON `achievements` (`status`,`sort_order`);--> statement-breakpoint
CREATE INDEX `achievements_kind_idx` ON `achievements` (`kind`);--> statement-breakpoint
CREATE TABLE `experiences` (
	`id` text PRIMARY KEY NOT NULL,
	`role` text NOT NULL,
	`organization` text NOT NULL,
	`location` text,
	`start_date` text NOT NULL,
	`end_date` text,
	`is_current` integer DEFAULT false NOT NULL,
	`description` text NOT NULL,
	`icon` text DEFAULT 'work' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `experiences_status_sort_idx` ON `experiences` (`status`,`sort_order`);--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`summary` text NOT NULL,
	`description` text,
	`category` text NOT NULL,
	`tags` text DEFAULT '[]' NOT NULL,
	`image_url` text,
	`repo_url` text,
	`live_url` text,
	`badge` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`published_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `projects_status_sort_idx` ON `projects` (`status`,`sort_order`);--> statement-breakpoint
CREATE INDEX `projects_category_idx` ON `projects` (`category`);--> statement-breakpoint
CREATE TABLE `skills` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`years_label` text NOT NULL,
	`proficiency` integer DEFAULT 0 NOT NULL,
	`icon` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `skills_status_sort_idx` ON `skills` (`status`,`sort_order`);--> statement-breakpoint
CREATE INDEX `skills_category_idx` ON `skills` (`category`);