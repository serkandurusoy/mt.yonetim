Template.soruboslukDoldurma.onCreated(function() {
  var template = this;
  template.autorun(function() {
    template.yanit = template.data.sinav === true && M.C.SinavKagitlari.findOne({
        _id: template.data.sinavKagidiId
      }).yanitlar[template.data.seciliSoruIndex].yanit;
  })
});

Template.soruboslukDoldurma.onRendered(function() {
  var template = this;
  template.autorun(function() {
    Tracker.afterFlush(function() {
      if (template.data.sinav === true && template.yanit.cevaplar.length >= 0) {
        _.each(template.yanit.cevaplar, function(cevap,cIx) {
          $('input[type="text"]#'+cIx).val(cevap);
        })
      }
    })
  })
});

Template.soruboslukDoldurma.helpers({
  boslukDoldurma: function() {
    if (Template.instance().data.sinav === true) {
      return Template.instance().yanit.bosluklar;
    } else {
      return '<p>' + splitOnNewlines(Template.instance().data.cevap.replace(/\[(.+?)\]/g, "<span class=\"boslukDoldurSecenekSpan\">$1</span>")).join('</p><p>') + '</p>'
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
