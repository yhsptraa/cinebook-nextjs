import { mysqlTable, int, varchar, timestamp, decimal, mysqlEnum, text, boolean } from "drizzle-orm/mysql-core";

// User Schema Table

export const users = mysqlTable("users", {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password_hash: varchar("password", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Movie Schema Table

export const movies = mysqlTable("movies", {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    image_url: varchar("image_url", {length: 999 }) ,
    format: varchar("format", { length: 255 }),
    rating: varchar("rating", { length: 255 }),
    duration: int("duration").notNull(),
    synopsis: text("synopsis"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Booking Schema Table

export const bookings = mysqlTable("bookings", {
    id: int("id").autoincrement().primaryKey(),
    booking_code: varchar("booking_code", {length: 20}).notNull().unique(),
    user_id: int("user_id").notNull().references(() => users.id),
    schedule_id: int("schedule_id").notNull().references(() => schedules.id),
    total_amount: decimal("total_amount", {precision: 12, scale: 2}).notNull(),
    status: mysqlEnum("status", ["confirmed", "cancelled", "pending"]).default("pending").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull()
});

export const booking_seats = mysqlTable("booking_seats", {
    id: int("id").autoincrement().primaryKey(),
    booking_id: int("booking_id").references(() => bookings.id).notNull(),
    seat_id: int("seat_id").references(() => seats.id).notNull(),
    price: decimal("price", { precision: 12, scale: 2 }).notNull()
});

export const schedules = mysqlTable("schedules", {
    id: int("id").autoincrement().primaryKey(),
    movie_id: int("movie_id").notNull().references(()=> movies.id),
    studio_id: int("studio_id").notNull().references(() => studios.id),
    start_time: timestamp("start_time").notNull(),
    end_time: timestamp("end_time").notNull(),
    ticket_price: decimal("ticket_price", { precision: 12, scale: 2 }).notNull(),
    status: mysqlEnum("status", ["available", "sold_out", "completed"]).default("available").notNull()
});

export const cinemas = mysqlTable("cinemas", {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    location: varchar("location", { length: 255 }).notNull(),
});

export const studios = mysqlTable("studios", {
    id: int("id").autoincrement().primaryKey(),
    cinema_id: int("cinema_id").notNull().references(() => cinemas.id),
    name: varchar("name", { length: 100 }).notNull(),
    type: mysqlEnum("type", ["deluxe", "premier", "imax"]).default("deluxe").notNull(),
    capacity: int("capacity").notNull()
});

export const seats = mysqlTable("seats", {
    id: int("id").autoincrement().primaryKey(),
    studio_id: int("studio_id").notNull(),
    row: varchar("row", { length: 1 }).notNull(),
    number: int("number").notNull(),
});

// Foods Schema Table

export const food_items = mysqlTable("food_items", {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    price: decimal("price", { precision: 12, scale: 2 }).notNull(),
    image_url: varchar("image_url", { length: 999 }),
    category: mysqlEnum("category", ["food", "beverage", "combo"]).notNull(),
    is_available: boolean("is_available").default(true).notNull()
});

export const booking_foods = mysqlTable("booking_foods", {
    id: int("id").autoincrement().primaryKey(),
    booking_id: int("booking_id").references(() => bookings.id).notNull(),
    food_item_id: int("food_item_id").references(() => food_items.id).notNull(),
    quantity: int("quantity").notNull(),
    item_price: decimal('item_price', { precision: 12, scale: 2 }).notNull()
});