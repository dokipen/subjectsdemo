Subjects.StreamRoute = Ember.Route.extend({
  serialize: function(obj) {
    return {subject: obj.get('subject')};
  },

  model: function(params) {
    return Subjects.Stream.create({
      subject: params.subject
    });
  }
});

