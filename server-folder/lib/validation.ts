import type { ExpressValidator, Result } from "express-validator";
//@ts-ignore
import { body, query, validationResult } from 'express-validator';

export const getMessages = async (validation: Result) => {
  let mess = ''
  if (!validation.isEmpty()) {
    validation.array().map(one => {
        console.log('erro', one)
        mess += `${one.path}: ${one.msg}. ` 
    })
  } 
  return mess
};


export const room_id_query_valid = query('room_id').notEmpty()
export const avatar_body_valid = body('avatar').notEmpty()
export const id_body_valid = body('id').notEmpty()
export const image_body_valid = body('image').notEmpty()
export const name_body_valid = body('name').notEmpty()
export const logo_body_valid = body('logo').notEmpty()
export const id_query_valid = query('id').notEmpty()


