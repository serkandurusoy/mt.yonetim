import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { Session } from 'meteor/session';
import { _ } from 'meteor/underscore';

import { ReactiveArray } from 'meteor/manuel:reactivearray';

import { M } from 'meteor/m:lib-core';

import './_soruCubugu.html';

Template.sorucubugu.onCreated(function() {
  this.isaretliSorular = new ReactiveArray([]);
});

Template.sorucubugu.events({
  'click .sol'(e,t) {
    t.$('.soruCubugu').animate({
      scrollLeft: '-=64'
    }, 0);
  },
  'click .sag'(e,t) {
    t.$('.soruCubugu').animate({
      scrollLeft: '+=64'
    }, 0);
  },
  'dblclick [data-soruIndex]'(e,t) {
    const ix = e.currentTarget.getAttribute('data-soruIndex');
    const isaretliSorular = t.isaretliSorular.array();
    if (_.contains(isaretliSorular, ix)) {
      t.isaretliSorular.remove(ix);
    } else {
      t.isaretliSorular.push(ix);
    }
    t.$(e.currentTarget).toggleClass('isaretli');
  },
  'click [data-soruIndex]'(e,t) {
    const ix = e.currentTarget.getAttribute('data-soruIndex');
    t.parent().renderComponent.set(false);
    Tracker.flush();
    t.parent().seciliSoruIndex.set(ix);
    if (!!t.parent().ogrenciYanitiGoster) {
      t.parent().ogrenciYanitiGoster.set(false);
    }
    t.parent().renderComponent.set(true);
  }
});

Template.registerHelper('cevapVerildi', function(sinavKagidiId, ix, cevapAnahtari) {
  const sinavKagidi = M.C.SinavKagitlari.findOne({
    _id: sinavKagidiId
  });
  return !cevapAnahtari && sinavKagidi && sinavKagidi.yanitlar[ix].yanitlandi;
});

Template.registerHelper('cevapDogruYanlis', function(sinavKagidiId, ix, cevapAnahtari) {
  const sinavKagidi = M.C.SinavKagitlari.findOne({
    _id: sinavKagidiId
  });
  if (cevapAnahtari === true) {
    if (!sinavKagidi) {
      return undefined;
    } else {
      const sinav = M.C.Sinavlar.findOne({_id: sinavKagidi.sinav});
      const yanit = _.findWhere(sinavKagidi.yanitlar, {soruId: sinav.sorular[ix].soruId});
      if (yanit.yanitlandi > 0) {
        if (yanit.dogru === true) {
          return ' cevapDogru';
        } else if (yanit.dogru === false) {
          return ' cevapYanlis';
        }
      } else {
        return ' cevapBos';
      }
    }
  } else {
    if (sinavKagidi && sinavKagidi.tip === 'alistirma') {
      if (sinavKagidi.yanitlar[ix].yanitlandi > 0 ) {
        if (sinavKagidi.yanitlar[ix].dogru === true) {
          return ' cevapDogru';
        } else if (sinavKagidi.yanitlar[ix].dogru === false) {
          return ' cevapYanlis';
        }
      } else {
        return ' cevapBos';
      }
    }
  }
  return undefined;
});

M.L.komponentSec = (seciliSoru,ogrenciYanitGoster) => {
  let template = null,
      data = null;

  if (seciliSoru) {
    if (ogrenciYanitGoster) {

      const sinavKagidi = M.C.SinavKagitlari.findOne({
        sinav: Session.get('sinavYanitGoster'),
        ogrenci: Meteor.userId(),
        ogrenciSinavaGirdi: true,
        egitimYili: M.C.AktifEgitimYili.findOne().egitimYili
      });

      const ogrenciYaniti = _.findWhere(sinavKagidi.yanitlar, {soruId: seciliSoru._id}).yanit;
      const ogrenciYanitiIndex = sinavKagidi.yanitlar.findIndex(yanit => {
        return yanit.soruId === seciliSoru._id;
      });

      switch (seciliSoru.tip) {
        case 'dogruYanlis':
          template = 'sorudogruYanlis';
          data = {
            dogruchecked: ogrenciYaniti.cevap === true,
            yanlischecked: ogrenciYaniti.cevap === false,
            disabled: true
          };
          break;
        case 'coktanTekSecmeli':
          template = 'sorucoktanTekSecmeli';
          data = {
            sinav: true,
            sinavKagidiId: sinavKagidi._id,
            seciliSoruIndex: ogrenciYanitiIndex,
            disabled: true
          };
          break;
        case 'coktanCokSecmeli':
          template = 'sorucoktanCokSecmeli';
          data = {
            sinav: true,
            sinavKagidiId: sinavKagidi._id,
            seciliSoruIndex: ogrenciYanitiIndex,
            disabled: true
          };
          break;
        case 'siralama':
          template = 'sorusiralama';
          data = {
            secenekler: ogrenciYaniti.secenekler
          };
          break;
        case 'eslestirme':
          template = 'sorueslestirme';
          data = {
            sinav: true,
            cevapAnahtari: true,
            sinavKagidiId: sinavKagidi._id,
            seciliSoruIndex: ogrenciYanitiIndex
          };
          break;
        case 'boslukDoldurma':
          template = 'soruboslukDoldurma';
          data = {
            cevap: seciliSoru.yanit.boslukDoldurma.cevap.replace(/\[[^\]]*?\]/g, '||||').split('||||').map((m,x) => (m)+(ogrenciYaniti.cevaplar[x]?('['+ogrenciYaniti.cevaplar[x]+']'):'')).join('')
          };
          break;
        default:
          template = null;
          data = null;
          break;
      }

    } else {

      switch (seciliSoru.tip) {
        case 'dogruYanlis':
          template = 'sorudogruYanlis';
          data = {
            dogruchecked: seciliSoru.yanit.dogruYanlis.cevap === true,
            yanlischecked: seciliSoru.yanit.dogruYanlis.cevap === false,
            disabled: true
          };
          break;
        case 'coktanTekSecmeli':
          template = 'sorucoktanTekSecmeli';
          data = {
            secenekler: seciliSoru.yanit.coktanTekSecmeli,
            disabled: true
          };
          break;
        case 'coktanCokSecmeli':
          template = 'sorucoktanCokSecmeli';
          data = {
            secenekler: seciliSoru.yanit.coktanCokSecmeli,
            disabled: true
          };
          break;
        case 'siralama':
          template = 'sorusiralama';
          data = {
            secenekler: seciliSoru.yanit.siralama
          };
          break;
        case 'eslestirme':
          template = 'sorueslestirme';
          data = {
            solsecenekler: seciliSoru.yanit.eslestirme,
            sagsecenekler: seciliSoru.yanit.eslestirme
          };
          break;
        case 'boslukDoldurma':
          template = 'soruboslukDoldurma';
          data = {
            cevap: seciliSoru.yanit.boslukDoldurma.cevap
          };
          break;
        default:
          template = null;
          data = null;
          break;
      }

    }
  }

  return {
    template: template,
    data: data
  }

};
