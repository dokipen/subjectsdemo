# Subjectdemo

A new Ember.js application created with [Charcoal](https://github.com/thomasboyt/charcoal).

For development information, see `charcoal/readme.md`.

This app is a demonstration of using DataSift, Embedly and Pusher to create a
live stream of URLs that people are tweeting about a particular subject.

## Warning

This is a demo app with no effort made for security. Bad things will happen if you make it public, like XSS attacks and abuse of your datasift, pusher and embedly keys.

## Quickstart

  * Install redis
  * Start redis on localhost:6379
  * npm install
  * bower install
  * Sign up for an Embedly account. (https://app.embed.ly/signup)
  * Sign up for a DataSift account. (http://datasift.com/platform/get-started)
  * Sign up for a Pusher account. (http://pusher.com/pricing)
  * `$ cd server`
  * `$ npm install`
  * `$ cp settings.js.example settings.js`
  * `$ edit settings.js # fill in your account details from previous steps`
  * `$ cd ..`
  * `$ DEBUG=* grunt server`
