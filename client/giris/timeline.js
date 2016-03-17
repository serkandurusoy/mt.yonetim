Template.timeline.onCreated(function() {
  var template = this;
  template.storyLimit = new ReactiveVar(10);
  template.autorun(function() {
    template.subscribe('stories', parseInt(template.storyLimit.get()));
  });
});

Template.timeline.helpers({
  stories: function() {
    var cursor = M.C.Stories.find({}, {sort: {createdAt: -1}, limit: parseInt(Template.instance().storyLimit.get())});
    return cursor.count() && cursor;
  },
  hasMore: function() {
    var limit = Template.instance().storyLimit.get();
    var count = Counts.has('story') ? Counts.get('story') : 0;
    return limit < count;
  }
});

Template.timeline.events({
  'click [data-trigger="loadmore"]': function(e,t) {
    var limit = t.storyLimit.get();
    t.storyLimit.set(parseInt(limit) + 10);
  }
});
