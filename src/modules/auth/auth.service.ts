import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Token from '../token/token.model';
import ApiError from '../errors/ApiError';
import tokenTypes from '../token/token.types';
import { getUserByEmail, getUserById, updateUserById } from '../user/user.service';
import { IUserDoc, IUserWithTokens } from '../user/user.interfaces';
import { generateAuthTokens, verifyToken } from '../token/token.service';
import redisClient from '../redis/redisClient'; // Assuming you have a redis client setup
import { sendEmail } from '../email/email.service'; // Assuming you have an email service setup
import { logger } from '../logger';

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<IUserDoc>}
 */
export const loginUserWithEmailAndPassword = async (email: string, password: string): Promise<IUserDoc> => {
  const user = await getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise<void>}
 */
export const logout = async (refreshToken: string): Promise<void> => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.deleteOne();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<IUserWithTokens>}
 */
export const refreshAuth = async (refreshToken: string): Promise<IUserWithTokens> => {
  try {
    const refreshTokenDoc = await verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await getUserById(new mongoose.Types.ObjectId(refreshTokenDoc.user));
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.deleteOne();
    const tokens = await generateAuthTokens(user);
    return { user, tokens };
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
export const resetPassword = async (resetPasswordToken: any, newPassword: string): Promise<void> => {
  try {
    const resetPasswordTokenDoc = await verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await getUserById(new mongoose.Types.ObjectId(resetPasswordTokenDoc.user));
    if (!user) {
      throw new Error();
    }
    await updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise<IUserDoc | null>}
 */
export const verifyEmail = async (verifyEmailToken: any): Promise<IUserDoc | null> => {
  try {
    const verifyEmailTokenDoc = await verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await getUserById(new mongoose.Types.ObjectId(verifyEmailTokenDoc.user));
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    const updatedUser = await updateUserById(user.id, { isEmailVerified: true });
    return updatedUser;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

/**
 * Send email code
 * @param {string} email
 * @returns {Promise<void>}
 */
export const sendEmailCode = async (email: string): Promise<void> => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  await redisClient.set(email, code, 'EX', 60); // Store code in Redis with 60 seconds expiration
  await sendEmail(email, 'Your verification code', `Your verification code is ${code}`, '');
};

/**
 * Confirm email code
 * @param {string} email
 * @param {string} code
 * @returns {Promise<void>}
 */
export const confirmEmailCode = async (email: string, code: string): Promise<void> => {
  try {
    console.log(`Confirming email code for email: ${email}, code: ${code}`);
    const storedCode = await redisClient.get(email);
    console.log(`storedCode`, storedCode);
    logger.error(`email: ${email}`, storedCode)
    if (!storedCode) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired code');

    if (storedCode !== code) {
      console.error(`Invalid or expired code for email: ${email}`);
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired code');
    }
    else {
      await redisClient.del(email); // Delete the code from Redis after confirmation
    }
    console.log(`Email code confirmed and deleted for email: ${email}`);
  } catch (error) {
    console.error(`Error confirming email code for email: ${email}`, error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error confirming email code');
  }
};
