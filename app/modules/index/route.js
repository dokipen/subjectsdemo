Charcoaltest.IndexRoute = Ember.Route.extend({
  activate: function() {
    var self = this;
    var pusher = self.get('pusher');
    if (!pusher) {
      pusher = new Pusher(Charcoaltest.get('pusher.key'));
      self.set('pusher', pusher);
    }

    var channel = pusher.subscribe(Charcoaltest.get('pusher.channel'));
    channel.bind(Charcoaltest.get('pusher.event'), function(data) {
      self.get('controller').pushObject(data);
    });
  },
  deactivate: function() {
    var pusher = this.get('pusher');
    pusher.unsubscribe(Charcoaltest.get('pusher.event'));
  },
  setupController: function (controller) {
    controller.set("content", Em.A());
  }
});

