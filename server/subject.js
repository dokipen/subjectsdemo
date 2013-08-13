var _ = require('underscore'),
    settings = require('./settings'),
    sprintf = require('sprintf').sprintf,
    step = require('step'),
    util = require('util'),
    events = require('events'),
    redis = require('redis'),
    CSDL = require('./csdl');

Subject = function(opts) {
  if (!(this instanceof Subject)) {
    return new Subject(opts);
  }

  _.defaults(this, opts, {
    redis: redis.createClient(),
    key: 'DS_CSDLS',
    channel: 'DS_CSDL_EVENT',
    api: CSDL(),
    pubsub: redis.createClient()
  });

  if (!this.redis) {
    throw new Error('redis not specified');
  }

  var self = this;

  self.pubsub.on('message', function(key, evraw) {
    var ev = JSON.parse(evraw);
    self.emit(ev.type, ev.hash);
  });
  self.pubsub.subscribe(self.channel);
}

util.inherits(Subject, events.EventEmitter);

Subject.prototype.find = function(query, fn) {
  if (!fn && query instanceof Function) {
    fn = query;
    query = null;
  }
  if (query) {
    this.redis.hget(this.key, query, fn);
  } else {
    this.redis.hgetall(this.key, fn);
  }
}

Subject.prototype.delete = function(subject, fn) {
  var self = this;
  self.redis.hget(self.key, subject, function(err, res) {
    if (res) {
      self.redis.hdel(self.key, subject, function(err) {
        if (!err) {
          self.redis.publish(self.channel,
            JSON.stringify({type: 'unsubscribe', hash: res}));
        }
        fn(err);
      });
    } else {
      fn(err);
    }
  });
}

Subject.prototype.add = function(subject, fn) {
  var csdl = _.template(settings.csdlTemplate, {subject: subject}),
      self = this;

  step(
    function() {
      self.find(subject, this);
    },
    function(err, res) {
      if (res) {
        fn(null, {hash: res});
      } else {
        self.api.validate(csdl, this);
      }
    },
    function(res) {
      if (res) {
        if (res && res.status == 200) {
          self.api.compile(csdl, this);
        } else {
          console.error(res);
          fn(new Error(sprintf('failed to verify CSDL for %s', subject)));
        }
      }
    },
    function(res) {
      if (res) {
        if (res && res.status == 200) {
          self.redis.hset(self.key, subject, res.body.hash, function(err) {
            if (err) {
              console.error(err && err.stack);
              fn(new Error(sprintf('failed to save hash for %s', subject)));
            } else {
              self.redis.publish(self.channel,
                JSON.stringify({type: 'subscribe', hash: res.body.hash}));
              fn(null, res.body);
            }
          });
        } else {
          console.error(res);
          fn(new Error(sprintf('failed to compile CSDL for %s', subject)));
        }
      }
    }
  );
}

exports = module.exports = Subject;
