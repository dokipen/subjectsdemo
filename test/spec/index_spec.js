describe("Index", function() {
  beforeEach(function () {
    Ember.run(Charcoaltest, Charcoaltest.advanceReadiness);
  });
  afterEach(function (done) {
    Charcoaltest.reset();
    done();
  });

  it("contains the words 'Welcome to Ember.js on Charcoal'", function(done) {
    visit("/").then(function() {
      expect($("#ember h2").html()).to.be.equal("Welcome to Ember.js on Charcoal");
      done();

      // finishes loading fixtures so Ember Data doesn't throw an error after
      // App.reset() in teardown
      Ember.run.sync();
    });
  });
});
