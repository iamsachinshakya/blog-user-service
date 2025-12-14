import { IUserEntity } from "../models/user.entity";
import { IUpdateUserProfile } from "../models/user.dto";
import { IQueryParams, PaginatedData } from "../../common/models/common.dto";

export interface IUserRepository {

  create(data: IUserEntity): Promise<IUserEntity | null>;

  /* -------------------------------------------------------------------------- */
  /*                                 FIND ALL USERS                              */
  /* -------------------------------------------------------------------------- */
  findAll(
    params: IQueryParams
  ): Promise<PaginatedData<IUserEntity>>;

  /* -------------------------------------------------------------------------- */
  /*                                   FIND BY ID                                */
  /* -------------------------------------------------------------------------- */
  findById(userId: string): Promise<IUserEntity | null>;

  /* -------------------------------------------------------------------------- */
  /*                          UPDATE ACCOUNT DETAILS (PROFILE)                   */
  /* -------------------------------------------------------------------------- */
  updateAccountDetails(
    userId: string,
    updates: Partial<IUpdateUserProfile>
  ): Promise<IUserEntity | null>;

  /* -------------------------------------------------------------------------- */
  /*                           GENERIC UPDATE (UPDATE BY ID)                     */
  /* -------------------------------------------------------------------------- */
  updateById(
    userId: string,
    updates: Partial<IUserEntity>
  ): Promise<IUserEntity | null>;

  /* -------------------------------------------------------------------------- */
  /*                                    DELETE                                   */
  /* -------------------------------------------------------------------------- */
  deleteById(userId: string): Promise<boolean>;

  /* -------------------------------------------------------------------------- */
  /*                               FOLLOW SYSTEM                                 */
  /* -------------------------------------------------------------------------- */
  addFollower(targetUserId: string, followerId: string): Promise<void>;

  addFollowing(userId: string, targetUserId: string): Promise<void>;

  removeFollower(targetUserId: string, followerId: string): Promise<void>;

  removeFollowing(userId: string, targetUserId: string): Promise<void>;

  /* -------------------------------------------------------------------------- */
  /*                        GET FOLLOWERS / GET FOLLOWING                        */
  /* -------------------------------------------------------------------------- */
  findFollowers(userId: string): Promise<IUserEntity[]>;

  findFollowing(userId: string): Promise<IUserEntity[]>;
}
