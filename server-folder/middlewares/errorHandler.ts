import type { Request, Response } from 'express'
import createError from "http-errors";
// @ts-ignore 
import { getReasonPhrase, StatusCodes } from 'http-status-codes'

function hasProperty<K extends string>(obj: unknown, key: K): obj is { [M in K]: unknown } {
  return obj instanceof Object && key in obj
}

export function PageNotFoundHandler(req: Request, res: Response) {
  console.log('PageNotFoundHandler')
  const error = {
    url: req.path,
    statusCode: StatusCodes.NOT_FOUND,
    statusMessage: getReasonPhrase(StatusCodes.NOT_FOUND),
    message: `request path ${req.path} is not found`,
    description: 'check request path',
  }

  return res.status(StatusCodes.NOT_FOUND).json(error)
}

export function errorHandler(error: any, req: Request, res: Response) {
  console.log('error !!!',error)
  if (!error.status) {
    error = createError.InternalServerError()
  }
  return res.status(error.status).json({
    success: false,
    message: '',
    data: null,
    error
  })
}
