import { CronJob } from 'cron';
import { parseRoute } from './controllers/admin';

export default function setup() {
  console.log('setup cron job')
  const RUN_EVERY_1_MINUTE = new CronJob('*/1 * * * *', function () {
    const instanceId = process.env['INSTANCE_ID'];
    console.log('RUN_EVERY_1_MINUTE', instanceId);
    if (parseInt(instanceId, 10) === 1 || typeof instanceId === 'undefined') {
      parseRoute()
      console.log('start');
    }
  });

    
  RUN_EVERY_1_MINUTE.start();


}
