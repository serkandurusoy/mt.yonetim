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
  resetForm : function (context,redirect){
    // TODO: ugly hack to reset form validation before leaving page
    if (Meteor.isClient) {
      var $form =$('form');
      if ($form.length > 0) {
        $form[0].reset();
      }
    }
  },
  resetSession: function(context,redirect) {
    if (Meteor.isClient) {
      M.L.clearSessionVariable('accountButtonsDisabled');
    }
  },
  resetSearchAndFilters: function(context,redirect) {
    if (Meteor.isClient) {
      M.L.clearSessionVariable('keywords');
      M.L.clearSessionVariable('filters');
    }
  }
};

FlowRouter.triggers.enter([routeTriggers.requireModernBrowser]);

FlowRouter.notFound = {
  action: function() {
    BlazeLayout.render('mainLayout', { main: 'notFound' })
  }
};

/* TODO: https://github.com/zimme/meteor-active-route/issues/39#issuecomment-129332201 but we should place this whole black as the last rout
 FlowRouter.route('/:notFound*', {
 name: 'notFound',
 action: FlowRouter.notFound.action
 });
 */

var setUpCrudRoute = function(group, prefix, name) {
  var route = this;
  route[group] = FlowRouter.group({
    prefix: prefix,
    name: group
  });

  route[group].route('/', {
    name: name + 'Liste',
    action: function(params) {
      BlazeLayout.render('mainLayout', { main: name + 'Liste', fab: 'fab', attrs: { fab: { icon: 'add', color: 'green', pathName: name + 'Yeni', paramName: null } } });
    },
    triggersExit: [routeTriggers.resetSearchAndFilters]
  });

  route[group].route('/yeni', {
    name: name + 'Yeni',
    action: function(params) {
      BlazeLayout.render('mainLayout', { main: name + 'Yeni' });
    },
    triggersExit: [routeTriggers.resetForm]
  });

  route[group].route('/:_id', {
    name: name + 'Detay',
    action: function(params) {
      BlazeLayout.render('mainLayout', { main: name + 'Detay', fab: 'fab', attrs: { fab: { icon: 'edit', color: 'red', pathName: name + 'Duzenle', paramName: '_id' } } });
    },
    triggersExit: [routeTriggers.resetForm]
  });

  route[group].route('/:_id/tarihce', {
    name: name + 'Tarihce',
    action: function(params) {
      BlazeLayout.render('mainLayout', { main: name + 'Tarihce' });
    }
  });

  route[group].route('/:_id/duzenle', {
    name: name + 'Duzenle',
    action: function(params) {
      BlazeLayout.render('mainLayout', { main: name + 'Duzenle' });
    },
    triggersExit: [routeTriggers.resetForm]
  });

};

FlowRouter.route('/', {
  name: 'giris',
  action: function(params) {
    BlazeLayout.render('mainLayout', { mainForGiris: 'giris' });
  }
});

bilgilerimRoutes = FlowRouter.group({
  prefix: '/bilgilerim',
  name: bilgilerimRoutes
});

bilgilerimRoutes.route('/', {
  name: 'bilgilerimDetay',
  action: function(params) {
    BlazeLayout.render('mainLayout', { main: 'bilgilerimDetay' });
  },
  triggersExit: [routeTriggers.resetSession]
});

bilgilerimRoutes.route('/tarihce', {
  name: 'bilgilerimTarihce',
  action: function(params) {
    BlazeLayout.render('mainLayout', { main: 'bilgilerimTarihce' });
  }
});

setUpCrudRoute('kullanicilarRoutes', '/kullanicilar', 'kullanici');

setUpCrudRoute('karakterlerRoutes', '/karakterler', 'karakter');

setUpCrudRoute('kurumlarRoutes', '/kurumlar', 'kurum');

setUpCrudRoute('muhurlerRoutes', '/muhurler', 'muhur');

setUpCrudRoute('derslerRoutes', '/dersler', 'ders');

FlowRouter.route('/aktif-egitim-yili', {
  name: 'aktifEgitimYili',
  action: function(params) {
    BlazeLayout.render('mainLayout', { main: 'aktifEgitimYili' });
  }
});

FlowRouter.route('/ogrenci-yukleme', {
  name: 'ogrenciYukleme',
  action: function(params) {
    BlazeLayout.render('mainLayout', { main: 'ogrenciYukleme' });
  }
});

setUpCrudRoute('mufredatlarRoutes', '/mufredat', 'mufredat');

setUpCrudRoute('sinavlarRoutes', '/sinavlar', 'sinav');

setUpCrudRoute('sorularRoutes', '/sorular', 'soru');

FlowRouter.route('/soru-sepetim', {
  name: 'soruSepeti',
  action: function(params) {
    BlazeLayout.render('mainLayout', { main: 'soruSepeti' });
  }
});

FlowRouter.route('/favori-sorularim', {
  name: 'soruFavori',
  action: function(params) {
    BlazeLayout.render('mainLayout', { main: 'soruFavori' });
  }
});
