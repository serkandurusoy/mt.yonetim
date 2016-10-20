Template.timeline.onCreated(function() {
  const template = this;
  template.storyLimit = new ReactiveVar(10);
  template.autorun(() => {
    template.subscribe('stories', parseInt(template.storyLimit.get()));
  });
});

Template.timeline.helpers({
  stories() {
    const cursor = M.C.Stories.find({}, {sort: {createdAt: -1}, limit: parseInt(Template.instance().storyLimit.get())});
    return cursor.count() && cursor;
  },
  hasMore() {
    const limit = Template.instance().storyLimit.get();
    const count = Counts.has('story') ? Counts.get('story') : 0;
    return limit < count;
  }
});

Template.timeline.events({
  'click [data-trigger="loadmore"]'(e,t) {
    const limit = t.storyLimit.get();
    t.storyLimit.set(parseInt(limit) + 10);
  }
});
