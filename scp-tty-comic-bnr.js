'use strict';

require('dotenv').config();

const Spooky = require('spooky');
const ifttt = require('./ifttt');

const loginId = process.env.TSUTAYA_ID;
const loginPass = process.env.TSUTAYA_PASS;
const iftttKey = process.env.IFTTT_KEY;

const loginUrl = 'https://www.discas.net/netdvd/tLogin.do?pT=0';
const logoutUrl = 'http://www.discas.net/netdvd/doLogout.do?pT=0';
const comicUrl = 'http://movie-tsutaya.tsite.jp/netdvd/topComic.do?pT=0';

module.exports = function() {
  const options = {
    child: {transport: 'http'},
    casper: {logLevel: 'debug', verbose: true, waitTimeout: 10000}
  };

  const spooky = new Spooky(options, function(err) {
    if(err) {
      let e = new Error('Failed to initialize SpookyJS');
      e.details = err;
      throw e;
    }

    spooky.start();

    spooky.open(logoutUrl);

    spooky.thenOpen(comicUrl);

    spooky.thenOpen(loginUrl);

    spooky.then([{id: loginId, pass: loginPass}, function() {
      this.fill('form#form1', {
        LOGIN_ID: id,
        PASSWORD: pass
      }, false);
    }]);

    spooky.thenClick('.tmBox00 .submitButton1');

    spooky.then(function() {
      this.waitForSelector('.cosmo_contents-border>a>img', function() {
        this.emit('echo', 'comic top');
      });
    });

    spooky.then(function() {
      this.emit('bnrUrl', this.evaluate(function() {
        return document.querySelector('.cosmo_contents-border>a>img').src;
      }));
    });

    spooky.thenOpen(logoutUrl);

    spooky.run();
  });

  spooky.on('bnrUrl', function(url) {
    console.log(url);
    let values = [];
    values[0] = url;
    if(~url.indexOf('comic1040_')) {
      values[1] = 'hit!';
    }
    ifttt('tsutaya', iftttKey, values);
  });

  spooky.on('echo', function(msg) {
    console.log(msg);
  });

  spooky.on('error', function (e, stack) {
      console.error(e);
      if (stack) {
        console.log(stack);
      }
  });
}
