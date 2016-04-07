Template.soruboslukDoldurma.onCreated(function() {
  this.yanit = this.data.sinav === true && M.C.SinavKagitlari.findOne({
      _id: this.data.sinavKagidiId
    }).yanitlar[this.data.seciliSoruIndex].yanit;
});

Template.soruboslukDoldurma.onRendered(function() {
  var template = this;
  if (template.data.sinav === true) {
    Tracker.afterFlush(function() {
      _.each(template.yanit.cevaplar, function(cevap,cIx) {
        $('input[type="text"]#'+cIx).val(cevap);
      })
    })
  }
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
