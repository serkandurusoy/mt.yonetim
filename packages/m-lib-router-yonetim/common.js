const routeTriggers = {
  requireModernBrowser(context,redirect) {
    //TODO: write modern browser logic with device and browser detection
    //TODO: also create an orientation helper for layout and show warning for non-landscape in-game
    if (Meteor.isClient) {
      const modernBrowser = true;
      if (!modernBrowser) {
        redirect('http://outdatedbrowser.com/en');
      }
    }
  },
  resetForm(context,redirect){
    // TODO: ugly hack to reset form validation before leaving page
    if (Meteor.isClient) {
      let $form =$('form');
      if ($form.length > 0) {
        $form[0].reset();
      }
    }
  },
  resetSession(context,redirect) {
    if (Meteor.isClient) {
      M.L.clearSessionVariable('accountButtonsDisabled');
    }
  },
  resetSearchAndFilters(context,redirect) {
    if (Meteor.isClient) {
      M.L.clearSessionVariable('keywords');
      M.L.clearSessionVariable('filters');
    }
  }
};

FlowRouter.triggers.enter([routeTriggers.requireModernBrowser]);

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('mainLayout', { main: 'notFound' })
  }
};

/* TODO: https://github.com/zimme/meteor-active-route/issues/39#issuecomment-129332201 but we should place this whole black as the last rout
 FlowRouter.route('/:notFound*', {
 name: 'notFound',
 action: FlowRouter.notFound.action
 });
 */

const setUpCrudRoute = (group, prefix, name) =>{
  let route = this;
  route[group] = FlowRouter.group({
    prefix: prefix,
    name: group
  });

  route[group].route('/', {
    name: name + 'Liste',
    action(params) {
      BlazeLayout.render('mainLayout', { main: name + 'Liste', fab: 'fab', attrs: { fab: { icon: 'add', color: 'green', pathName: name + 'Yeni', paramName: null } } });
    },
    triggersExit: [routeTriggers.resetSearchAndFilters]
  });

  route[group].route('/yeni', {
    name: name + 'Yeni',
    action(params) {
      BlazeLayout.render('mainLayout', { main: name + 'Yeni' });
    },
    triggersExit: [routeTriggers.resetForm]
  });

  route[group].route('/:_id', {
    name: name + 'Detay',
    action(params) {
      BlazeLayout.render('mainLayout', { main: name + 'Detay', fab: 'fab', attrs: { fab: { icon: 'edit', color: 'red', pathName: name + 'Duzenle', paramName: '_id' } } });
    },
    triggersExit: [routeTriggers.resetForm]
  });

  route[group].route('/:_id/tarihce', {
    name: name + 'Tarihce',
    action(params) {
      BlazeLayout.render('mainLayout', { main: name + 'Tarihce' });
    }
  });

  route[group].route('/:_id/duzenle', {
    name: name + 'Duzenle',
    action(params) {
      BlazeLayout.render('mainLayout', { main: name + 'Duzenle' });
    },
    triggersExit: [routeTriggers.resetForm]
  });

};

FlowRouter.route('/', {
  name: 'giris',
  action(params) {
    BlazeLayout.render('mainLayout', { mainForGiris: 'giris' });
  }
});

bilgilerimRoutes = FlowRouter.group({
  prefix: '/bilgilerim',
  name: bilgilerimRoutes
});

bilgilerimRoutes.route('/', {
  name: 'bilgilerimDetay',
  action(params) {
    BlazeLayout.render('mainLayout', { main: 'bilgilerimDetay' });
  },
  triggersExit: [routeTriggers.resetSession]
});

bilgilerimRoutes.route('/tarihce', {
  name: 'bilgilerimTarihce',
  action(params) {
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
  action(params) {
    BlazeLayout.render('mainLayout', { main: 'aktifEgitimYili' });
  }
});

FlowRouter.route('/ogrenci-yukleme', {
  name: 'ogrenciYukleme',
  action(params) {
    BlazeLayout.render('mainLayout', { main: 'ogrenciYukleme' });
  }
});

setUpCrudRoute('mufredatlarRoutes', '/mufredat', 'mufredat');

setUpCrudRoute('sinavlarRoutes', '/testler', 'sinav');

setUpCrudRoute('sorularRoutes', '/sorular', 'soru');

FlowRouter.route('/soru-sepetim', {
  name: 'soruSepeti',
  action(params) {
    BlazeLayout.render('mainLayout', { main: 'soruSepeti' });
  },
  triggersExit: [routeTriggers.resetSearchAndFilters]
});

FlowRouter.route('/favori-sorularim', {
  name: 'soruFavori',
  action(params) {
    BlazeLayout.render('mainLayout', { main: 'soruFavori' });
  },
  triggersExit: [routeTriggers.resetSearchAndFilters]
});

setUpCrudRoute('yardimDokumanlariRoutes', '/yardim', 'yardimDokumani');
