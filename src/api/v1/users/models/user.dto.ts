import { IQueryParams } from "../../common/models/common.dto";
import { ISocialLinks, IUserPreferences, UserRole, UserStatus } from "./user.entity";

export interface IAuthUser {
    id: string;
    email: string;
    role: UserRole;
    status: UserStatus;
}

export interface IUpdateUserProfile {
    email: string;
    fullName: string;
    bio: string;
    role: UserRole;
    status: UserStatus;
    isVerified: boolean;
    socialLinks: ISocialLinks;
    preferences: IUserPreferences;
}

export interface ICreateUserData {
    username: string;
    fullName: string;
    email: string;
    status: UserStatus;
    role: UserRole;
    bio: string;
    password: string;
}
