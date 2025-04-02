import type { RouteConfig } from '../routes/resourceHelper'
import type { Request, Response, NextFunction, RequestHandler } from 'express'
import createError from "http-errors";
import md5 from "md5"
import Cookie from 'cookie'
import { errorHandler } from '../middlewares/errorHandler';
import prisma from "../../tools/prisma";
import { encryptPassword, isPasswordMatch } from "../../tools/encryption";
import { sendEmail } from '~/tools/email';
//@ts-ignore
import { body, validationResult, query } from 'express-validator';
import { getMessages } from "../lib/validation";
import { afterSignupAuth } from '../middlewares/common';
import { generateUserTokens } from '../lib/helpers';
import multer from 'multer'
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
export type updatePasswordType = {
  token: string; 
  password: string 
};
export type updateUserType = { 
   email: string
   username: string
   avatar: string 
} 

const emailValid =  body('email').isEmail().withMessage('Not a valid e-mail address');
const usernamelValid =  body('username').notEmpty().withMessage('Not a valid username');
const passwordlValid = body('password').notEmpty().withMessage('Not a valid password');
const tokenValidBody = body('token').notEmpty()
const tokenValid = query('token').notEmpty()

function i18n(message: string) {
  //TODO
  return message
}

export async function register(req: Request, res: Response, _next: NextFunction) {
  try {
    const { email, username, password } = req.body;

    const validationErrors = await getMessages(validationResult(req));
    if (!validationErrors) {
      console.log('req.body', req.body)
      let userObj = await prisma.user.findFirst({
        where: {
          OR: [  
            {  email: email },
            {  username: username },
          ]}
      });

      if (userObj) {
        return errorHandler(createError(400, i18n("userAlreadyEixists")), req, res)
      }

      let result = await prisma.user.create({
        data: {
          username: username,
          email: email,
          password: await encryptPassword(password),
        },
      });

      
      res.send({
        success: true,
        frontMessage: true,
        message: i18n("userCreated")
      });
    }

    return errorHandler(createError.BadRequest(validationErrors), req, res)
    
  } catch (err) {
    console.log('err',err)
    return errorHandler(createError.InternalServerError(), req, res)
  }
}

export const login = async (req: Request, res: Response, next: Function) => {
  try {
    const { email, password } = req.body;
    let user;
    if (email) {
      user = await prisma.user.findFirst({
        where: {
          email: {equals: email}
        },
      });
    } else {
      throw createError(400, "Email is Required")
    }
    if (!user) {
      throw createError(400, i18n("userNotFound"))
    } else {
      const match = await isPasswordMatch(password, user.password);
      if (!match) {
        throw createError(400, i18n("userNotFound"))
      } else {
        let token = await generateUserTokens(user, req, res)

        
        res.json({
          success: true,
          data: {
            id: user.id, 
            email: user.email, 
            isEmailVerified: user.isEmailVerified, 
            rate: user.rate, 
            role: user.role, 
            username: user.username, 
            avatar: user.avatar, 
            token,
          }
        })
      }
    }
  } catch (error) {
    return errorHandler(error, req, res)
  }
};



export const logout = async (req: any, res: Response, next: Function) => {
  try {
    console.log('res.locals.auth.id ',res.locals.auth.id )
      let data = await prisma.userAuthTokens.deleteMany({
        where: { fingerprint: req.fingerprint.hash, user_id: res.locals.auth.id }
      });
      res.json({
        success: true,
        data
      })
  } catch (error) {
    return errorHandler(error, req, res)
  }
};

export const refreshToken = async (req: any, res: Response, next: Function): Promise<Response> => {
  try {
    var cookie = req.headers.cookie ? Cookie.parse(req.headers.cookie) : {}
    let tokenInDb;
    let user
    let success = true
    if (cookie.refreshToken) {
      tokenInDb = await prisma.userAuthTokens.findFirst({
        where: {
          refreshToken: {equals: cookie.refreshToken}
        },
      });
      if (!tokenInDb) {
        success = false
      }
      if (tokenInDb && tokenInDb.fingerprint == req.fingerprint.hash) {
        user = await prisma.user.findFirst({
          where: {
            id: {equals: tokenInDb.user_id}
          },
        });
        if (!user) {
          success = false
        } else {
          let token = await generateUserTokens(user, req, res)
          return res.status(200).json({
            success: true,
            data: {...user, token}
          })
        }
        
      } else {
        success = false
      }

    } else {
      success = false
    }
    throw createError(401, i18n("userNotFound"))
  } catch (error: any) {
    return errorHandler(error, req, res)
  }
};



