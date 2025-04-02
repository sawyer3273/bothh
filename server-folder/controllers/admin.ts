import type { RouteConfig } from '../routes/resourceHelper'
import type { Request, Response, NextFunction, RequestHandler } from 'express'
import createError from "http-errors";
import { errorHandler } from '../middlewares/errorHandler';
//@ts-ignore
import { Scraper, Root, DownloadContent, OpenLinks, CollectContent } from 'nodejs-web-scraper'
import prisma from '~/tools/prisma';
import TelegramBot from 'node-telegram-bot-api';
const API_KEY_BOT = '7960656635:AAGsvEzrS5e9gMA14c2ke2t50U_1YTr3V-s';

const bot = new TelegramBot(API_KEY_BOT, {

    polling: true
    
});

bot.on('text', async msg => {

  try {

      if(msg.text == '/start') {
        console.log('msg.chat.id',msg.chat.id)
          await bot.sendMessage(msg.chat.id, `Вы запустили бота!`);

      }

  }
  catch(error) {

      console.log(error);

  }

})

export const parseRoute = async (req: any, res: Response, next: Function) => {
  try {
    let origin =  `https://krasnodar.hh.ru/search/vacancy?from=suggest_post&ored_clusters=true&order_by=publication_time&hhtmFrom=vacancy_search_list&hhtmFromLabel=vacancy_search_line&enable_snippets=false&L_save_area=true&schedule=remote&search_field=name&search_field=company_name&search_field=description&text=Vue.js`
    
        const config = {
          baseSiteUrl: origin,
          startUrl: origin,
          concurrency: 10,//Maximum concurrent jobs. More than 10 is not recommended.Default is 3.
          maxRetries: 3,//The scraper will try to repeat a failed request few times(excluding 404). Default is 5.       
          logPath: './logs/',//Highly recommended: Creates a friendly JSON for each operation object, with all the relevant data. 
          // proxy: 'http://fr5VrVwg:QjhN819A@45.147.12.122:62500'
        }
        const scraper = new Scraper(config);
        const root = new Root();
        const data = new CollectContent('.vacancy-name-wrapper--PSD41i3dJDUNb5Tr', { name: 'data', contentType:'html' });

        root.addOperation(data);

        await scraper.scrape(root);
        const links = data.getData();
        let result = []
        for (let j = 0; j < links.length; j++) {
          if (links[j].includes('href="')) {
            let link = links[j].split('href="')[1].split('?query=Vu')[0]
            let text = links[j].split('gritte-text___tkzIl_5-0-8">')[1].split('</span')[0]
            result.push({link, text})
            let movieObj = await prisma.vacancy.findFirst({
              where: {
                  link: link,
                }
            });
  
            if (!movieObj) {
              await prisma.vacancy.create({
                data: {
                    link: link,
                    name: text
                  }
              });
              await bot.sendMessage(5895617262, `${text}\nСсылка: ${link}`);
              
            }
          }
        }
        if (!res) {
          return result
        }
      return res.status(200).json({
          success: true,
          result,
      })
  } catch (error) {
    return errorHandler(error, req, res)
  }
};



// Mounted in routes.ts
export const routes: RouteConfig = {
  routes: [
    { method: 'get', path: '/', handler: parseRoute as unknown as RequestHandler },
  ],
}

export default routes
