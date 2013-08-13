Subjects.IndexController = Ember.ObjectController.extend({
  subject: null,
  startStream: function() {
    var stream = Subjects.Stream.create({
      subject: this.get('subject')
    });
    this.transitionToRoute('stream', stream);
  }
});
