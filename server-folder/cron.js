import { CronJob } from 'cron';
import { parseRoute } from './controllers/admin';

export default function setup() {
  console.log('setup cron job')
  const RUN_EVERY_1_MINUTE = new CronJob('*/1 * * * *', function () {
    const instanceId = process.env['INSTANCE_ID'];
    console.log('RUN_EVERY_1_MINUTE', instanceId);
    if (parseInt(instanceId, 10) === 0 || typeof instanceId === 'undefined') {
      parseRoute()
      parseRoute(null, null, 'https://krasnodar.hh.ru/search/vacancy?text=Frontend&salary=&schedule=remote&ored_clusters=true&order_by=publication_time&hhtmFrom=vacancy_search_list&hhtmFromLabel=vacancy_search_line')
      console.log('start');
    }
  });

    
  RUN_EVERY_1_MINUTE.start();


}
