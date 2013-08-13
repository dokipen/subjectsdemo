Subjects.StreamView = Ember.View.extend({
  willInsertElement: function() {
    this.get('controller').activate();
  },
  willDestroyElement: function() {
    this.get('controller').deactivate();
  }
});