export const forgot = async (req: Request, res: Response, next: Function) => {
  try {
    let email = req.body.email;
    let THIRDTEEN_MINUTES = new Date().getTime() + 1800000;
    if (email) {
      let user = await prisma.user.findFirst({
        where: {
          email: email
        },
      });
      if (!user) {
        throw createError(400, "User not Found")
      }
      //@ts-ignore
      let generate = md5(THIRDTEEN_MINUTES)
      let data = await prisma.user.update({
        where: { id: user.id },
        data: {
          forgotToken: generate,
        },
      });
      let pwResetLink = `${process.env.baseURL}/reset-password/${generate}`
      let result = await sendEmail(
        user.email,
        i18n("resetPass"),
        `${i18n("followToReset")}${pwResetLink}`,
      )
      
      return res.status(200).json({
          success: true,
          frontMessage: true,
          message: i18n("recoverySent")
      })
    } else {
      res.send(createError.BadRequest("Email is Required"));
    }
  } catch (error) {
    return errorHandler(error, req, res)
  }
};

export const checkForgotToken = async (req: Request, res: Response, next: Function) => {
  try {
    let token = req.query.token as string 
    let user = await prisma.user.findFirst({
      where: {
        forgotToken: {equals: token}
      },
    });
    if (user) {
      return res.status(200).json({
        success: true,
      })
    } else {
      throw createError.BadRequest("Wrong token");
    }
  } catch (error: any) {
    //error.hideFrontMessage = true
    return errorHandler(error, req, res)
  }
};

export const updatePassword = async (req: Request, res: Response, next: Function) => {
  try {
    const validationErrors = await getMessages(validationResult(req));
    if (validationErrors) {
      throw createError.BadRequest(validationErrors)
    } 
    const { token, password }: updatePasswordType = req.body;
    let user = await prisma.user.findFirst({
      where: {
        forgotToken: token
      },
    });
    if (!user) {
      throw createError.BadRequest("User not Found")
    }
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: await encryptPassword(password),
        forgotToken: ''
      },
    });
    return res.status(200).json({
      success: true,
    })
  } catch (error) {
    return errorHandler(error, req, res)
  }
};

export const updateUser = async (req: Request, res: Response, next: Function) => {
  try {
    const { email, username, avatar }: updateUserType = req.body;
    let payload: any = {}
    if (avatar) {
      payload.avatar = avatar
    }
    if (email) {
      payload.email = email
      let user = await prisma.user.findFirst({
        where: {
          email: email,
          id: {not: { equals: res.locals.auth.id  }}
        },
      });
      if (user) {
        throw createError.BadRequest("Емайл уже существует")
      }
    }
    if (username) {
      payload.username = username
      let user = await prisma.user.findFirst({
        where: {
          username: username,
          id: {not: { equals: res.locals.auth.id  }}
        },
      });
      if (user) {
        throw createError.BadRequest("Имя уже существует")
      }
    }
    await prisma.user.update({
      where: { id: res.locals.auth.id },
      data: payload,
    });
    return res.status(200).json({
      success: true,
    })
  } catch (error) {
    return errorHandler(error, req, res)
  }
};
export const getUser = async (req: any, res: Response, next: Function) => {
  try {
      let id = parseInt(req.query.id)
      let data: any = await prisma.user.findFirst({where: {id}})
      
      if (data) {
        delete data.role
        delete data.password
        delete data.forgotToken
        delete data.isEmailVerified
        delete data.deletedAt
      }
  
      return res.status(200).json({
          success: true,
          data,
      })
  } catch (error) {
    return errorHandler(error, req, res)
  }
};





// Mounted in routes.ts
export const routes: RouteConfig = {
  routes: [
    { method: 'post', path: '/register', handler: [emailValid, passwordlValid, usernamelValid, register as unknown  as RequestHandler] },
    { method: 'post', path: '/login', handler: login as RequestHandler },
    { method: 'post', path: '/logout', handler: [afterSignupAuth as RequestHandler, logout as RequestHandler] },
    { method: 'post', path: '/refreshToken', handler: refreshToken as unknown as RequestHandler },
    { method: 'post', path: '/forgot', handler: forgot as RequestHandler },
    { method: 'get', path: '/checkForgotToken', handler: [tokenValid, checkForgotToken as unknown as RequestHandler] },
    { method: 'post', path: '/updatePassword', handler: [passwordlValid, tokenValidBody, updatePassword as unknown as RequestHandler] },
    { method: 'get', path: '/', handler: getUser as unknown as RequestHandler },
    { method: 'post', path: '/', handler: [afterSignupAuth as RequestHandler, updateUser as unknown as RequestHandler] },

    

  ],
}

export default routes
