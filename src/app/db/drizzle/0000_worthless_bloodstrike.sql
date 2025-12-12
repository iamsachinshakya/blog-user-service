CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(30) NOT NULL,
	"email" varchar(255) NOT NULL,
	"full_name" text NOT NULL,
	"avatar" text,
	"bio" varchar(500) DEFAULT '',
	"role" text DEFAULT 'user' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"social_links" jsonb DEFAULT '{"twitter":null,"linkedin":null,"github":null,"website":null}'::jsonb,
	"followers" jsonb DEFAULT '[]'::jsonb,
	"following" jsonb DEFAULT '[]'::jsonb,
	"preferences" jsonb DEFAULT '{"emailNotifications":true,"marketingUpdates":false,"twoFactorAuth":false}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
