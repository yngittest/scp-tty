'use strict';

require('dotenv').config();

const Spooky = require('spooky');

const scpCommon = require('./common');
// const ifttt = require('./ifttt');

const loginId = process.env.TSUTAYA_ID;
const loginPass = process.env.TSUTAYA_PASS;
// const iftttKey = process.env.IFTTT_KEY;

const urls = {
  login: 'https://www.discas.net/netdvd/tLogin.do?pT=0',
  logout: 'http://www.discas.net/netdvd/doLogout.do?pT=0',
  history: 'https://movie-tsutaya.tsite.jp/netdvd/comic/comicRentalHistory.do?pT=0&pT=0'
};

module.exports = function() {
  const options = {
    child: {transport: 'http'},
    casper: {logLevel: 'debug', verbose: true, waitTimeout: 30000}
  };

  const spooky = new Spooky(options, function(err) {
    if(err) {
      let e = new Error('Failed to initialize SpookyJS');
      e.details = err;
      throw e;
    }

    spooky.start();

    spooky.open(urls.logout);
    spooky.thenOpen(urls.history);
    spooky.thenOpen(urls.login);
    spooky.then([{id: loginId, pass: loginPass}, function() {
      this.fill('form#form1', {
        LOGIN_ID: id,
        PASSWORD: pass
      }, false);
    }]);
    spooky.thenClick('.tmBox00 .submitButton1');
    spooky.then(function() {
      this.waitForSelector('input[name="deleteHistoryList"]');
    });

    spooky.then(function() {
      const pager = this.evaluate(function() {
        return document.querySelector('.c_pager_num>ul>li:nth-last-child(3)>a').text;
      });

      const getAnchorList = function(selector) {
        var list = document.querySelectorAll(selector);
        var anchors = [];
        for(var i = 0; i < list.length; i++) {
          var anchor = {
            text: list[i].text,
            href: list[i].href
          };
          anchors.push(anchor);
        }
        return anchors;
      };

      var comics = [];
      for(var i = 0; i < pager; i++){
        this.then(function() {
          const anchors = this.evaluate(function(func, selector) {
            return func(selector);
          }, getAnchorList, '.c_bold>a');
          comics = comics.concat(anchors);
        });
        this.then(function() {
          if(this.exists('.c_pager_num-next>a')) {
            this.click('.c_pager_num-next>a');
          }
        });
      }
      this.then(function() {
        this.emit('output', comics);
      });
    });

    spooky.thenOpen(urls.logout);
    spooky.run();
  });

  spooky.on('output', function(list) {
    for(let element of list) {
      element.title = element.text.substr(0, element.text.lastIndexOf('　'));
    }
    const uniqueList = scpCommon.distinct(list, 'title');
    for(let element of uniqueList) {
      console.log(element.title);
    }
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
