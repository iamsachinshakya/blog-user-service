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

export interface PaginatedData<T> {
    data: T[];
    pagination: PaginationMeta;
}