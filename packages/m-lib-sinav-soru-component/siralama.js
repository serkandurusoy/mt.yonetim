Template.sorusiralama.onCreated(function() {
  this.seciliSoru = this.data.sinav === true && M.C.SinavKagitlari.findOne({
      _id: this.data.sinavKagidiId
    }).yanitlar[this.data.seciliSoruIndex];
});

Template.sorusiralama.onRendered(function() {
  var template = this;
  if (template.data.sinav === true) {
    Tracker.afterFlush(function() {
      var el = document.getElementById('siralama-'+template.seciliSoru.soruId+'-'+template.seciliSoru.yanitlandi);
      if (el) {
        if (typeof siralamaSortable !== 'undefined') {
          siralamaSortable.destroy()
        }
        var siralamaSortable = new Sortable(el, {
          forceFallback: true,
          onEnd: function() {
            $('#cozumAlani').animate({
              scrollTop: '-=500'
            }, 0)
          }
        });
        siralamaSortable.sort(_.map(template.seciliSoru.yanit.secenekler, function(secenek) {return JSON.stringify(secenek).toString().toHashCode();}));
      }
    })
  }
});

Template.sorusiralama.helpers({
  secenekler: function() {
    if (Template.instance().data.sinav === true) {
      return Template.instance().seciliSoru.yanit.secenekler;
    } else {
      return Template.instance().data.secenekler;
    }
  },
  id: function() {
    var id = 'siralama';
    if (Template.instance().data.sinav === true) {
      id = id + '-' + Template.instance().seciliSoru.soruId + '-' + Template.instance().seciliSoru.yanitlandi;
    }
    return id;
  }
});
