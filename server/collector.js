var DataSift = require('datasift'),
    step = require('step'),
    utils = require('./utils'),
    settings = require('./settings'),
    consumer = new DataSift(settings.datasiftUsername, settings.datasiftKey),
    connected = false,
    Subject = require('./subject'),
    subject = new Subject(),
    _ = require('underscore'),
    debug = require('debug')('subject-server:collector');

step(
  function() {
    utils.redis(this);
  },
  function(err, redis) {
    subject.on('subscribe', function(hash) {
      if (connected) {
        debug('subscribing %s', hash)
        consumer.subscribe(hash)
      }
    });
    subject.on('unsubscribe', function(hash) {
      if (connected) {
        debug('unsubscribing %s', hash)
        consumer.unsubscribe(hash)
      }
    });
    consumer.on("connect", function(){
      debug('connected');
      subject.find(function(err, res) {
        _.values(res).forEach(function(hash) {
          debug('subscribing %s', hash);
          consumer.subscribe(hash);
        });
      });
      connected = true;
    });
    consumer.on('interaction', function(data) {
      debug('interaction', data.hash);
      redis.lpush(settings.inqueueKey, JSON.stringify(data));
    });
    consumer.on('disconnect', function() {
      debug('disconnected');
      connected = false;
    });
  }
);

exports = module.exports = {
  start: function() {
    consumer.connect();
  },
  stop: function() {
    consumer.disconnect();
  },
  stat: function() {
    return connected ? 'connected' : 'disconnected';
  }
}
