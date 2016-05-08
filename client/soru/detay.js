var kilitleView;
var taslakDegistirView;

Template.soruDetay.onCreated(function() {
  var template = this;
  template.autorun(function() {
    template.subscribe('soru', FlowRouter.getParam('_id'), function() {
      Tracker.afterFlush(function() {
        var yeniVeyaEditSoru = Session.get('yeniVeyaEditSoru');
        if (yeniVeyaEditSoru && yeniVeyaEditSoru === FlowRouter.getParam('_id')) {
          var soru = M.C.Sorular.findOne({_id: yeniVeyaEditSoru});
          if (soru) {
            toastr.success('Sorunun güncel önizlemesini bu ekrandan yapabilirsiniz.');
          }
          M.L.clearSessionVariable('yeniVeyaEditSoru');
        }
      });
    });
    template.subscribe('mufredatlar');
    template.subscribe('fssorugorsel');
  });

  template.observeHandle = M.C.Notifications.find().observe({
    'added': function(doc) {
      var nt = M.C.Notifications.findOne({
        collection: 'Sorular',
        doc: FlowRouter.getParam('_id'),
        to: Meteor.userId()
      });
      if (nt) {
        M.C.Notifications.remove({_id: nt._id});
      }
    }
  });

});

Template.soruDetay.onDestroyed(function() {
  var template = this;
  template.observeHandle.stop();
});

Template.soruDetay.helpers({
  soru: function() {
    return M.C.Sorular.findOne({_id: FlowRouter.getParam('_id')});
  },
  kilitlenebilir: function() {
    var soru = M.C.Sorular.findOne({_id: FlowRouter.getParam('_id')});
    return soru.taslak === false && soru.kilitli === false;
  },
  taslakDegisebilir: function() {
    var soru = M.C.Sorular.findOne({_id: FlowRouter.getParam('_id')});
    if (soru.kilitli === false) {
      if (soru.taslak === true) {
        return true;
      } else {
        return !M.C.Sinavlar.findOne({'sorular.soruId': soru._id});
      }
    } else {
      return false;
    }
  },
  ogretmenCanEdit: function() {
    if (Meteor.user()) {
      if (Meteor.user().role !== 'ogretmen') {
        return true;
      } else {
        return _.contains(Meteor.user().dersleri, M.C.Sorular.findOne({_id: FlowRouter.getParam('_id')}).alan.ders);
      }
    } else {
      return false;
    }
  }
});

Template.soruDetay.events({
  'click [data-trigger="soruKilitleModal"]': function(e,t) {
    t.$('.fixed-action-btn').closeFAB();
    kilitleView = Blaze.render(Template.soruKilitleModal, document.getElementsByTagName('main')[0]);
    $('#soruKilitleModal').openModal({
      complete: function() {
        Blaze.remove(kilitleView);
      }
    });
  },
  'click [data-trigger="soruTaslakDegistirModal"]': function(e,t) {
    t.$('.fixed-action-btn').closeFAB();
    taslakDegistirView = Blaze.render(Template.soruTaslakDegistirModal, document.getElementsByTagName('main')[0]);
    $('#soruTaslakDegistirModal').openModal({
      complete: function() {
        Blaze.remove(taslakDegistirView);
      }
    });
  }
});

Template.soruDetayKart.onRendered(function(){
  this.parent().$('.collapsible').collapsible();
});

Template.soruDetayKart.events({
  'click [data-trigger="clone"]': function(e,t) {
    var doc = t.data;
    doc = _.extend(_.pick(doc, 'kurum', 'aciklama', 'alan', 'tip', 'zorlukDerecesi', 'soru', 'yanit'), {aktif: true, _clonedFrom: {_id: doc._id, _version: doc._version}});
    Session.set('soruClone',doc);
    FlowRouter.go('soruYeni');
  },
  'click [data-trigger="cart"]': function(e,t) {
    var soru = t.data._id;
    var sepet = M.C.SoruSepetleri.findOne({createdBy: Meteor.userId(), soru: soru});
    if (sepet) {
      M.C.SoruSepetleri.remove({_id: sepet._id});
    } else {
      M.C.SoruSepetleri.insert({soru: soru});
    }
  },
  'click [data-trigger="favorite"]': function(e,t) {
    var soru = t.data._id;
    var favori = M.C.SoruFavorileri.findOne({createdBy: Meteor.userId(), soru: soru});
    if (favori) {
      M.C.SoruFavorileri.remove({_id: favori._id});
    } else {
      M.C.SoruFavorileri.insert({soru: soru});
    }
  },
  'click [data-trigger="comment"]': function(e,t) {
    $("html, body").animate({ scrollTop: $(document).height() }, 1000);
  },
  'click [data-trigger="onizleme"]': function(e,t) {
    soruOnizlemeView = Blaze.render(Template.soruOnizlemeModal, document.getElementsByTagName('main')[0]);
  }
});

Template.soruDetayKart.helpers({
  boslukSpan: function() {
    return splitOnNewlines(this.cevap.replace(/\[(.+?)\]/g, "<span class=\"boslukDoldur\">$1</span>"));
  },
  guncelHaliNotEditable: function() {
    var soru = M.C.Sorular.findOne({_id: FlowRouter.getParam('_id')});
    return soru && (soru.kilitli || soru.aktif === false);
  },
  inCart: function() {
    return M.C.SoruSepetleri.findOne({createdBy: Meteor.userId(), soru: FlowRouter.getParam('_id')});
  },
  inFavori: function() {
    return M.C.SoruFavorileri.findOne({createdBy: Meteor.userId(), soru: FlowRouter.getParam('_id')});
  },
  sinavBilgileri: function() {
    var soru = this._id;
    var sinavlarCursor = soru && M.C.Sinavlar.find({'sorular.soruId': soru});
    return sinavlarCursor.count() && sinavlarCursor;
  },
  commentCount: function() {
    return M.C.Comments.find({collection: 'Sorular', doc: FlowRouter.getParam('_id')}).count();
  }
});

Template.soruTaslakDegistirModal.helpers({
  taslak: function() {
    var soru = M.C.Sorular.findOne({_id: FlowRouter.getParam('_id')});
    return soru && soru.taslak;
  }
});

Template.soruTaslakDegistirModal.events({
  'click [data-trigger="taslakDegistir"]': function(e,t) {
    var soru = M.C.Sorular.findOne({_id: FlowRouter.getParam('_id')})._id;
    Meteor.call('soruTaslakDegistir',soru);
    $('#soruTaslakDegistirModal').closeModal({
      complete: function() {
        Blaze.remove(taslakDegistirView);
      }
    });
  }
});

Template.soruKilitleModal.events({
  'click [data-trigger="kilitle"]': function(e,t) {
    var soru = M.C.Sorular.findOne({_id: FlowRouter.getParam('_id')})._id;
    Meteor.call('soruKilitle',soru);
    $('#soruKilitleModal').closeModal({
      complete: function() {
        Blaze.remove(kilitleView);
      }
    });
  }
});
