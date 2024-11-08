import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as userService from './user.service';
import { CommonResponseType } from '../../config/response';

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  const response: CommonResponseType<typeof user> = {
    code: httpStatus.CREATED,
    data: user,
    message: 'User created successfully',
    success: true,
  };
  res.status(httpStatus.CREATED).send(response);
});

export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'role']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const result = await userService.queryUsers(filter, options);
  const response: CommonResponseType<typeof result> = {
    code: httpStatus.OK,
    data: result,
    message: 'Users retrieved successfully',
    success: true,
  };
  res.send(response);
});

export const getUser = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['userId'] === 'string') {
    const user = await userService.getUserById(new mongoose.Types.ObjectId(req.params['userId']));
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    const response: CommonResponseType<typeof user> = {
      code: httpStatus.OK,
      data: user,
      message: 'User retrieved successfully',
      success: true,
    };
    res.send(response);
  }
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['userId'] === 'string') {
    const user = await userService.updateUserById(new mongoose.Types.ObjectId(req.params['userId']), req.body);
    const response: CommonResponseType<typeof user> = {
      code: httpStatus.OK,
      data: user,
      message: 'User updated successfully',
      success: true,
    };
    res.send(response);
  }
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['userId'] === 'string') {
    await userService.deleteUserById(new mongoose.Types.ObjectId(req.params['userId']));
    const response: CommonResponseType<null> = {
      code: httpStatus.NO_CONTENT,
      data: null,
      message: 'User deleted successfully',
      success: true,
    };
    res.status(httpStatus.NO_CONTENT).send(response);
  }
});
