import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { Session } from 'meteor/session';
import { _ } from 'meteor/underscore';
import { $ } from 'meteor/jquery';

import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import { M } from 'meteor/m:lib-core';

import './detay.html';
import './detayKart.html';

let kilitleView;
let taslakDegistirView;

Template.soruDetay.onCreated(function() {
  this.autorun(() => {
    this.subscribe('soru', FlowRouter.getParam('_id'));
    this.subscribe('mufredatlar');
    this.subscribe('fssorugorsel');
  });

  this.observeHandle = M.C.Notifications.find().observe({
    'added'(doc) {
      const nt = M.C.Notifications.findOne({
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
  this.observeHandle.stop();
});

Template.soruDetay.helpers({
  soru() {
    return M.C.Sorular.findOne({_id: FlowRouter.getParam('_id')});
  },
  kilitlenebilir() {
    const soru = M.C.Sorular.findOne({_id: FlowRouter.getParam('_id')});
    return soru.taslak === false && soru.kilitli === false;
  },
  taslakDegisebilir() {
    const soru = M.C.Sorular.findOne({_id: FlowRouter.getParam('_id')});
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
  ogretmenCanEdit() {
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
  'click [data-trigger="soruKilitleModal"]'(e,t) {
    t.$('.fixed-action-btn').closeFAB();
    kilitleView = Blaze.render(Template.soruKilitleModal, document.getElementsByTagName('main')[0]);
    $('#soruKilitleModal').openModal({
      complete() {
        Blaze.remove(kilitleView);
      }
    });
  },
  'click [data-trigger="soruTaslakDegistirModal"]'(e,t) {
    t.$('.fixed-action-btn').closeFAB();
    taslakDegistirView = Blaze.render(Template.soruTaslakDegistirModal, document.getElementsByTagName('main')[0]);
    $('#soruTaslakDegistirModal').openModal({
      complete() {
        Blaze.remove(taslakDegistirView);
      }
    });
  }
});

Template.soruDetayKart.onRendered(function(){
  this.parent().$('.collapsible').collapsible();
});

Template.soruDetayKart.events({
  'click [data-trigger="clone"]'(e,t) {
    let doc = t.data;
    doc = _.extend(_.pick(doc, 'kurum', 'aciklama', 'alan', 'tip', 'zorlukDerecesi', 'soru', 'yanit'), {aktif: true, _clonedFrom: {_id: doc._id, _version: doc._version}});
    Session.set('soruClone',doc);
    FlowRouter.go('soruYeni');
  },
  'click [data-trigger="cart"]'(e,t) {
    const soru = t.data._id;
    const sepet = M.C.SoruSepetleri.findOne({createdBy: Meteor.userId(), soru});
    if (sepet) {
      M.C.SoruSepetleri.remove({_id: sepet._id});
    } else {
      M.C.SoruSepetleri.insert({soru});
    }
  },
  'click [data-trigger="favorite"]'(e,t) {
    const soru = t.data._id;
    const favori = M.C.SoruFavorileri.findOne({createdBy: Meteor.userId(), soru});
    if (favori) {
      M.C.SoruFavorileri.remove({_id: favori._id});
    } else {
      M.C.SoruFavorileri.insert({soru});
    }
  },
  'click [data-trigger="comment"]'(e,t) {
    $("html, body").animate({ scrollTop: $(document).height() }, 1000);
  },
  'click [data-trigger="onizleme"]'(e,t) {
    soruOnizlemeView = Blaze.renderWithData(Template.soruOnizlemeModal,{_id:t.data._id}, document.getElementsByTagName('main')[0]);
  }
});

Template.soruDetayKart.helpers({
  boslukSpan() {
    return splitOnNewlines(this.cevap.replace(/\[(.+?)\]/g, "<span class=\"boslukDoldur\">$1</span>"));
  },
  guncelHaliNotEditable() {
    const soru = M.C.Sorular.findOne({_id: FlowRouter.getParam('_id')});
    return soru && (soru.kilitli || soru.aktif === false);
  },
  inCart() {
    return M.C.SoruSepetleri.findOne({createdBy: Meteor.userId(), soru: FlowRouter.getParam('_id')});
  },
  inFavori() {
    return M.C.SoruFavorileri.findOne({createdBy: Meteor.userId(), soru: FlowRouter.getParam('_id')});
  },
  sinavBilgileri() {
    const soru = this._id;
    const sinavlarCursor = soru && M.C.Sinavlar.find({'sorular.soruId': soru});
    return sinavlarCursor.count() && sinavlarCursor;
  },
  commentCount() {
    return M.C.Comments.find({collection: 'Sorular', doc: FlowRouter.getParam('_id')}).count();
  }
});

Template.soruTaslakDegistirModal.helpers({
  taslak() {
    const soru = M.C.Sorular.findOne({_id: FlowRouter.getParam('_id')});
    return soru && soru.taslak;
  }
});

Template.soruTaslakDegistirModal.events({
  'click [data-trigger="taslakDegistir"]'(e,t) {
    const soru = M.C.Sorular.findOne({_id: FlowRouter.getParam('_id')})._id;
    Meteor.call('soruTaslakDegistir',soru);
    $('#soruTaslakDegistirModal').closeModal({
      complete() {
        Blaze.remove(taslakDegistirView);
      }
    });
  }
});

Template.soruKilitleModal.events({
  'click [data-trigger="kilitle"]'(e,t) {
    const soru = M.C.Sorular.findOne({_id: FlowRouter.getParam('_id')})._id;
    Meteor.call('soruKilitle',soru);
    $('#soruKilitleModal').closeModal({
      complete() {
        Blaze.remove(kilitleView);
      }
    });
  }
});
