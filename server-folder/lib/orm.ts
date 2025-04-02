import prisma from "~/tools/prisma";
import type { DataModels } from "~/constants/types";

export const where = (cond: Object) => {
    let result = {}
/*
    Object.keys(cond).map((key) => {
        let one = cond[key]
        if ()
        result[key] = 
    }) 
    email: {
        contains: 'prisma.io',
      },
      */
}

export const findMany = (req: any, model: DataModels, where: any = {}, options: any = {}) => {
    const size: string | null = <string>req.query.size || req.body.size || null
    const page: string | null = <string>req.query.page || req.body.page || null
    let sizeInt = parseInt(size ? size : '200')
    let pageInt = parseInt(page ? page : '1')
    let params: any = {
        take: sizeInt,
        skip: (pageInt - 1) * sizeInt, 
        where: where,
    }
    if (options.include) {
        params.include = options.include
    }
    if (options.orderBy) {
        params.orderBy = options.orderBy
    }
    if (options.limit) {
        params.take = options.limit
    }
    return new Promise((resolve, reject) => {
        //@ts-ignore
        prisma[model].findMany(params).then((data: any, err: any) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        }) 
    })
};

export const getCount = (model: DataModels, where: any = {}) => {
    return new Promise((resolve) => {
        prisma[model].count({
            where: where,
        }).then((value: number) => {
            resolve(value)
        }) 
    })
};