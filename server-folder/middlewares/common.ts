import jwt, { type Secret, type JwtPayload } from "jsonwebtoken";
import Cookie from 'cookie'
import type { NextFunction, Request, Response } from "express";
import { ERROR_EXPIRED } from "~/server-folder/constants";
import prisma from "~/tools/prisma";
export const SECRET_KEY: Secret = `${process.env.ACCESS_TOKEN_SECRET}`;
import {  validationResult } from 'express-validator';
import { errorHandler } from './errorHandler';
import { getMessages } from "../lib/validation";
import createError from "http-errors";

export const validationMiddleware = async (req: any, res: Response, next: NextFunction) => {
  const validationErrors = await getMessages(validationResult(req));
    if (!validationErrors) {
      next() 
      return
    }
    return errorHandler(createError.BadRequest(validationErrors), req, res)
}

export const afterSignupAuth = async (req: any, res: Response, next: NextFunction) => {
  console.log('req.originalUrl',req.originalUrl)
 
  if (req.headers.authorization) {
    const authHeader = req.headers.authorization; //req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    jwt.verify(token, SECRET_KEY, async (err: any, decode: any) => {
      if (err) {
        console.log('invalid token 1')
        return res.status(401).json({
            success: false,
            message: 'Invalid access token',
            type: ERROR_EXPIRED,
        })
      } else {
        let now = new Date().getTime() / 1000
        let left = decode.exp - now 
        if (left < 5) {
          return res.status(401).json({
            success: false,
            message: 'Token is expired',
            type: ERROR_EXPIRED,
          })
        }

        let isAuth = await checkAuthorization({...decode, token}, req)
        if (!isAuth) {
          return res.status(401).json({
            success: false,
            message: 'Token not found',
            type: ERROR_EXPIRED,
          })
        }
        res.locals.auth = {
            id: decode.userId,
            username: decode.username,
            userEmail: decode.userEmail,
            userRole: decode.userRole,
         }
        next()        
      }
    })
  }  else {
    return res.status(401).json({
      success: false,
      message: 'It is private function. Please add authorization header'
    })
  }
}

export const checkAuthorization = async (user: any, req: any) => {
  let token = await prisma.userAuthTokens.findFirst({
      where: {
          id: user.id,
          fingerprint: req.fingerprint.hash,
          accessToken: user.token
      }
  })
   if (!token) {
      return false
   } else {
      return true
   }
}

export const isAdmin = async (req: any, res: Response, next: NextFunction) => {
  if (!res.locals.auth.userEmail) {
    return res.status(400).json({
      success: false,
      message: 'Admin check, email sent',
    })
  }
  let user = await prisma.user.findFirst({
    where: {
        id: res.locals.auth.id,
        email: res.locals.auth.userEmail
    }
  })
  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Admin check, user not found',
    })
  }
  if (user.role !== 'ADMIN') {
    return res.status(400).json({
      success: false,
      message: 'Forbidden',
    })
  }
  next()
}
