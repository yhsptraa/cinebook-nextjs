import { mysqlTable, int, varchar, timestamp, check } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { postgresRole } from "drizzle-orm/supabase";
import { format } from "path";
import { duration } from "drizzle-orm/gel-core";

export const users = mysqlTable("users", {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
},
(table) => [
    check("password_requirements", sql`REGEXP_LIKE(${table.password}, '[A-Z]', 'c') AND REGEXP_LIKE(${table.password}, '[0-9]')` ),
]);

export const movies = mysqlTable("movies", {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    poster: varchar("poster") ,
    format: varchar("format", { length: 255 }),
    rating: varchar("rating", { length: 255 }),
    duration: varchar("duration", { length: 255 }),
    synopsis: varchar("synopsis", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})