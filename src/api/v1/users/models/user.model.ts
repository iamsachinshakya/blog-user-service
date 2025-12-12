import {
    pgTable,
    serial,
    text,
    varchar,
    boolean,
    timestamp,
    jsonb,
    uuid,

} from "drizzle-orm/pg-core";

import { UserRole, UserStatus, ISocialLinks, IUserPreferences } from "./user.entity";

export const users = pgTable("users", {
    id: uuid("id")
        .defaultRandom()
        .primaryKey(),
    username: varchar("username", { length: 30 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),

    fullName: text("full_name").notNull(),
    avatar: text("avatar"),
    bio: varchar("bio", { length: 500 }).default(""),

    role: text("role")
        .$type<UserRole>()
        .default(UserRole.USER)
        .notNull(),

    status: text("status")
        .$type<UserStatus>()
        .default(UserStatus.ACTIVE)
        .notNull(),

    isVerified: boolean("is_verified")
        .default(false)
        .notNull(),


    socialLinks: jsonb("social_links")
        .$type<ISocialLinks>()
        .default({
            twitter: null,
            linkedin: null,
            github: null,
            website: null,
        }),

    followers: jsonb("followers")
        .$type<string[]>()
        .default([]),

    following: jsonb("following")
        .$type<string[]>()
        .default([]),


    preferences: jsonb("preferences")
        .$type<IUserPreferences>()
        .default({
            emailNotifications: true,
            marketingUpdates: false,
            twoFactorAuth: false,
        }),

    /** ----- TIMESTAMPS ----- */
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
