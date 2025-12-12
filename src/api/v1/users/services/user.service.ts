import { PAGINATION_PAGE_LIMIT } from "../../common/constants/constants";
import { ErrorCode } from "../../common/constants/errorCodes";
import { PaginatedData, PaginationMeta } from "../../common/dto/common.dto";
import { ApiError } from "../../common/utils/apiError";
import {
  IUsersQueryParams,
  IUpdateUserProfile
} from "../models/user.dto";
import { IUserEntity } from "../models/user.entity";
import { IUserRepository } from "../repositories/user.repository.interface";
import { uploadOnCloudinary } from "../utils/cloudinary.util";
import { IUserService } from "./user.service.interface";

export class UserService implements IUserService {
  constructor(private readonly userRepo: IUserRepository) { }

  /* -------------------------------------------------------------------------- */
  /*                               GET ALL USERS                                */
  /* -------------------------------------------------------------------------- */
  async getAllUsers(query: IUsersQueryParams): Promise<PaginatedData<IUserEntity>> {
    return await this.userRepo.findAll(query);
  }

  /* -------------------------------------------------------------------------- */
  /*                                 GET BY ID                                  */
  /* -------------------------------------------------------------------------- */
  async getUserById(userId: string): Promise<IUserEntity> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new ApiError("User not found", 404, ErrorCode.USER_NOT_FOUND);
    return user;
  }

  /* -------------------------------------------------------------------------- */
  /*                           UPDATE ACCOUNT DETAILS                            */
  /* -------------------------------------------------------------------------- */
  async updateAccountDetails(
    userId: string,
    body: IUpdateUserProfile
  ): Promise<IUserEntity> {
    const allowedFields: (keyof IUpdateUserProfile)[] = [
      "email",
      "fullName",
      "bio",
      "role",
      "status",
      "isVerified",
      "socialLinks",
      "preferences"
    ];

    const updates: Partial<IUpdateUserProfile> = {};

    for (const key of allowedFields) {
      const value = body[key];
      if (value === undefined || value === null) continue;

      // handle strings
      if (typeof value === "string" && value.trim() !== "") {
        updates[key] = value.trim() as any;
      }

      // handle objects (preferences, etc.)
      if (typeof value === "object") {
        updates[key] = value as any;
      }
    }

    if (Object.keys(updates).length === 0) {
      throw new ApiError(
        "At least one valid field is required to update",
        400,
        ErrorCode.BAD_REQUEST
      );
    }

    // 🔍 Normalize email (optional)
    if (updates.email) {
      updates.email = updates.email.toLowerCase();
    }

    const updatedUser = await this.userRepo.updateAccountDetails(userId, updates);
    if (!updatedUser) throw new ApiError("User not found", 404, ErrorCode.USER_NOT_FOUND);

    return updatedUser;
  }

  /* -------------------------------------------------------------------------- */
  /*                                UPDATE AVATAR                                */
  /* -------------------------------------------------------------------------- */
  async updateAvatar(userId: string, file: Express.Multer.File): Promise<IUserEntity> {
    if (!file?.buffer) {
      throw new ApiError("Avatar file is missing", 400, ErrorCode.BAD_REQUEST);
    }

    const uploaded = await uploadOnCloudinary(file.buffer, userId, "avatars");

    if (!uploaded?.secure_url) {
      throw new ApiError("Failed to upload avatar", 400, ErrorCode.BAD_REQUEST);
    }

    const user = await this.userRepo.updateById(userId, {
      avatar: uploaded.secure_url
    });

    if (!user) throw new ApiError("User not found", 404, ErrorCode.USER_NOT_FOUND);

    return user;
  }

  /* -------------------------------------------------------------------------- */
  /*                                  DELETE USER                                */
  /* -------------------------------------------------------------------------- */
  async deleteUser(userId: string): Promise<boolean> {
    const deleted = await this.userRepo.deleteById(userId);
    if (!deleted) throw new ApiError("User not found", 404, ErrorCode.USER_NOT_FOUND);
    return true;
  }

  /* -------------------------------------------------------------------------- */
  /*                                 FOLLOW USER                                 */
  /* -------------------------------------------------------------------------- */
  async followUser(userId: string, targetUserId: string): Promise<void> {
    if (userId === targetUserId) {
      throw new ApiError("You cannot follow yourself", 400, ErrorCode.BAD_REQUEST);
    }

    const [user, targetUser] = await Promise.all([
      this.userRepo.findById(userId),
      this.userRepo.findById(targetUserId)
    ]);

    if (!user) throw new ApiError("User not found", 404, ErrorCode.USER_NOT_FOUND);
    if (!targetUser) {
      throw new ApiError("Target user not found", 404, ErrorCode.USER_NOT_FOUND);
    }

    const alreadyFollowing = targetUser.followers?.includes(userId);
    if (alreadyFollowing) {
      throw new ApiError("Already following this user", 409, ErrorCode.BAD_REQUEST);
    }

    await Promise.all([
      this.userRepo.addFollower(targetUserId, userId),
      this.userRepo.addFollowing(userId, targetUserId)
    ]);
  }

  /* -------------------------------------------------------------------------- */
  /*                               UNFOLLOW USER                                 */
  /* -------------------------------------------------------------------------- */
  async unfollowUser(userId: string, targetUserId: string): Promise<void> {
    if (userId === targetUserId) {
      throw new ApiError("You cannot unfollow yourself", 400, ErrorCode.BAD_REQUEST);
    }

    const [user, targetUser] = await Promise.all([
      this.userRepo.findById(userId),
      this.userRepo.findById(targetUserId)
    ]);

    if (!user) throw new ApiError("User not found", 404, ErrorCode.USER_NOT_FOUND);
    if (!targetUser) {
      throw new ApiError("Target user not found", 404, ErrorCode.USER_NOT_FOUND);
    }

    await Promise.all([
      this.userRepo.removeFollower(targetUserId, userId),
      this.userRepo.removeFollowing(userId, targetUserId)
    ]);
  }

  /* -------------------------------------------------------------------------- */
  /*                             GET FOLLOWERS / FOLLOWING                       */
  /* -------------------------------------------------------------------------- */
  async getFollowers(userId: string): Promise<IUserEntity[]> {
    return this.userRepo.findFollowers(userId);
  }

  async getFollowing(userId: string): Promise<IUserEntity[]> {
    return this.userRepo.findFollowing(userId);
  }
}
