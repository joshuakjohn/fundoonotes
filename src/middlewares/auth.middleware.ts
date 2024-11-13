/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Middleware to authenticate if user has a valid Authorization token
 * Authorization: Bearer <token>
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
const auth = (secret_token: string) => {
  return async (
  req: Request,
  res: Response,
  next: NextFunction
  ): Promise<void> => {
    try {
      let bearerToken = req.header('Authorization');
      if (!bearerToken)
        throw {
          code: HttpStatus.BAD_REQUEST,
          message: 'Authorization token is required'
        };
      bearerToken = bearerToken.split(' ')[1];
      const { userId }: any = await jwt.verify(bearerToken, secret_token);
      res.locals.id = userId;
      next();
    } catch (error) {
      next(error);
    }
  };
}

export const userAuth = auth(process.env.SECRET_TOKEN);

export const resetPasswordAuth = auth(process.env.SECRET_TOKEN2)