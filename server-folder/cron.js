import { CronJob } from 'cron';
import { parseRoute } from './controllers/admin';

export default function setup() {
  console.log('setup cron job')
  const RUN_EVERY_1_MINUTE = new CronJob('*/1 * * * *', function () {
    const instanceId = process.env['INSTANCE_ID'];
    console.log('RUN_EVERY_1_MINUTE', instanceId);
    if (parseInt(instanceId, 10) === 0 || typeof instanceId === 'undefined') {
      parseRoute()
      parseRoute({link: 'https://krasnodar.hh.ru/search/vacancy?from=suggest_post&ored_clusters=true&order_by=publication_time&hhtmFrom=vacancy_search_list&hhtmFromLabel=vacancy_search_line&enable_snippets=false&L_save_area=true&schedule=remote&search_field=name&search_field=company_name&search_field=description&text=Vue.js'})
      console.log('start');
    }
  });

    
  RUN_EVERY_1_MINUTE.start();


}
