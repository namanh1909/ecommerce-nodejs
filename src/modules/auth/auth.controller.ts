import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { tokenService } from '../token';
import { userService } from '../user';
import * as authService from './auth.service';
import { emailService } from '../email';
import { logger } from '../logger';
import { CommonResponseType } from '../../config/response';

export const register = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.registerUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  const response: CommonResponseType<{ user: typeof user; tokens: typeof tokens }> = {
    code: httpStatus.CREATED,
    data: { user, tokens },
    message: 'User registered successfully',
    success: true,
  };
  res.status(httpStatus.CREATED).send(response);
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  const response: CommonResponseType<{ user: typeof user; tokens: typeof tokens }> = {
    code: httpStatus.OK,
    data: { user, tokens },
    message: 'Login successful',
    success: true,
  };
  res.send(response);
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  await authService.logout(req.body.refreshToken);
  const response: CommonResponseType<null> = {
    code: httpStatus.NO_CONTENT,
    data: null,
    message: 'Logout successful',
    success: true,
  };
  res.status(httpStatus.NO_CONTENT).send(response);
});

export const refreshTokens = catchAsync(async (req: Request, res: Response) => {
  const userWithTokens = await authService.refreshAuth(req.body.refreshToken);
  const response: CommonResponseType<typeof userWithTokens> = {
    code: httpStatus.OK,
    data: userWithTokens,
    message: 'Tokens refreshed successfully',
    success: true,
  };
  res.send(response);
});

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  const response: CommonResponseType<null> = {
    code: httpStatus.NO_CONTENT,
    data: null,
    message: 'Reset password email sent',
    success: true,
  };
  res.status(httpStatus.NO_CONTENT).send(response);
});

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  await authService.resetPassword(req.query['token'], req.body.password);
  const response: CommonResponseType<null> = {
    code: httpStatus.NO_CONTENT,
    data: null,
    message: 'Password reset successful',
    success: true,
  };
  res.status(httpStatus.NO_CONTENT).send(response);
});

export const sendVerificationEmail = catchAsync(async (req: Request, res: Response) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken, req.user.name);
  const response: CommonResponseType<null> = {
    code: httpStatus.NO_CONTENT,
    data: null,
    message: 'Verification email sent',
    success: true,
  };
  res.status(httpStatus.NO_CONTENT).send(response);
});

export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  await authService.verifyEmail(req.query['token']);
  const response: CommonResponseType<null> = {
    code: httpStatus.NO_CONTENT,
    data: null,
    message: 'Email verified successfully',
    success: true,
  };
  res.status(httpStatus.NO_CONTENT).send(response);
});

export const sendOTPEmail = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  await authService.sendEmailCode(email);
  const response: CommonResponseType<null> = {
    code: httpStatus.NO_CONTENT,
    data: null,
    message: 'OTP email sent',
    success: true,
  };
  res.status(httpStatus.NO_CONTENT).send(response);
});

export const confirmOTPEmail = catchAsync(async (req: Request, res: Response) => {
  const { email, code } = req.body;
  logger.info('Connected to email server', req.body);
  await authService.confirmEmailCode(email, code);
  const response: CommonResponseType<null> = {
    code: httpStatus.NO_CONTENT,
    data: null,
    message: 'OTP confirmed successfully',
    success: true,
  };
  res.status(httpStatus.NO_CONTENT).send(response);
});
