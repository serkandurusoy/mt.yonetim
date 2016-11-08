let iptalView;
let kilitleView;
let taslakDegistirView;
let soruCikarModalView;
let sorularinTumunuCikarModalView;
let sinavBitirModalView;
let sinavOgrencilerView;

Template.sinavDetay.onCreated(function() {
  this.autorun(() => {
    this.subscribe('sinav', FlowRouter.getParam('_id'), () => {
      Tracker.afterFlush(() => {
        const yeniSinav = Session.get('yeniSinav');
        if (yeniSinav && yeniSinav === FlowRouter.getParam('_id')) {
          const sinav = M.C.Sinavlar.findOne({_id: yeniSinav});
          if (sinav) {
            toastr.success('Teste soru ekleyebilirsiniz.');
          }
          M.L.clearSessionVariable('yeniSinav');
        }
      });
    });
    this.subscribe('mufredatlar');
  });

  this.observeHandle = M.C.Notifications.find().observe({
    'added'(doc) {
      const nt = M.C.Notifications.findOne({
        collection: 'Sinavlar',
        doc: FlowRouter.getParam('_id'),
        to: Meteor.userId()
      });
      if (nt) {
        M.C.Notifications.remove({_id: nt._id});
      }
    }
  });

});

Template.sinavDetay.onDestroyed(function() {
  this.observeHandle.stop();
});

