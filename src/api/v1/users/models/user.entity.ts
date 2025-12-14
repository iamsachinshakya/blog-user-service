export enum UserRole {
    USER = "user",
    EDITOR = "editor",
    AUTHOR = "author",
    ADMIN = "admin",
}

export enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    PENDING = "pending",       // user registered but not verified
    SUSPENDED = "suspended",   // temporarily blocked
    DELETED = "deleted",       // account deleted
    BANNED = "banned"          // permanently banned
}

export interface IUserPreferences {
    emailNotifications: boolean;
    marketingUpdates: boolean;
    twoFactorAuth: boolean;
}

export interface ISocialLinks {
    twitter: string | null;
    linkedin: string | null;
    github: string | null;
    website: string | null;
}

/**
 * Pure domain model — DB agnostic
 */
export interface IUserEntity {
    id: string;
    fullName: string;
    avatar: string | null;
    bio: string;
    socialLinks: ISocialLinks;
    followers: string[];
    following: string[];
    preferences: IUserPreferences;
    createdAt: Date;
    updatedAt: Date;
}

