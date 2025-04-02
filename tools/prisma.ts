import { PrismaClient } from "@prisma/client";
const config = useRuntimeConfig()

const prisma = new PrismaClient({
    datasources: {
      db: {
        //@ts-ignore
        url: config.public.bdUrl
      }
    }
  });
export default prisma;
