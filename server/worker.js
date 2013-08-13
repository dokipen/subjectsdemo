var step = require('step'),
    embedly = require('embedly'),
    utils = require('./utils'),
    findUrls = utils.findUrls,
    settings = require('./settings'),
    started = false,
    inspect = require('util').inspect,
    debug = require('debug')('subject-server'),
    pusher = utils.pusher,
    jpath = require('JSONPath').eval;

/**
 * Process the next event from the stream.
 *
 * We could speed up this process by just recursing as soon as we get an event
 * instead of when we finish processing the event.
 */
function procNext(redis, embedlyApi) {
  if (Array.isArray(embedlyApi)) {
    embedlyApi = embedlyApi[0];
  }
  if (procNext.stop) {
    started = false;
    debug('stopping');
    return;
  }

  step(
    // get next event from the queue
    function() {
      debug('fetching from ' + settings.inqueueKey);
      redis.brpoplpush(settings.inqueueKey, settings.outqueueKey,
                       1000000, this);
    },
    // fetch extract info
    function(err, data) {
      if (err) {
        console.error(err.stack);
        return setTimeout(utils.partial(redis, embedlyApi, procNext));
      }

      debug('got data')
      try {
        var ev = JSON.parse(data),
            urls = findUrls(jpath(ev, 'data.interaction.content'));

        embedlyApi.extract({urls: urls}, utils.partial(ev, this));
      } catch(e) {
        console.error(e.stack);
        return setTimeout(utils.partial(redis, embedlyApi, procNext));
      }
    },
    function(err, args) {
      if (err) {
        console.error(err.stack);
        return setTimeout(utils.partial(redis, embedlyApi, procNext));
      }

      var extracts = args[0],
          ev = args[1];

      var self = this,
          procCount = 0;

      if (extracts.length > 0) {
        extracts.forEach(function(extract) {
          try {
            if (extract.url && extract.type != 'error') {
              procCount += 1;
              debug('got extract');

              pusher.trigger(ev.hash, 'tweet', {
                'event': ev,
                'embedly': extract
              });
            }
          } catch(e) {
            console.error(e.stack);
          }
        });
      }
      if (procCount == 0) {
        debug('no extracts processed');
        return setTimeout(utils.partial(redis, embedlyApi, procNext));
      }
    },
    // next iteration
    function(err) {
      // don't overflow stack
      debug('next');
      return setTimeout(utils.partial(redis, embedlyApi, procNext));
    }
  );
}


function start() {
  if (started) { return }

  procNext.stop = false;
  step(
    function() {
      debug('connecting to redis');
      utils.redis(this);
    },
    function(err, redis) {
      debug('creating embedly api');
      new embedly({key: settings.embedlyKey}, utils.partial(redis, this));
    },
    function(err, args) {
      debug('starting worker');
      var embedlyApi = args[0],
          redis = args[1];

      // you can start multiple parallel workers here.
      procNext(redis, embedlyApi);
      started = true;
    }
  )
}

function stop() {
  procNext.stop = true;
}

exports = module.exports = {
  start: start,
  stop: stop,
  stat: function() {
    return started ? 'started' : 'stopped';
  }
}
