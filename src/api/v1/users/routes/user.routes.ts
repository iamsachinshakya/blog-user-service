import { Router } from "express";

import { imageSchema, updateUserSchema } from "../validations/user.validation";
import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.service";
import { UserController } from "../controllers/user.controller";
import { authenticateJWT } from "../../common/middlewares/auth.middleware";
import { PERMISSIONS } from "../../common/constants/permission";
import { validateBody, validateFileSchema } from "../../common/middlewares/validate.middleware";
import { requirePermission } from "../../common/middlewares/requirePermission";
import { asyncHandler } from "../../common/utils/asyncHandler";
import { uploadSingle } from "../middleware/upload.middleware";

export const userRouter = Router();

// Proper DI chain
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);


/**
 * @route   GET /api/v1/users
 * @desc    Get all users
 * @access  Private (Admin only)
 */
userRouter.get(
  "/",
  authenticateJWT,
  requirePermission(PERMISSIONS.USER.READ),
  asyncHandler(userController.getAll.bind(userController))
);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
userRouter.get(
  "/:id",
  authenticateJWT,
  requirePermission(PERMISSIONS.USER.READ),
  asyncHandler(userController.getById.bind(userController))
);

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Delete user
 * @access  Private (Admin only)
 */
userRouter.delete(
  "/:id",
  authenticateJWT,
  requirePermission(PERMISSIONS.USER.DELETE),
  asyncHandler(userController.delete.bind(userController))
);

/**
 * @route   PATCH /api/v1/users/update-account
 * @desc    Update user profile details (name, email, etc.)
 * @access  Private
 */
userRouter.patch(
  "/:id",
  authenticateJWT,
  requirePermission(PERMISSIONS.USER.UPDATE),
  validateBody(updateUserSchema),
  asyncHandler(userController.updateAccountDetails.bind(userController))
);

/**
 * @route   PATCH /api/v1/users/avatar
 * @desc    Update user avatar
 * @access  Private
 */
userRouter.patch(
  "/:id/avatar",
  authenticateJWT,
  requirePermission(PERMISSIONS.USER.UPDATE),
  uploadSingle("avatar"),
  validateFileSchema(imageSchema),
  asyncHandler(userController.updateAvatar.bind(userController))
);

/**
 * @route   POST /api/v1/users/follow/:targetUserId
 * @desc    Follow another user
 * @access  Private
 */
userRouter.post(
  "/follow/:targetUserId",
  authenticateJWT,
  requirePermission(PERMISSIONS.USER.UPDATE),
  asyncHandler(userController.followUser.bind(userController))
);

/**
 * @route   DELETE /api/v1/users/unfollow/:targetUserId
 * @desc    Unfollow a user
 * @access  Private
 */
userRouter.delete(
  "/unfollow/:targetUserId",
  authenticateJWT,
  requirePermission(PERMISSIONS.USER.UPDATE),
  asyncHandler(userController.unfollowUser.bind(userController))
);

/**
 * @route   GET /api/v1/users/:id/followers
 * @desc    Get all followers of a user
 * @access  Private
 */
userRouter.get(
  "/:id/followers",
  authenticateJWT,
  requirePermission(PERMISSIONS.USER.READ),
  asyncHandler(userController.getFollowers.bind(userController))
);

/**
 * @route   GET /api/v1/users/:id/following
 * @desc    Get all users followed by this user
 * @access  Private
 */
userRouter.get(
  "/:id/following",
  authenticateJWT,
  requirePermission(PERMISSIONS.USER.READ),
  asyncHandler(userController.getFollowing.bind(userController))
);



export default userRouter;
