Template.soruDuzenle.onCreated(function() {
  template = this;
  template.autorun(function() {
    template.subscribe('soru', FlowRouter.getParam('_id'));
    template.subscribe('mufredatlar');
    template.subscribe('fssorugorsel');
  });
});

Template.soruDuzenle.helpers({
  soruKullanimda: function() {
    return M.C.Sinavlar.findOne({'sorular.soruId': FlowRouter.getParam('_id'), iptal: false});
  },
  soruMufredatVersionDegismis: function() {
    var soru = M.C.Sorular.findOne({_id: FlowRouter.getParam('_id')});
    var mufredat = soru && M.C.Mufredat.findOne({_id: soru.alan.mufredat});
    return soru && mufredat && soru.alan.mufredatVersion !== mufredat._version;
  },
  soruMufredatEgitimYiliDegismis: function() {
    var soru = M.C.Sorular.findOne({_id: FlowRouter.getParam('_id')});
    var mufredat = soru && M.C.Mufredat.findOne({_id: soru.alan.mufredat});
    return soru && mufredat && soru.alan.egitimYili !== mufredat.egitimYili;
  },
  soru: function() {
    return M.C.Sorular.findOne({_id: FlowRouter.getParam('_id'), aktif: true, kilitli: false});
  }
});

AutoForm.hooks({
  soruDuzenleForm: {
    onSuccess: function(operation, result, template) {
      if (result) {
        Session.set('yeniVeyaEditSoru', FlowRouter.getParam('_id'));
        FlowRouter.go('soruDetay', {_id: FlowRouter.getParam('_id')});
      }
    }
  }
});
