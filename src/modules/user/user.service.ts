import httpStatus from 'http-status';
import mongoose from 'mongoose';
import User from './user.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { NewCreatedUser, UpdateUserBody, IUserDoc, NewRegisteredUser } from './user.interfaces';
import { CommonResponseType } from '../../config/response';

/**
 * Create a user
 * @param {NewCreatedUser} userBody
 * @returns {Promise<IUserDoc>}
 */
export const createUser = async (userBody: NewCreatedUser): Promise<IUserDoc> => {
  if (await User.isEmailTaken(userBody.email)) {
    const errorResponse: CommonResponseType<null> = {
      code: httpStatus.BAD_REQUEST,
      data: null,
      message: 'Email already taken',
      success: false,
    };
    throw new ApiError(errorResponse.code, errorResponse.message);
  }
  return User.create(userBody);
};

/**
 * Register a user
 * @param {NewRegisteredUser} userBody
 * @returns {Promise<IUserDoc>}
 */
export const registerUser = async (userBody: NewRegisteredUser): Promise<IUserDoc> => {
  if (await User.isEmailTaken(userBody.email)) {
    const errorResponse: CommonResponseType<null> = {
      code: httpStatus.BAD_REQUEST,
      data: null,
      message: 'Email already taken',
      success: false,
    };
    throw new ApiError(errorResponse.code, errorResponse.message);
  }
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryUsers = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IUserDoc | null>}
 */
export const getUserById = async (id: mongoose.Types.ObjectId): Promise<IUserDoc | null> => User.findById(id);

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<IUserDoc | null>}
 */
export const getUserByEmail = async (email: string): Promise<IUserDoc | null> => User.findOne({ email });

/**
 * Update user by id
 * @param {mongoose.Types.ObjectId} userId
 * @param {UpdateUserBody} updateBody
 * @returns {Promise<IUserDoc | null>}
 */
export const updateUserById = async (
  userId: mongoose.Types.ObjectId,
  updateBody: UpdateUserBody
): Promise<IUserDoc | null> => {
  const user = await getUserById(userId);
  if (!user) {
    const errorResponse: CommonResponseType<null> = {
      code: httpStatus.NOT_FOUND,
      data: null,
      message: 'User not found',
      success: false,
    };
    throw new ApiError(errorResponse.code, errorResponse.message);
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    const errorResponse: CommonResponseType<null> = {
      code: httpStatus.BAD_REQUEST,
      data: null,
      message: 'Email already taken',
      success: false,
    };
    throw new ApiError(errorResponse.code, errorResponse.message);
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<IUserDoc | null>}
 */
export const deleteUserById = async (userId: mongoose.Types.ObjectId): Promise<IUserDoc | null> => {
  const user = await getUserById(userId);
  if (!user) {
    const errorResponse: CommonResponseType<null> = {
      code: httpStatus.NOT_FOUND,
      data: null,
      message: 'User not found',
      success: false,
    };
    throw new ApiError(errorResponse.code, errorResponse.message);
  }
  await user.deleteOne();
  return user;
};
