import {schedule} from 'node-cron';
import { syncKey } from '../helpers/syncKeyHelper';

schedule('0 0 * * *', () => {
  syncKey();
});
