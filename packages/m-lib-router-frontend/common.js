var routeTriggers = {
  requireModernBrowser : function (context,redirect) {
    //TODO: write modern browser logic with device and browser detection
    //TODO: also create an orientation helper for layout and show warning for non-landscape in-game
    if (Meteor.isClient) {
      var modernBrowser = true;
      if (!modernBrowser) {
        redirect('http://outdatedbrowser.com/en');
      }
    }
  },
  resetSession: function(context,redirect) {
    if (Meteor.isClient) {
      M.L.clearSessionVariable('accountButtonsDisabled');
    }
  }
};

FlowRouter.triggers.enter([routeTriggers.requireModernBrowser]);

FlowRouter.notFound = {
  action: function() {
    BlazeLayout.render('layout', { main: 'notFound' })
  }
};

FlowRouter.route('/', {
  name: 'anaEkran',
  action: function(params) {
    BlazeLayout.render('layout', { main: 'anaEkran' });
  }
});

FlowRouter.route('/oz-tasi', {
  name: 'ozTasi',
  action: function(params) {
    BlazeLayout.render('layout', { main: 'ozTasi' });
  }/*,
  triggersExit: [routeTriggers.resetSession] // TODO: implement "change password" flow
  */
});

FlowRouter.route('/yazitlar', {
  name: 'yazitlar',
  action: function(params) {
    BlazeLayout.render('layout', { main: 'yazitlar' });
  }
});

FlowRouter.route('/boy-tasi', {
  name: 'boyTasi',
  action: function(params) {
    BlazeLayout.render('layout', { main: 'boyTasi' });
  }
});

FlowRouter.route('/muhur-tasi', {
  name: 'muhurTasi',
  action: function(params) {
    BlazeLayout.render('layout', { main: 'muhurTasi' });
  }
});

FlowRouter.route('/muhur-bilgi/:_id', {
  name: 'muhurBilgi',
  action: function(params) {
    BlazeLayout.render('layout', { main: 'muhurBilgi' });
  }
});

