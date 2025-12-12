import { PaginatedData } from "../../common/dto/common.dto";
import { IUpdateUserProfile, IUsersQueryParams } from "../models/user.dto";
import { IUserEntity } from "../models/user.entity";

export interface IUserService {
    /**
     * Fetch all users
     */
    getAllUsers(query: IUsersQueryParams): Promise<PaginatedData<IUserEntity>>;
    /**
     * Get a single user by ID
     */
    getUserById(userId: string): Promise<IUserEntity>;

    /**
     * Update user profile details (name, bio, social links, etc.)
     */
    updateAccountDetails(userId: string, body: IUpdateUserProfile): Promise<IUserEntity | null>;

    /**
     * Update user avatar/profile image
     */
    updateAvatar(userId: string, file: Express.Multer.File): Promise<IUserEntity>;

    /**
     * Delete user account
     */
    deleteUser(userId: string): Promise<boolean>;


    /**
     * Follow another user
     */
    followUser(userId: string, targetUserId: string): Promise<void>;

    /**
     * Unfollow another user
     */
    unfollowUser(userId: string, targetUserId: string): Promise<void>;

    /**
     * Get all followers of a user
     */
    getFollowers(userId: string): Promise<IUserEntity[]>;

    /**
     * Get all users the given user is following
     */
    getFollowing(userId: string): Promise<IUserEntity[]>;
}