Template.sinavDetay.helpers({
  sinav() {
    return M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')});
  },
  sinavStatusGuncellenebilir() {
    const sinav = M.C.Sinavlar.findOne({
      _id: FlowRouter.getParam('_id'),
      muhur: {$exists: true},
      iptal: false,
      taslak: false,
      kilitli: true,
      tip: 'canli'
    });
    return sinav && sinav.canliStatus && sinav.canliStatus !== 'completed' && moment().isAfter(sinav.acilisZamani) && moment().isBefore(sinav.kapanisZamani);
  },
  sinavIptalEdilebilir() {
    const sinav = M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')});
    return moment().isBefore(sinav.kapanisZamani) || sinav.taslak === true;
  },
  kilitlenebilir() {
    const sinav = M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')});
    return sinav.iptal === false && sinav.taslak === false && sinav.kilitli === false && sinav.sorular && sinav.sorular.length > 0;
  },
  taslakDegisebilir() {
    const sinav = M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')});
    if (sinav.iptal === false && sinav.kilitli === false) {
      if (sinav.taslak === false) {
        return true;
      } else {
        return sinav.sorular && sinav.sorular.length > 0;
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
        return _.contains(Meteor.user().dersleri,M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')}).ders);
      }
    } else {
      return false;
    }
  }
});

Template.sinavDetay.events({
  'click [data-trigger="sinavIptalModal"]'(e,t) {
    t.$('.fixed-action-btn').closeFAB();
    iptalView = Blaze.render(Template.sinavIptalModal, document.getElementsByTagName('main')[0]);
    $('#sinavIptalModal').openModal({
      complete() {
        Blaze.remove(iptalView);
      }
    });
  },
  'click [data-trigger="sinavKilitleModal"]'(e,t) {
    t.$('.fixed-action-btn').closeFAB();
    kilitleView = Blaze.render(Template.sinavKilitleModal, document.getElementsByTagName('main')[0]);
    $('#sinavKilitleModal').openModal({
      complete() {
        Blaze.remove(kilitleView);
      }
    });
  },
  'click [data-trigger="sinavTaslakDegistirModal"]'(e,t) {
    t.$('.fixed-action-btn').closeFAB();
    taslakDegistirView = Blaze.render(Template.sinavTaslakDegistirModal, document.getElementsByTagName('main')[0]);
    $('#sinavTaslakDegistirModal').openModal({
      complete() {
        Blaze.remove(taslakDegistirView);
      }
    });
  },
  'click [data-trigger="soruEkleModal"]'(e,t) {
    t.$('.fixed-action-btn').closeFAB();
    const view = Blaze.render(Template.soruEkleModal, document.getElementsByTagName('main')[0]);
    $('#soruEkleModal').openModal({
      complete() {
        Blaze.remove(view);
      }
    });
  },
  'click [data-trigger="sinavBitirModal"]'(e,t) {
    t.$('.fixed-action-btn').closeFAB();
    sinavBitirModalView = Blaze.render(Template.sinavBitirModal, document.getElementsByTagName('main')[0]);
    $('#sinavBitirModal').openModal({
      complete() {
        Blaze.remove(sinavBitirModalView);
      }
    });
  },
  'click [data-trigger="baslat"]'(e,t) {
    const sinav = M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')})._id;
    t.$('.fixed-action-btn').closeFAB();
    Meteor.call('setSinavCanliStatus',sinav,'running');
  },
  'click [data-trigger="durdur"]'(e,t) {
    const sinav = M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')})._id;
    t.$('.fixed-action-btn').closeFAB();
    Meteor.call('setSinavCanliStatus',sinav,'paused');
  }
});

Template.sinavDetayKart.onRendered(function(){
  this.parent().$('.collapsible').collapsible();

  this.$('[data-activates="report-menu"]').dropdown({
    constrain_width: false,
    belowOrigin: true
  });

});

Template.sinavDetayKart.helpers({
  soru(soruId) {
    return M.C.Sorular.findOne({_id: soruId});
  },
  guncelHaliNotEditable() {
    const sinav = M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')});
    return sinav && (sinav.iptal || sinav.kilitli || sinav.muhur || sinav.aktif === false);
  },
  commentCount() {
    return M.C.Comments.find({collection: 'Sinavlar', doc: FlowRouter.getParam('_id')}).count();
  }
});


Template.sinavDetayKart.events({
  'click [data-trigger="clone"]'(e,t) {
    let doc = t.data;
    doc = _.extend(_.pick(doc, 'kurum', 'aciklama', 'ders', 'sinif', 'subeler', 'sorularKarissin', 'sorular'), {aktif: true, iptal: false, _clonedFrom: {_id: doc._id, _version: doc._version}});
    Session.set('sinavClone',doc);
    FlowRouter.go('sinavYeni');
  },
  'click [data-trigger="yukari"], click [data-trigger="asagi"]'(e,t) {
    const sinavId = t.data._id;
    const soruId = this._id;
    const yon = e.currentTarget.getAttribute('data-trigger');
    Meteor.call('soruSiraDegistir',sinavId,soruId,yon);
  },
  'click [data-trigger="cikar"]'(e,t) {
    const sinav = t.data._id;
    const soru = this._id;
    Session.set('soruCikar', {sinav: sinav, soru: soru});
    soruCikarModalView = Blaze.render(Template.soruCikarModal, document.getElementsByTagName('main')[0]);
    $('#soruCikarModal').openModal({
      complete() {
        Blaze.remove(soruCikarModalView);
      }
    });
  },
  'click [data-trigger="tumunuCikar"]'(e,t) {
    sorularinTumunuCikarModalView = Blaze.render(Template.sorularinTumunuCikarModal, document.getElementsByTagName('main')[0]);
    $('#sorularinTumunuCikarModal').openModal({
      complete() {
        Blaze.remove(sorularinTumunuCikarModalView);
      }
    });
  },
  'click [data-trigger="comment"]'(e,t) {
    $("html, body").animate({ scrollTop: $(document).height() }, 1000);
  },
  'click [data-trigger="onizleme"]'(e,t) {
    sinavOnizlemeView = Blaze.render(Template.sinavOnizlemeModal, document.getElementsByTagName('main')[0]);
  },
  'click [data-trigger="ogrenciler"]'(e,t) {
    sinavOgrencilerView = Blaze.render(Template.sinavOgrencilerModal, document.getElementsByTagName('main')[0]);
    $('#sinavOgrencilerModal').openModal({
      complete() {
        Blaze.remove(sinavOgrencilerView);
      }
    });
  },
  'click [data-analizRaporu]'(e,t) {
    e.preventDefault();
    toastr.success('Rapor hazırlanıyor. Lüften bekleyin.', null, {onHidden() {
      Meteor.call('analizRaporu', t.data._id, (err,res) => {
        if (err) {
          if (err.reason === 'Sınav kağıdı bulunamadı') {
            toastr.error('Bu teste giren hiç öğrenci olmadığından rapor üretilemedi.');
          } else {
            toastr.error('Bilinmeyen bir hata oluştu, daha sonra tekrar deneyin.');
          }
        }
        if (res) {
          const content = M.L.analizRaporuContent(res);
          M.L.PrintReport(res, content, 'portrait', t.data.kod + '-test-analiz-raporu.pdf', t.data.kod + ' Test Analiz Raporu');
        }
      })
    }});
  },
  'click [data-testMaddeAnalizi]'(e,t) {
    e.preventDefault();
    toastr.success('Rapor hazırlanıyor. Lüften bekleyin.', null, {onHidden() {
      Meteor.call('testMaddeAnalizi', t.data._id, (err,res) => {
        if (err) {
          if (err.reason === 'Sınav kağıdı bulunamadı') {
            toastr.error('Bu teste giren hiç öğrenci olmadığından rapor üretilemedi.');
          } else {
            toastr.error(M.E.BilinmeyenHataMessage);
          }
        }
        if (res) {
          const content = M.L.testMaddeAnaliziContent(res);
          M.L.PrintReport(res, content, 'landscape', t.data.kod + '-test-madde-analizi.pdf', t.data.kod + ' Test Madde Analizi');
        }
      })
    }});
  },
  'click [data-testCeldiriciAnalizi]'(e,t) {
    e.preventDefault();
    toastr.success('Rapor hazırlanıyor. Lüften bekleyin.', null, {onHidden() {
      Meteor.call('testCeldiriciAnalizi', t.data._id, (err,res) => {
        if (err) {
          if (err.reason === 'Sınav kağıdı bulunamadı') {
            toastr.error('Bu teste giren hiç öğrenci olmadığından rapor üretilemedi.');
          } else {
            toastr.error(M.E.BilinmeyenHataMessage);
          }
        }
        if (res) {
          const content = M.L.testCeldiriciAnaliziContent(res);
          M.L.PrintReport(res, content, 'portrait', t.data.kod + '-test-celdirici-analizi.pdf', t.data.kod + ' Test Çeldirici Analizi');
        }
      })
    }});
  },
  'click [data-subeBazindaPuanlar]'(e,t) {
    e.preventDefault();
    toastr.success('Rapor hazırlanıyor. Lüften bekleyin.', null, {onHidden() {
      Meteor.call('subeBazindaPuanlar', t.data._id, (err,res) => {
        if (err) {
          if (err.reason === 'Sınav kağıdı bulunamadı') {
            toastr.error('Bu teste giren hiç öğrenci olmadığından rapor üretilemedi.');
          } else {
            toastr.error(M.E.BilinmeyenHataMessage);
          }
        }
        if (res) {
          const content = M.L.subeBazindaPuanlarContent(res);
          M.L.PrintReport(res, content, 'portrait', t.data.kod + '-sube-bazinda-puanlar.pdf', t.data.kod + ' Şube Bazında Puanlar');
        }
      })
    }});
  },
  'click [data-sinifBazindaPuanlar]'(e,t) {
    e.preventDefault();
    toastr.success('Rapor hazırlanıyor. Lüften bekleyin.', null, {onHidden() {
      Meteor.call('sinifBazindaPuanlar', t.data._id, (err,res) => {
        if (err) {
          if (err.reason === 'Sınav kağıdı bulunamadı') {
            toastr.error('Bu teste giren hiç öğrenci olmadığından rapor üretilemedi.');
          } else {
            toastr.error(M.E.BilinmeyenHataMessage);
          }
        }
        if (res) {
          const content = M.L.sinifBazindaPuanlarContent(res);
          M.L.PrintReport(res, content, 'portrait', t.data.kod + '-sinif-bazinda-puanlar.pdf', t.data.kod + ' Sınıf Bazında Puanlar');
        }
      })
    }});
  }
});

Template.sinavBitirModal.events({
  'click [data-trigger="bitir"]'(e,t) {
    const sinav = M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')})._id;
    Meteor.call('setSinavCanliStatus',sinav,'completed');
    $('#sinavBitirModal').closeModal({
      complete() {
        Blaze.remove(sinavBitirModalView);
      }
    });
  }
});

Template.sinavTaslakDegistirModal.helpers({
  taslak() {
    const sinav = M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')});
    return sinav && sinav.taslak;
  },
  acilisZamaniGecmis() {
    const sinav = M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')});
    return sinav && moment(sinav.acilisZamani).isBefore(moment());
  }
});

Template.sinavTaslakDegistirModal.events({
  'click [data-trigger="taslakDegistir"]'(e,t) {
    const sinav = M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')})._id;
    Meteor.call('sinavTaslakDegistir',sinav);
    $('#sinavTaslakDegistirModal').closeModal({
      complete() {
        Blaze.remove(taslakDegistirView);
      }
    });
  }
});

Template.sinavKilitleModal.events({
  'click [data-trigger="kilitle"]'(e,t) {
    const sinav = M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')})._id;
    Meteor.call('sinavKilitle',sinav);
    $('#sinavKilitleModal').closeModal({
      complete() {
        Blaze.remove(kilitleView);
      }
    });
  }
});

Template.sinavIptalModal.events({
  'click [data-trigger="iptal"]'(e,t) {
    const sinav = M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')})._id;
    Meteor.call('sinavIptal',sinav);
    $('#sinavIptalModal').closeModal({
      complete() {
        Blaze.remove(iptalView);
      }
    });
  }
});


Template.soruCikarModal.events({
  'click [data-trigger="cikar"]'(e,t) {
    const soruCikar = Session.get('soruCikar');
    Meteor.call('sinavaSoruEkleCikar',soruCikar.sinav,soruCikar.soru,'cikar', (err, res) => {
      M.L.clearSessionVariable('soruCikar');
      $('#soruCikarModal').closeModal({
        complete() {
          Blaze.remove(soruCikarModalView);
          if (err) {
            toastr.error(M.E.BilinmeyenHataMessage);
          } else if (res) {
            toastr.success('Soru testten çıkarıldı.');
          }
        }
      });
    });
  }
});

Template.sorularinTumunuCikarModal.events({
  'click [data-trigger="cikar"]'(e,t) {
    Meteor.call('sinavdakiSorulariBosalt', FlowRouter.getParam('_id'), (err,res) => {
      $('#sorularinTumunuCikarModal').closeModal({
        complete() {
          Blaze.remove(sorularinTumunuCikarModalView);
          if (err) {
            toastr.error(M.E.BilinmeyenHataMessage);
          } else if (res) {
            toastr.success('Testteki tüm sorular çıkarıldı.');
          }
        }
      });
    });
  }
});

Template.soruEkleModal.helpers({
  sorular(){
    const sinav = M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')});
    const uygunSorular = sinav && ReactiveMethod.call('sinavaUygunSorular',sinav.kurum,sinav.egitimYili,sinav.ders,sinav.sinif);
    //TODO: diger benzer liste helper'larini da bunun gibi yap, reactive undefined sorunu kalmasin _.pluck yuzunden gelen
    const sepetSoruIdArray = uygunSorular && M.C.SoruSepetleri.find({createdBy: Meteor.userId(), soru: {$in: _.difference(uygunSorular, _.pluck(sinav.sorular, 'soruId'))}}, {sort: {createdAt: 1}}).map(sepet=> sepet.soru);
    //TODO: sort and group by konu
    const sorularCursor = sepetSoruIdArray && M.C.Sorular.find({_id: {$in: sepetSoruIdArray}});
    return sorularCursor && sorularCursor.count() && {cursor: sorularCursor, count: sorularCursor.count()};
  }
});

Template.soruEkleModal.events({
  'click [data-trigger="tumunuEkle"]'(e,t) {
    e.preventDefault();
    Meteor.call('sepetiSinavaEkle', FlowRouter.getParam('_id'), (err,res) => {
      if (err) {
        toastr.error(M.E.BilinmeyenHataMessage)
      }
      if (res) {
        toastr.success('Sepetinizdeki tüm uygun sorular teste eklendi.')
      }
    });
  }
});

Template.soruEkleKart.events({
  'click [data-trigger="ekle"]'(e,t) {
    const sinav = FlowRouter.getParam('_id');
    const soru = t.data._id;
    Meteor.call('sinavaSoruEkleCikar',sinav,soru,'ekle', (err,res) => {
      if (err) {
        toastr.error(M.E.BilinmeyenHataMessage);
      } else if (res) {
        toastr.success('Soru teste eklendi.');
      }
    });
  },
  'click [data-trigger="detayGor"]'(e,t) {
    $('#soruEkleModal').closeModal();
  },
});

Template.sinavOgrencilerModal.onCreated(function() {
  this.autorun(() => {
    this.subscribe('sinavinOgrencileri', FlowRouter.getParam('_id'));
    this.subscribe('sinavinKagitlari', FlowRouter.getParam('_id'));
  });
});

Template.sinavOgrencilerModal.helpers({
  sinifSube() {
    const sinav = M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')});
    return sinav && {
        sinif: sinav.sinif.substr(1,1),
        subeler: sinav.subeler
      };
  },
  ogrenciler(sube) {
    const sinav = M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')});
    return sinav && M.C.Users.find({
        aktif: true,
        role: 'ogrenci',
        kurum: sinav.kurum,
        sinif: sinav.sinif,
        sube: sube
      }, {
        sort: {
          sube: 1,
          nameCollate: 1,
          lastNameCollate: 1
        }
      });
  },
  sinavKagidi(ogrenci) {
    return M.C.SinavKagitlari.findOne({
      sinav: FlowRouter.getParam('_id'),
      ogrenciSinavaGirdi: true,
      ogrenci: ogrenci
    });
  },
  sinavSuresiDisplay(baslama, bitirme) {
    return M.L.FormatSinavSuresi(moment(bitirme).diff(baslama));
  }
});
