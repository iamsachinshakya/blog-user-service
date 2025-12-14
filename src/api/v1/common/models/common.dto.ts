export enum UserRole {
    USER = "user",
    EDITOR = "editor",
    AUTHOR = "author",
    ADMIN = "admin",
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface IQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}


export interface PaginatedData<T> {
    data: T[];
    pagination: PaginationMeta;
}

export enum AuthStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    PENDING = "pending",       // user registered but not verified
    SUSPENDED = "suspended",   // temporarily blocked
    DELETED = "deleted",       // account deleted
    BANNED = "banned"          // permanently banned
}

export interface ICreateDto {
    createdAt: Date;
    updatedAt: Date;
}

export interface IAuthUser {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    status: AuthStatus;
    isVerified: boolean;
}