import { Request, Response } from "express";
import { IUpdateUserProfile, IUsersQueryParams } from "../models/user.dto";
import { UserRole } from "../models/user.entity";
import { IUserService } from "../services/user.service.interface";
import { ApiResponse } from "../../common/utils/apiResponse";
import { PAGINATION_PAGE_LIMIT } from "../../common/constants/constants";
import { IUserController } from "./user.controller.interface";
import { ApiError } from "../../common/utils/apiError";
import { ErrorCode } from "../../common/constants/errorCodes";

export class UserController implements IUserController {
  constructor(private readonly userService: IUserService) { }

  /* ---------------------------------------------------------
     GET CURRENT USER
  ----------------------------------------------------------*/
  async getCurrentUser(req: Request, res: Response): Promise<Response> {
    const userId = req?.user?.id;

    if (!userId) {
      throw new ApiError("Unauthorized user", 401, ErrorCode.UNAUTHORIZED);
    }

    const user = await this.userService.getUserById(userId);

    if (!user) {
      throw new ApiError("User not found", 404, ErrorCode.USER_NOT_FOUND);
    }

    return ApiResponse.success(res, "User fetched successfully", user);
  }

  /* ---------------------------------------------------------
     GET ALL USERS
  ----------------------------------------------------------*/
  async getAll(req: Request, res: Response): Promise<Response> {
    const query: IUsersQueryParams = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || PAGINATION_PAGE_LIMIT,
      search: (req.query.search as string) || "",
      role: (req.query.role as UserRole) || null,
      sortBy: (req.query.sortBy as string) || "createdAt",
      sortOrder: (req.query.sortOrder as "asc" | "desc") || "desc",
    };

    const users = await this.userService.getAllUsers(query);

    if (!users) {
      throw new ApiError("No users found", 404, ErrorCode.USER_NOT_FOUND);
    }

    return ApiResponse.success(res, "Users fetched successfully", users);
  }

  /* ---------------------------------------------------------
     GET USER BY ID
  ----------------------------------------------------------*/
  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    if (!id) {
      throw new ApiError("User ID is required", 400, ErrorCode.BAD_REQUEST);
    }

    const user = await this.userService.getUserById(id);

    if (!user) {
      throw new ApiError("User not found", 404, ErrorCode.USER_NOT_FOUND);
    }

    return ApiResponse.success(res, "User fetched successfully", user);
  }

  /* ---------------------------------------------------------
     UPDATE ACCOUNT DETAILS
  ----------------------------------------------------------*/
  async updateAccountDetails(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const updates: IUpdateUserProfile = req.body;

    if (!id) {
      throw new ApiError("User ID is required", 400, ErrorCode.BAD_REQUEST);
    }

    if (!updates || Object.keys(updates).length === 0) {
      throw new ApiError("No update data provided", 400, ErrorCode.BAD_REQUEST);
    }

    const user = await this.userService.updateAccountDetails(id, updates);

    if (!user) {
      throw new ApiError("User not found", 404, ErrorCode.USER_NOT_FOUND);
    }

    return ApiResponse.success(
      res,
      "Account details updated successfully",
      user
    );
  }

  /* ---------------------------------------------------------
     UPDATE AVATAR
  ----------------------------------------------------------*/
  async updateAvatar(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    if (!id) {
      throw new ApiError("User ID is required", 400, ErrorCode.BAD_REQUEST);
    }

    if (!req.file) {
      throw new ApiError(
        "Avatar image is required",
        400,
        ErrorCode.FILE_NOT_FOUND
      );
    }

    const user = await this.userService.updateAvatar(id, req.file);

    if (!user) {
      throw new ApiError("User not found", 404, ErrorCode.USER_NOT_FOUND);
    }

    return ApiResponse.success(res, "Avatar updated successfully", user);
  }

  /* ---------------------------------------------------------
     DELETE USER
  ----------------------------------------------------------*/
  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    if (!id) {
      throw new ApiError("User ID is required", 400, ErrorCode.BAD_REQUEST);
    }

    const deleted = await this.userService.deleteUser(id);

    if (!deleted) {
      throw new ApiError("User not found", 404, ErrorCode.USER_NOT_FOUND);
    }

    return ApiResponse.success(res, "User deleted successfully", null, 204);
  }

  /* ---------------------------------------------------------
     FOLLOW USER
  ----------------------------------------------------------*/
  async followUser(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.id;
    const { targetUserId } = req.params;

    if (!userId) {
      throw new ApiError("Unauthorized user", 401, ErrorCode.UNAUTHORIZED);
    }

    if (!targetUserId) {
      throw new ApiError("Target user ID is required", 400, ErrorCode.BAD_REQUEST);
    }

    await this.userService.followUser(userId, targetUserId);

    return ApiResponse.success(res, "User followed successfully");
  }

  /* ---------------------------------------------------------
     UNFOLLOW USER
  ----------------------------------------------------------*/
  async unfollowUser(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.id;
    const { targetUserId } = req.params;

    if (!userId) {
      throw new ApiError("Unauthorized user", 401, ErrorCode.UNAUTHORIZED);
    }

    if (!targetUserId) {
      throw new ApiError("Target user ID is required", 400, ErrorCode.BAD_REQUEST);
    }

    await this.userService.unfollowUser(userId, targetUserId);

    return ApiResponse.success(res, "User unfollowed successfully");
  }

  /* ---------------------------------------------------------
     GET FOLLOWERS
  ----------------------------------------------------------*/
  async getFollowers(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    if (!id) {
      throw new ApiError("User ID is required", 400, ErrorCode.BAD_REQUEST);
    }

    const followers = await this.userService.getFollowers(id);

    return ApiResponse.success(res, "Followers fetched successfully", followers);
  }

  /* ---------------------------------------------------------
     GET FOLLOWING
  ----------------------------------------------------------*/
  async getFollowing(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    if (!id) {
      throw new ApiError("User ID is required", 400, ErrorCode.BAD_REQUEST);
    }

    const following = await this.userService.getFollowing(id);

    return ApiResponse.success(
      res,
      "Following users fetched successfully",
      following
    );
  }
}
