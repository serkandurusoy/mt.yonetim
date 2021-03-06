var iptalView;
var kilitleView;
var taslakDegistirView;
var soruCikarModalView;
var sorularinTumunuCikarModalView;
var sinavBitirModalView;
var sinavOgrencilerView;

Template.sinavDetay.onCreated(function() {
  var template = this;
  template.autorun(function() {
    template.subscribe('sinav', FlowRouter.getParam('_id'), function() {
      Tracker.afterFlush(function() {
        var yeniSinav = Session.get('yeniSinav');
        if (yeniSinav && yeniSinav === FlowRouter.getParam('_id')) {
          var sinav = M.C.Sinavlar.findOne({_id: yeniSinav});
          if (sinav) {
            toastr.success('Teste soru ekleyebilirsiniz.');
          }
          M.L.clearSessionVariable('yeniSinav');
        }
      });
    });
    template.subscribe('mufredatlar');
  });

  template.observeHandle = M.C.Notifications.find().observe({
    'added': function(doc) {
      var nt = M.C.Notifications.findOne({
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
  var template = this;
  template.observeHandle.stop();
});

Template.sinavDetay.helpers({
  sinav: function() {
    return M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')});
  },
  sinavStatusGuncellenebilir: function() {
    var sinav = M.C.Sinavlar.findOne({
      _id: FlowRouter.getParam('_id'),
      muhur: {$exists: true},
      iptal: false,
      taslak: false,
      kilitli: true,
      tip: 'canli'
    });
    return sinav && sinav.canliStatus && sinav.canliStatus !== 'completed' && moment().isAfter(sinav.acilisZamani) && moment().isBefore(sinav.kapanisZamani);
  },
  sinavIptalEdilebilir: function() {
    var sinav = M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')});
    return moment().isBefore(sinav.kapanisZamani) || sinav.taslak === true;
  },
  kilitlenebilir: function() {
    var sinav = M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')});
    return sinav.iptal === false && sinav.taslak === false && sinav.kilitli === false && sinav.sorular && sinav.sorular.length > 0;
  },
  taslakDegisebilir: function() {
    var sinav = M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')});
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
  ogretmenCanEdit: function() {
    if (Meteor.user()) {
      if (Meteor.user().role !== 'ogretmen') {
        return true;
      } else {
        return _.contains(Meteor.user().dersleri, M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')}).ders);
      }
    } else {
      return false;
    }
  }
});

Template.sinavDetay.events({
  'click [data-trigger="sinavIptalModal"]': function(e,t) {
    t.$('.fixed-action-btn').closeFAB();
    iptalView = Blaze.render(Template.sinavIptalModal, document.getElementsByTagName('main')[0]);
    $('#sinavIptalModal').openModal({
      complete: function() {
        Blaze.remove(iptalView);
      }
    });
  },
  'click [data-trigger="sinavKilitleModal"]': function(e,t) {
    t.$('.fixed-action-btn').closeFAB();
    kilitleView = Blaze.render(Template.sinavKilitleModal, document.getElementsByTagName('main')[0]);
    $('#sinavKilitleModal').openModal({
      complete: function() {
        Blaze.remove(kilitleView);
      }
    });
  },
  'click [data-trigger="sinavTaslakDegistirModal"]': function(e,t) {
    t.$('.fixed-action-btn').closeFAB();
    taslakDegistirView = Blaze.render(Template.sinavTaslakDegistirModal, document.getElementsByTagName('main')[0]);
    $('#sinavTaslakDegistirModal').openModal({
      complete: function() {
        Blaze.remove(taslakDegistirView);
      }
    });
  },
  'click [data-trigger="soruEkleModal"]': function(e,t) {
    t.$('.fixed-action-btn').closeFAB();
    var view = Blaze.render(Template.soruEkleModal, document.getElementsByTagName('main')[0]);
    $('#soruEkleModal').openModal({
      complete: function() {
        Blaze.remove(view);
      }
    });
  },
  'click [data-trigger="sinavBitirModal"]': function(e,t) {
    t.$('.fixed-action-btn').closeFAB();
    sinavBitirModalView = Blaze.render(Template.sinavBitirModal, document.getElementsByTagName('main')[0]);
    $('#sinavBitirModal').openModal({
      complete: function() {
        Blaze.remove(sinavBitirModalView);
      }
    });
  },
  'click [data-trigger="baslat"]': function(e,t) {
    var sinav = M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')})._id;
    t.$('.fixed-action-btn').closeFAB();
    Meteor.call('setSinavCanliStatus',sinav,'running');
  },
  'click [data-trigger="durdur"]': function(e,t) {
    var sinav = M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')})._id;
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
  soru: function(soruId) {
    return M.C.Sorular.findOne({_id: soruId});
  },
  guncelHaliNotEditable: function() {
    var sinav = M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')});
    return sinav && (sinav.iptal || sinav.kilitli || sinav.muhur || sinav.aktif === false);
  },
  commentCount: function() {
    return M.C.Comments.find({collection: 'Sinavlar', doc: FlowRouter.getParam('_id')}).count();
  }
});


Template.sinavDetayKart.events({
  'click [data-trigger="clone"]': function(e,t) {
    var doc = t.data;
    doc = _.extend(_.pick(doc, 'kurum', 'aciklama', 'ders', 'sinif', 'subeler', 'sorularKarissin', 'sorular'), {aktif: true, iptal: false, _clonedFrom: {_id: doc._id, _version: doc._version}});
    Session.set('sinavClone',doc);
    FlowRouter.go('sinavYeni');
  },
  'click [data-trigger="yukari"], click [data-trigger="asagi"]': function(e,t) {
    var sinavId = t.data._id;
    var soruId = this._id;
    var yon = e.currentTarget.getAttribute('data-trigger');
    Meteor.call('soruSiraDegistir',sinavId,soruId,yon);
  },
  'click [data-trigger="cikar"]': function(e,t) {
    var sinav = t.data._id;
    var soru = this._id;
    Session.set('soruCikar', {sinav: sinav, soru: soru});
    soruCikarModalView = Blaze.render(Template.soruCikarModal, document.getElementsByTagName('main')[0]);
    $('#soruCikarModal').openModal({
      complete: function() {
        Blaze.remove(soruCikarModalView);
      }
    });
  },
  'click [data-trigger="tumunuCikar"]': function(e,t) {
    sorularinTumunuCikarModalView = Blaze.render(Template.sorularinTumunuCikarModal, document.getElementsByTagName('main')[0]);
    $('#sorularinTumunuCikarModal').openModal({
      complete: function() {
        Blaze.remove(sorularinTumunuCikarModalView);
      }
    });
  },
  'click [data-trigger="comment"]': function(e,t) {
    $("html, body").animate({ scrollTop: $(document).height() }, 1000);
  },
  'click [data-trigger="onizleme"]': function(e,t) {
    sinavOnizlemeView = Blaze.render(Template.sinavOnizlemeModal, document.getElementsByTagName('main')[0]);
  },
  'click [data-trigger="ogrenciler"]': function(e,t) {
    var sinavOgrencilerView = Blaze.render(Template.sinavOgrencilerModal, document.getElementsByTagName('main')[0]);
    $('#sinavOgrencilerModal').openModal({
      complete: function() {
        Blaze.remove(sinavOgrencilerView);
      }
    });
  },
  'click [data-analizRaporu]': function(e,t) {
    e.preventDefault();
    toastr.success('Rapor hazırlanıyor. Lüften bekleyin.', null, {onHidden: function() {
      Meteor.call('analizRaporu', t.data._id, function(err,res) {
        if (err) {
          if (err.reason === 'Sınav kağıdı bulunamadı') {
            toastr.error('Bu teste giren hiç öğrenci olmadığından rapor üretilemedi.');
          } else {
            toastr.error('Bilinmeyen bir hata oluştu, daha sonra tekrar deneyin.');
          }
        }
        if (res) {
          var content = M.L.analizRaporuContent(res);
          M.L.PrintReport(res, content, 'portrait', t.data.kod + '-test-analiz-raporu.pdf', t.data.kod + ' Test Analiz Raporu');
        }
      })
    }});
  },
  'click [data-testMaddeAnalizi]': function(e,t) {
    e.preventDefault();
    toastr.success('Rapor hazırlanıyor. Lüften bekleyin.', null, {onHidden: function() {
      Meteor.call('testMaddeAnalizi', t.data._id, function(err,res) {
        if (err) {
          if (err.reason === 'Sınav kağıdı bulunamadı') {
            toastr.error('Bu teste giren hiç öğrenci olmadığından rapor üretilemedi.');
          } else {
            toastr.error(M.E.BilinmeyenHataMessage);
          }
        }
        if (res) {
          var content = M.L.testMaddeAnaliziContent(res);
          M.L.PrintReport(res, content, 'landscape', t.data.kod + '-test-madde-analizi.pdf', t.data.kod + ' Test Madde Analizi');
        }
      })
    }});
  },
  'click [data-testCeldiriciAnalizi]': function(e,t) {
    e.preventDefault();
    toastr.success('Rapor hazırlanıyor. Lüften bekleyin.', null, {onHidden: function() {
      Meteor.call('testCeldiriciAnalizi', t.data._id, function(err,res) {
        if (err) {
          if (err.reason === 'Sınav kağıdı bulunamadı') {
            toastr.error('Bu teste giren hiç öğrenci olmadığından rapor üretilemedi.');
          } else {
            toastr.error(M.E.BilinmeyenHataMessage);
          }
        }
        if (res) {
          var content = M.L.testCeldiriciAnaliziContent(res);
          M.L.PrintReport(res, content, 'portrait', t.data.kod + '-test-celdirici-analizi.pdf', t.data.kod + ' Test Çeldirici Analizi');
        }
      })
    }});
  },
  'click [data-subeBazindaPuanlar]': function(e,t) {
    e.preventDefault();
    toastr.success('Rapor hazırlanıyor. Lüften bekleyin.', null, {onHidden: function() {
      Meteor.call('subeBazindaPuanlar', t.data._id, function(err,res) {
        if (err) {
          if (err.reason === 'Sınav kağıdı bulunamadı') {
            toastr.error('Bu teste giren hiç öğrenci olmadığından rapor üretilemedi.');
          } else {
            toastr.error(M.E.BilinmeyenHataMessage);
          }
        }
        if (res) {
          var content = M.L.subeBazindaPuanlarContent(res);
          M.L.PrintReport(res, content, 'portrait', t.data.kod + '-sube-bazinda-puanlar.pdf', t.data.kod + ' Şube Bazında Puanlar');
        }
      })
    }});
  },
  'click [data-sinifBazindaPuanlar]': function(e,t) {
    e.preventDefault();
    toastr.success('Rapor hazırlanıyor. Lüften bekleyin.', null, {onHidden: function() {
      Meteor.call('sinifBazindaPuanlar', t.data._id, function(err,res) {
        if (err) {
          if (err.reason === 'Sınav kağıdı bulunamadı') {
            toastr.error('Bu teste giren hiç öğrenci olmadığından rapor üretilemedi.');
          } else {
            toastr.error(M.E.BilinmeyenHataMessage);
          }
        }
        if (res) {
          var content = M.L.sinifBazindaPuanlarContent(res);
          M.L.PrintReport(res, content, 'portrait', t.data.kod + '-sinif-bazinda-puanlar.pdf', t.data.kod + ' Sınıf Bazında Puanlar');
        }
      })
    }});
  }
});

Template.sinavBitirModal.events({
  'click [data-trigger="bitir"]': function(e,t) {
    var sinav = M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')})._id;
    Meteor.call('setSinavCanliStatus',sinav,'completed');
    $('#sinavBitirModal').closeModal({
      complete: function() {
        Blaze.remove(sinavBitirModalView);
      }
    });
  }
});

Template.sinavTaslakDegistirModal.helpers({
  taslak: function() {
    var sinav = M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')});
    return sinav && sinav.taslak;
  },
  acilisZamaniGecmis: function() {
    var sinav = M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')});
    return sinav && moment(sinav.acilisZamani).isBefore(moment());
  }
});

Template.sinavTaslakDegistirModal.events({
  'click [data-trigger="taslakDegistir"]': function(e,t) {
    var sinav = M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')})._id;
    Meteor.call('sinavTaslakDegistir',sinav);
    $('#sinavTaslakDegistirModal').closeModal({
      complete: function() {
        Blaze.remove(taslakDegistirView);
      }
    });
  }
});

Template.sinavKilitleModal.events({
  'click [data-trigger="kilitle"]': function(e,t) {
    var sinav = M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')})._id;
    Meteor.call('sinavKilitle',sinav);
    $('#sinavKilitleModal').closeModal({
      complete: function() {
        Blaze.remove(kilitleView);
      }
    });
  }
});

Template.sinavIptalModal.events({
  'click [data-trigger="iptal"]': function(e,t) {
    var sinav = M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')})._id;
    Meteor.call('sinavIptal',sinav);
    $('#sinavIptalModal').closeModal({
      complete: function() {
        Blaze.remove(iptalView);
      }
    });
  }
});


Template.soruCikarModal.events({
  'click [data-trigger="cikar"]': function(e,t) {
    var soruCikar = Session.get('soruCikar');
    Meteor.call('sinavaSoruEkleCikar',soruCikar.sinav,soruCikar.soru,'cikar', function(err, res) {
      M.L.clearSessionVariable('soruCikar');
      $('#soruCikarModal').closeModal({
        complete: function() {
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
  'click [data-trigger="cikar"]': function(e,t) {
    Meteor.call('sinavdakiSorulariBosalt', FlowRouter.getParam('_id'), function(err,res) {
      $('#sorularinTumunuCikarModal').closeModal({
        complete: function() {
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
  sorular: function(){
    var sinav = M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')});
    var uygunSorular = sinav && ReactiveMethod.call('sinavaUygunSorular',sinav.kurum,sinav.egitimYili,sinav.ders,sinav.sinif);
    //TODO: diger benzer liste helper'larini da bunun gibi yap, reactive undefined sorunu kalmasin _.pluck yuzunden gelen
    var sepetSoruIdArray = uygunSorular && M.C.SoruSepetleri.find({createdBy: Meteor.userId(), soru: {$in: _.difference(uygunSorular, _.pluck(sinav.sorular, 'soruId'))}}, {sort: {createdAt: 1}}).map(function(sepet) {return sepet.soru;});
    //TODO: sort and group by konu
    var sorularCursor = sepetSoruIdArray && M.C.Sorular.find({_id: {$in: sepetSoruIdArray}});
    return sorularCursor && sorularCursor.count() && {cursor: sorularCursor, count: sorularCursor.count()};
  }
});

Template.soruEkleModal.events({
  'click [data-trigger="tumunuEkle"]': function(e,t) {
    e.preventDefault();
    Meteor.call('sepetiSinavaEkle', FlowRouter.getParam('_id'), function(err,res) {
      if (err) {
        toastr.error(M.E.BilinmeyenHataMessage)
      }
      if (res) {
        toastr.success('Sepetinizdeki tüm uygun sorular teste eklendi.')
      }
    });
  }});

Template.soruEkleKart.events({
  'click [data-trigger="ekle"]': function(e,t) {
    var sinav = FlowRouter.getParam('_id');
    var soru = t.data._id;
    Meteor.call('sinavaSoruEkleCikar',sinav,soru,'ekle', function(err,res) {
      if (err) {
        toastr.error(M.E.BilinmeyenHataMessage);
      } else if (res) {
        toastr.success('Soru teste eklendi.');
      }
    });
  },
  'click [data-trigger="detayGor"]': function(e,t) {
    $('#soruEkleModal').closeModal();
  }

});

Template.sinavOgrencilerModal.onCreated(function() {
  var template = this;
  template.autorun(function() {
    template.subscribe('sinavinOgrencileri', FlowRouter.getParam('_id'));
    template.subscribe('sinavinKagitlari', FlowRouter.getParam('_id'));
  });
});

Template.sinavOgrencilerModal.helpers({
  sinifSube: function() {
    var sinav = M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')});
    return sinav && {
        sinif: sinav.sinif.substr(1,1),
        subeler: sinav.subeler
      };
  },
  ogrenciler: function(sube) {
    var sinav = M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')});
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
  sinavKagidi: function(ogrenci) {
    return M.C.SinavKagitlari.findOne({
      sinav: FlowRouter.getParam('_id'),
      ogrenciSinavaGirdi: true,
      ogrenci: ogrenci
    });
  },
  sinavSuresiDisplay: function(baslama, bitirme) {
    return M.L.FormatSinavSuresi(moment(bitirme).diff(baslama));
  }
});
