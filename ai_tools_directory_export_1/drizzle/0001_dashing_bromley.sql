CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`description` text,
	`icon` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_name_unique` UNIQUE(`name`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `featuredListings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`toolId` int NOT NULL,
	`submissionId` int,
	`stripePaymentId` varchar(255) NOT NULL,
	`amount` int NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'USD',
	`durationDays` int NOT NULL DEFAULT 30,
	`startDate` timestamp NOT NULL DEFAULT (now()),
	`endDate` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `featuredListings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `toolSubmissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`categoryId` int NOT NULL,
	`tags` varchar(500),
	`pricingType` enum('free','freemium','paid') NOT NULL,
	`websiteUrl` varchar(500) NOT NULL,
	`affiliateUrl` varchar(500),
	`submitterEmail` varchar(320) NOT NULL,
	`submitterName` varchar(255),
	`isFeatured` tinyint NOT NULL DEFAULT 0,
	`stripePaymentId` varchar(255),
	`paymentStatus` enum('pending','completed','failed') NOT NULL DEFAULT 'pending',
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`rejectionReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `toolSubmissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tools` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`longDescription` text,
	`categoryId` int NOT NULL,
	`tags` varchar(500),
	`pricingType` enum('free','freemium','paid') NOT NULL,
	`websiteUrl` varchar(500) NOT NULL,
	`affiliateUrl` varchar(500),
	`isFeatured` enum('none','featured','sponsored') NOT NULL DEFAULT 'none',
	`featuredUntil` timestamp,
	`isApproved` tinyint NOT NULL DEFAULT 0,
	`submittedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tools_id` PRIMARY KEY(`id`),
	CONSTRAINT `tools_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `featuredListings` ADD CONSTRAINT `featuredListings_toolId_tools_id_fk` FOREIGN KEY (`toolId`) REFERENCES `tools`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `featuredListings` ADD CONSTRAINT `featuredListings_submissionId_toolSubmissions_id_fk` FOREIGN KEY (`submissionId`) REFERENCES `toolSubmissions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `toolSubmissions` ADD CONSTRAINT `toolSubmissions_categoryId_categories_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tools` ADD CONSTRAINT `tools_categoryId_categories_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tools` ADD CONSTRAINT `tools_submittedBy_users_id_fk` FOREIGN KEY (`submittedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;