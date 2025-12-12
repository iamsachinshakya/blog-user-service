// db/seed/userSeeds.ts
import bcrypt from "bcryptjs";
import crypto from "crypto";

import { UserRole, UserStatus } from "../../../api/v1/auth/models/auth.entity";

export async function getUserSeeds() {
    const hashedPassword = await bcrypt.hash("password123", 10);

    return [
        {
            id: crypto.randomUUID(),
            username: "john_doe",
            email: "john@example.com",
            password: hashedPassword,
            role: UserRole.USER,
            status: UserStatus.ACTIVE,
            refreshToken: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: crypto.randomUUID(),
            username: "editor_guy",
            email: "editor@example.com",
            password: hashedPassword,
            role: UserRole.EDITOR,
            status: UserStatus.PENDING,
            refreshToken: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: crypto.randomUUID(),
            username: "author_lady",
            email: "author@example.com",
            password: hashedPassword,
            role: UserRole.AUTHOR,
            status: UserStatus.ACTIVE,
            refreshToken: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: crypto.randomUUID(),
            username: "admin_master",
            email: "admin@example.com",
            password: hashedPassword,
            role: UserRole.ADMIN,
            status: UserStatus.ACTIVE,
            refreshToken: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];
}
