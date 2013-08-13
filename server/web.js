#!/usr/bin/env node
var Endpoint = require('express-endpoint'),
    express = require('express'),
    forceJson = require('./forceJson'),
    Subject = require('./subject'),
    debug = require('debug')('subject-server:web'),
    worker = require('./worker'),
    collector = require('./collector');

worker.start();
collector.start();

var subject = new Endpoint({
  path: '/1/subject(/:subject)?',
  description: 'CRUD search subjects',
  parameters: [{
    name: 'subject',
    rules: ['max(1)'],
    description: 'First record'
  }],
  handler: function(req, res, next) {
    var subject = new Subject()
    if (req.method == 'POST') {
      subject.add(req.endpoint.params.subject[0].slice(1), function(err, upres) {
        if (err) return next(err);
        res.endpoint.render(upres);
      });
    } else if (req.method == 'DELETE') {
      subject['delete'](req.endpoint.params.subject[0].slice(1), function(err) {
        if (err) return next(err);
        res.endpoint.render({'status': 'OK'});
      });
    } else {
      if (req.endpoint.params.subject.length == 1) {
        subject.find(req.endpoint.params.subject[0].slice(1), function(err, upres) {
          res.endpoint.render(upres);
        });
      } else {
        subject.find(function(err, csdls) {
          res.endpoint.render(csdls);
        });
      }
    }
  }
});

var app = express();
app.use(express.logger());
app.use(express.static(__dirname + '/public'));
app.use(forceJson());
app.use(Endpoint.static());
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', '*');
  if (req.method == 'OPTIONS') {
    res.end();
  } else {
    next();
  }
});
subject.mount(app, ['get', 'post', 'delete']);
app.get('/', function(req, res) {
  res.render('index.jade');
});
app.use(Endpoint.errorHandler());
app.use(express.errorHandler());
app.listen(process.env.PORT || 3000, '0.0.0.0');
debug('listening on 0.0.0.0:' + (process.env.PORT || 3000));
