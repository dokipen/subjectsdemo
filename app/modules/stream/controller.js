Subjects.StreamController = Ember.ObjectController.extend({
  activate: function() {
    this.get('content').activate();
  },
  deactivate: function() {
    this.get('content').deactivate();
  }
});
