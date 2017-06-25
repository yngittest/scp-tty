'use strict';

const CronJob = require('cron').CronJob;
const scraping = require('./scp-tty-comic-bnr');

console.log('cron!');
const job = new CronJob('00 7 * * * *', scraping, null, true);
