Template.soruboslukDoldurma.onCreated(function() {
  var template = this;
  template.yanit = new ReactiveVar();
  template.sinav = new ReactiveVar();
  template.cevap = new ReactiveVar();
  template.sinavKagidiId = new ReactiveVar();
  template.seciliSoruIndex = new ReactiveVar();

  template.autorun(function() {
    template.sinav.set(Template.currentData().sinav);
    template.cevap.set(Template.currentData().cevap);
    template.sinavKagidiId.set(Template.currentData().sinavKagidiId);
    template.seciliSoruIndex.set(Template.currentData().seciliSoruIndex);

    template.yanit.set(template.sinav.get() === true && M.C.SinavKagitlari.findOne({
        _id: template.sinavKagidiId.get()
      }).yanitlar[template.seciliSoruIndex.get()].yanit);
  })
});

Template.soruboslukDoldurma.onRendered(function() {
  var template = this;
  template.autorun(function() {
    Tracker.afterFlush(function() {
      if (template.sinav.get() === true && template.yanit.get().cevaplar.length >= 0) {
        _.each(template.yanit.get().cevaplar, function(cevap,cIx) {
          $('input[type="text"]#'+cIx).val(cevap);
        })
      }
    })
  })
});

Template.soruboslukDoldurma.helpers({
  boslukDoldurma: function() {
    if (Template.instance().sinav.get() === true) {
      return Template.instance().yanit.get().bosluklar;
    } else {
      return '<p>' + splitOnNewlines(Template.instance().cevap.get().replace(/\[(.+?)\]/g, "<span class=\"boslukDoldurSecenekSpan\">$1</span>")).join('</p><p>') + '</p>'
    }
  }
});

Template.soruboslukDoldurma.events({
  'keydown .boslukDoldurSecenek, blur .boslukDoldurSecenek': function(e,t) {
    var len = t.$(e.currentTarget).val().length;
    if (len >= 7) {
      t.$(e.currentTarget).attr('size', len + 1);
    }
  }
});
