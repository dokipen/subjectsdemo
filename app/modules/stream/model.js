Subjects.Stream = Em.Object.extend({
  init: function() {
    this._super();
    this.set('events', Em.A());
  },
  subject: null,
  hash: null,
  activate: function() {
    var self = this;

    $.post('http://localhost:3000/1/subject/' + self.get('subject'), function(res) {
      self.set('hash', res.hash);

      var pusher = self.getWithDefault('pusher', new Pusher(Subjects.get('pusher.key')));
      self.set('pusher', pusher);

      var channel = pusher.subscribe(self.get('hash'));

      channel.bind('tweet', function(data) {
        self.get('events').pushObject(data);
      });
    });
  },
  deactivate: function() {
    var pusher = this.get('pusher');
    if (pusher) {
      pusher.unsubscribe(this.get('hash'));
    }
  }
});
