Template.topnav.onCreated(function() {
  this.searching = new ReactiveVar(false);
});

Template.topnav.helpers({
  'searching': function() {
    return Template.instance().searching.get();
  }
});

Template.topmenu.onCreated(function() {
  var self = this;
  var favicon = new Favico({
    animation:'slide'/*,
    elementId: 'favico'*/
  });
  self.autorun(function() {
    var count = 0;
    M.C.Notifications.find().forEach(function(nt) {
      count += nt.count;
    });
    favicon.badge(count);
  });
});

Template.topmenu.onRendered(function() {
  this.$('[data-activates^="notifications"]').dropdown({
    constrain_width: false,
    belowOrigin: true
  });
  this.$('[data-activates="user-menu"]').dropdown({
    constrain_width: false,
    belowOrigin: true
  });
  this.$('[data-activates="sidenav"]').sideNav({
    menuWidth: 240,
    edge: 'left',
    closeOnClick: window.matchMedia("only screen and (max-width : 992px)").matches
  });

});

Template.topmenu.helpers({
  kurumIsmi: function() {
    var kurum = Meteor.user() && Meteor.user().kurum;
    return kurum === 'mitolojix' ? 'Mitolojix' : M.C.Kurumlar.findOne({_id: kurum}) && M.C.Kurumlar.findOne({_id: kurum}).isim;
  },
  notifications: function() {
    var cursor = M.C.Notifications.find({},{sort: {at: -1}});
    return cursor.count() && cursor;
  },
  searchableRoute: function() {
    var route = FlowRouter.getRouteName();
    var searchableRoutes = [
      'kullaniciListe',
      'kurumListe',
      'mufredatListe',
      'muhurListe',
      'soruListe',
      'sinavListe',
      'soruSepeti',
      'soruFavori'
    ];
    return _.contains(searchableRoutes, route);
  }
});

Template.notification.onRendered(function() {
  $('[data-activates^="notifications"]').dropdown({
    constrain_width: false,
    belowOrigin: true
  });
});

Template.notification.events({
  'click [data-trigger="notification-sil"]': function(e,t) {
    M.C.Notifications.remove({_id: t.data._id});
  }
});

Template.topmenu.events({
  'click [data-trigger="notification-temizle"]': function(e,t) {
    M.C.Notifications.find({to: Meteor.userId()}, {fields: {_id: 1}}).forEach(function(notification) {
      M.C.Notifications.remove({_id: notification._id});
    });
  },
  'click [data-activates="searchbox"]': function(e,t) {
    e.preventDefault();
    t.parent().searching.set(true);
    Session.set('filters', {});
  },
  'click [data-logout]': function(e,t) {
    Meteor.logout();
  }
});

Template.searchbox.onRendered(function() {
  var template = this;
  var oldRoute = FlowRouter.getRouteName();
  template.$('input').focus();
  template.autorun(function() {
    var newRoute = FlowRouter.getRouteName();
    if (oldRoute !== newRoute && template.parent().searching.get() === true) {
      template.parent().searching.set(false);
      M.L.clearSessionVariable('keywords');
      M.L.clearSessionVariable('filters');
    }
  });
});

Template.searchbox.events({
  'click [data-activates="topmenu"]' : function(e,t) {
    e.preventDefault();
    t.parent().searching.set(false);
    M.L.clearSessionVariable('keywords');
    M.L.clearSessionVariable('filters');
  },
  'keyup input' : function(e,t) {
    e.preventDefault();
    if (e.which === 27) {
      t.parent().searching.set(false);
      M.L.clearSessionVariable('keywords');
      M.L.clearSessionVariable('filters');
    }
  },
  'submit form, click [data-trigger="submit"]': function(e,t) {
    e.preventDefault();
    var keywords = M.L.Trim(t.$('input').val());
    Session.set('keywords', keywords);
  }
});

Template.searchbox.onDestroyed(function() {
  M.L.clearSessionVariable('keywords');
  M.L.clearSessionVariable('filters');
});
