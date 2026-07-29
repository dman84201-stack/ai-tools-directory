ALTER TABLE `toolSubmissions` MODIFY COLUMN `paymentStatus` enum('free','pending','completed','failed') NOT NULL DEFAULT 'pending';
