'use strict';
require('dotenv').config();
const CronJob = require('cron').CronJob;
const scraping = require('./scp-tty-comic-bnr');
const cronTime = process.env.CRON_TIME;

console.log('cron!');
const job = new CronJob(cronTime, scraping, null, true, 'Asia/Tokyo');
