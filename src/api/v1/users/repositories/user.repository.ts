import { and, asc, desc, eq, ilike, sql } from "drizzle-orm";
import { getDB } from "../../../../app/db/connectDB";
import { users } from "../models/user.model";
import { IUserRepository } from "./user.repository.interface";
import { IUserEntity, UserRole } from "../models/user.entity";
import { IUpdateUserProfile, IUsersQueryParams } from "../models/user.dto";
import { PaginatedData } from "../../common/dto/common.dto";

export class UserRepository implements IUserRepository {

    /* -----------------------------------------------
     * PRIVATE NORMALIZE FUNCTION
     * ----------------------------------------------- */
    private normalizeUser(u: any): IUserEntity {
        return {
            id: u.id,
            username: u.username,
            email: u.email,
            fullName: u.fullName,
            avatar: u.avatar ?? null,
            bio: u.bio ?? "",
            role: u.role,
            status: u.status,
            isVerified: u.isVerified,
            socialLinks: u.socialLinks ?? {
                twitter: null,
                linkedin: null,
                github: null,
                website: null,
            },
            followers: u.followers ?? [],
            following: u.following ?? [],
            preferences: u.preferences ?? {
                emailNotifications: true,
                marketingUpdates: false,
                twoFactorAuth: false,
            },
            createdAt: u.createdAt,
            updatedAt: u.updatedAt,
        };
    }

    /* -------------------------------------------------------
        FIND ALL USERS (Pagination + Filters)
    --------------------------------------------------------*/
    async findAll(params: IUsersQueryParams): Promise<PaginatedData<IUserEntity>> {
        const {
            page = 1,
            limit = 10,
            search = "",
            sortBy = "createdAt",
            sortOrder = "desc",
            role,
        } = params;

        const offset = (page - 1) * limit;
        const db = getDB();

        const conditions = [];
        if (search.trim()) conditions.push(ilike(users.fullName, `%${search}%`));
        if (role) conditions.push(eq(users.role, role));
        const where = conditions.length ? and(...conditions) : undefined;

        let orderByColumn;
        switch (sortBy) {
            case "username": orderByColumn = users.username; break;
            case "email": orderByColumn = users.email; break;
            case "fullName": orderByColumn = users.fullName; break;
            case "createdAt":
            default: orderByColumn = users.createdAt; break;
        }
        const orderBy = sortOrder === "asc" ? asc(orderByColumn) : desc(orderByColumn);

        const rawData = await db
            .select()
            .from(users)
            .where(where)
            .orderBy(orderBy)
            .limit(limit)
            .offset(offset);

        const data: IUserEntity[] = rawData.map(this.normalizeUser);

        const [{ count }] = await db
            .select({ count: sql<number>`CAST(COUNT(*) AS INTEGER)` })
            .from(users)
            .where(where);

        return {
            data,
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit),
            },
        };
    }

    /* -------------------------------------------------------
        FIND BY ID
    --------------------------------------------------------*/
    async findById(id: string): Promise<IUserEntity | null> {
        const [user] = await getDB()
            .select()
            .from(users)
            .where(eq(users.id, id));

        return user ? this.normalizeUser(user) : null;
    }

    /* -------------------------------------------------------
        FIND BY USERNAME
    --------------------------------------------------------*/
    async findByUsername(username: string): Promise<IUserEntity | null> {
        const normalized = username.toLowerCase();
        const [user] = await getDB()
            .select()
            .from(users)
            .where(eq(users.username, normalized));

        return user ? this.normalizeUser(user) : null;
    }

    /* -------------------------------------------------------
        UPDATE ACCOUNT DETAILS
    --------------------------------------------------------*/
    async updateAccountDetails(
        userId: string,
        updates: Partial<IUpdateUserProfile>
    ): Promise<IUserEntity | null> {
        const [updated] = await getDB()
            .update(users)
            .set({ ...updates, updatedAt: new Date() })
            .where(eq(users.id, userId))
            .returning();

        return updated ? this.normalizeUser(updated) : null;
    }

    /* -------------------------------------------------------
        GENERIC UPDATE
    --------------------------------------------------------*/
    async updateById(userId: string, updates: Partial<IUserEntity>): Promise<IUserEntity | null> {
        const [updated] = await getDB()
            .update(users)
            .set({ ...updates, updatedAt: new Date() })
            .where(eq(users.id, userId))
            .returning();

        return updated ? this.normalizeUser(updated) : null;
    }

    /* -------------------------------------------------------
        DELETE USER
    --------------------------------------------------------*/
    async deleteById(userId: string): Promise<boolean> {
        const [deleted] = await getDB()
            .delete(users)
            .where(eq(users.id, userId))
            .returning();
        return !!deleted;
    }

    /* -------------------------------------------------------
        FOLLOW / UNFOLLOW
    --------------------------------------------------------*/
    async addFollower(targetUserId: string, followerId: string): Promise<void> {
        await getDB()
            .update(users)
            .set({
                followers: sql`${users.followers} || ${followerId}`,
                updatedAt: new Date()
            })
            .where(eq(users.id, targetUserId));
    }

    async addFollowing(userId: string, targetUserId: string): Promise<void> {
        await getDB()
            .update(users)
            .set({
                following: sql`${users.following} || ${targetUserId}`,
                updatedAt: new Date()
            })
            .where(eq(users.id, userId));
    }

    async removeFollower(targetUserId: string, followerId: string): Promise<void> {
        await getDB()
            .update(users)
            .set({
                followers: sql`array_remove(${users.followers}, ${followerId})`,
                updatedAt: new Date()
            })
            .where(eq(users.id, targetUserId));
    }

    async removeFollowing(userId: string, targetUserId: string): Promise<void> {
        await getDB()
            .update(users)
            .set({
                following: sql`array_remove(${users.following}, ${targetUserId})`,
                updatedAt: new Date()
            })
            .where(eq(users.id, userId));
    }

    /* -------------------------------------------------------
        GET FOLLOWERS
    --------------------------------------------------------*/
    async findFollowers(userId: string): Promise<IUserEntity[]> {
        const db = getDB();
        const [user] = await db
            .select({ followers: users.followers })
            .from(users)
            .where(eq(users.id, userId));
        if (!user?.followers?.length) return [];

        const rawFollowers = await db
            .select()
            .from(users)
            .where(sql`${users.id} = ANY(${user.followers})`);

        return rawFollowers.map(this.normalizeUser);
    }

    /* -------------------------------------------------------
        GET FOLLOWING
    --------------------------------------------------------*/
    async findFollowing(userId: string): Promise<IUserEntity[]> {
        const db = getDB();
        const [user] = await db
            .select({ following: users.following })
            .from(users)
            .where(eq(users.id, userId));
        if (!user?.following?.length) return [];

        const rawFollowing = await db
            .select()
            .from(users)
            .where(sql`${users.id} = ANY(${user.following})`);

        return rawFollowing.map(this.normalizeUser);
    }
}
