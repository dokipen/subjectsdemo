window.Charcoaltest = Ember.Application.create({
  pusher: {
    key: 'e334917343aa751761c8',
    channel: 'twitter_channel',
    'event': 'tweet'
  }
});

// Default load order. Override as you see fit.
require("store");
require("modules/*/model");
require("modules/*/controller");
require("modules/*/view");
require("helpers/*");
require("router");
require("modules/*/route");
