window.Subjects = Ember.Application.create({
  backend: {
    host: 'http://localhost:3000'
  },
  pusher: {
    key: 'e334917343aa751761c8'
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
