import { Request, Response } from "express";
import { IUpdateUserProfile, IUsersQueryParams } from "../models/user.dto";
import { UserRole } from "../models/user.entity";
import { IUserService } from "../services/user.service.interface";
import { ApiResponse } from "../../common/utils/apiResponse";
import { PAGINATION_PAGE_LIMIT } from "../../common/constants/constants";
import { IUserController } from "./user.controller.interface";

export class UserController implements IUserController {
  constructor(private readonly userService: IUserService) { }

  //  Get all users
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
    return ApiResponse.success(res, "Users fetched successfully", users);
  }


  //  Get user by ID
  async getById(req: Request, res: Response): Promise<Response> {
    const user = await this.userService.getUserById(req.params.id);
    return ApiResponse.success(res, "User fetched successfully", user);
  }

  //  Update account details
  async updateAccountDetails(req: Request, res: Response): Promise<Response> {
    const updates: IUpdateUserProfile = req.body;
    const user = await this.userService.updateAccountDetails(
      req.params.id,
      updates
    );
    return ApiResponse.success(res, "Account details updated successfully", user);
  }

  //  Update avatar
  async updateAvatar(req: Request, res: Response): Promise<Response> {
    console.log("req.file", req.file);
    console.log("body", req.body)
    const user = await this.userService.updateAvatar(req.params.id, req.file!);
    return ApiResponse.success(res, "Avatar updated successfully", user);
  }

  //  Delete user
  async delete(req: Request, res: Response): Promise<Response> {
    await this.userService.deleteUser(req.params.id);
    return ApiResponse.success(res, "User deleted successfully", null, 204);
  }

  //  Follow a user
  async followUser(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.id;
    const { targetUserId } = req.params;

    await this.userService.followUser(userId!, targetUserId);
    return ApiResponse.success(res, "User followed successfully", null, 200);
  }

  //  Unfollow a user
  async unfollowUser(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.id;
    const { targetUserId } = req.params;

    await this.userService.unfollowUser(userId!, targetUserId);
    return ApiResponse.success(res, "User unfollowed successfully", null, 200);
  }

  //  Get followers
  async getFollowers(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const followers = await this.userService.getFollowers(id);
    return ApiResponse.success(res, "Followers fetched successfully", followers);
  }

  //  Get following
  async getFollowing(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const following = await this.userService.getFollowing(id);
    return ApiResponse.success(res, "Following users fetched successfully", following);
  }

}
