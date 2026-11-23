CREATE TABLE `booking_foods` (
	`id` int AUTO_INCREMENT NOT NULL,
	`booking_id` int NOT NULL,
	`food_item_id` int NOT NULL,
	`quantity` int NOT NULL,
	`item_price` decimal(12,2) NOT NULL,
	CONSTRAINT `booking_foods_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `booking_seats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`booking_id` int NOT NULL,
	`seat_id` int NOT NULL,
	`price` decimal(12,2) NOT NULL,
	CONSTRAINT `booking_seats_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`booking_code` varchar(20) NOT NULL,
	`user_id` int NOT NULL,
	`schedule_id` int NOT NULL,
	`total_amount` decimal(12,2) NOT NULL,
	`status` enum('confirmed','cancelled','pending') NOT NULL DEFAULT 'pending',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`),
	CONSTRAINT `bookings_booking_code_unique` UNIQUE(`booking_code`)
);
--> statement-breakpoint
CREATE TABLE `cinemas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`location` varchar(255) NOT NULL,
	CONSTRAINT `cinemas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `food_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`price` decimal(12,2) NOT NULL,
	`image_url` varchar(999),
	`category` enum('food','beverage','combo') NOT NULL,
	`is_available` boolean NOT NULL DEFAULT true,
	CONSTRAINT `food_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `movies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`image_url` varchar(999),
	`format` varchar(255),
	`rating` varchar(255),
	`duration` int NOT NULL,
	`synopsis` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `movies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `schedules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`movie_id` int NOT NULL,
	`studio_id` int NOT NULL,
	`start_time` timestamp NOT NULL,
	`end_time` timestamp NOT NULL,
	`ticket_price` decimal(12,2) NOT NULL,
	`status` enum('available','sold_out','completed') NOT NULL DEFAULT 'available',
	CONSTRAINT `schedules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `seats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studio_id` int NOT NULL,
	`row` varchar(1) NOT NULL,
	`number` int NOT NULL,
	CONSTRAINT `seats_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `studios` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cinema_id` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`type` enum('deluxe','premier','imax') NOT NULL DEFAULT 'deluxe',
	`capacity` int NOT NULL,
	CONSTRAINT `studios_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `password` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `booking_foods` ADD CONSTRAINT `booking_foods_booking_id_bookings_id_fk` FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `booking_foods` ADD CONSTRAINT `booking_foods_food_item_id_food_items_id_fk` FOREIGN KEY (`food_item_id`) REFERENCES `food_items`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `booking_seats` ADD CONSTRAINT `booking_seats_booking_id_bookings_id_fk` FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `booking_seats` ADD CONSTRAINT `booking_seats_seat_id_seats_id_fk` FOREIGN KEY (`seat_id`) REFERENCES `seats`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_schedule_id_schedules_id_fk` FOREIGN KEY (`schedule_id`) REFERENCES `schedules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `schedules` ADD CONSTRAINT `schedules_movie_id_movies_id_fk` FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `schedules` ADD CONSTRAINT `schedules_studio_id_studios_id_fk` FOREIGN KEY (`studio_id`) REFERENCES `studios`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `studios` ADD CONSTRAINT `studios_cinema_id_cinemas_id_fk` FOREIGN KEY (`cinema_id`) REFERENCES `cinemas`(`id`) ON DELETE no action ON UPDATE no action;