var crypto = require('crypto'),
    settings = require('./settings'),
    Pusher = require('pusher'),
    debug = require('debug')('subject-server:utils');

/**
 * A utility function to find all URLs - FTP, HTTP(S) and Email - in a text string
 * and return them in an array.  Note, the URLs returned are exactly as found in the text.
 *
 * @param text
 *            the text to be searched.
 * @return an array of URLs.
 */
function findUrls(text) {
    var source = (text || '').toString();
    var urlArray = [];
    var url;
    var matchArray;

    // Regular expression to find FTP, HTTP(S) and email URLs.
    var regexToken = /(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)|((mailto:)?[_.\w-]+@([\w][\w\-]+\.)+[a-zA-Z]{2,3})/g;

    // Iterate through any URLs in the text.
    while( (matchArray = regexToken.exec( source )) !== null )
    {
        var token = matchArray[0];
        urlArray.push( token );
    }

    return urlArray;
}

/**
 * hash urls for key storage
 */
function hashUrl(url) {
  var shasum = crypto.createHash('sha1');
  shasum.update(url);
  return shasum.digest('hex');
}

/**
 * get redis instance
 */
function redis(fn) {
  var redis = require('redis').createClient();
  redis.on('error', function(err) {
    console.error(err.stack);
  });
  redis.on('connect', function(err) {
    fn(err, redis);
  });
}

/**
 * Partial function package data with callbacks. args are appended to the end.
 * This also packages all arguments into an Array so that it will work with
 * step, which ignores all but the first two arguments (err, res) when used
 * in conjunction with parallel or group.
 *
 * ex::
 *   function fn0(err, args) {
 *     console.log(args);
 *   }
 *
 *   var fn1 = partial(1, 2, 3, fn0);
 *   fn1(null, 0);
 *   >> [0, 1, 2, 3]
 */
function partial() {
  var partialArgs = Array.prototype.slice.apply(arguments),
      fn = partialArgs.pop();

  return function() {
    var args = Array.prototype.slice.apply(arguments);

    Array.prototype.push.apply(args, partialArgs);
    fn(args[0], args.slice(1));
  }
}

exports = module.exports = {
  findUrls: findUrls,
  hashUrl: hashUrl,
  redis: redis,
  pusher: new Pusher({
    appId: settings.pusherAppId,
    key: settings.pusherKey,
    secret: settings.pusherSecret
  }),
  partial: partial
}
