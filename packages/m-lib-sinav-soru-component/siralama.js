Template.sorusiralama.onCreated(function() {
  var template = this;
  template.seciliSoru = new ReactiveVar();

  template.sinav = new ReactiveVar();
  template.sinavKagidiId = new ReactiveVar();
  template.seciliSoruIndex = new ReactiveVar();
  template.secenekler = new ReactiveVar();

  template.autorun(function() {
    template.sinav.set(Template.currentData().sinav);
    template.sinavKagidiId.set(Template.currentData().sinavKagidiId);
    template.seciliSoruIndex.set(Template.currentData().seciliSoruIndex);
    template.secenekler.set(Template.currentData().secenekler);

    template.seciliSoru.set(template.sinav.get() === true && M.C.SinavKagitlari.findOne({
        _id: template.sinavKagidiId.get()
      }).yanitlar[template.seciliSoruIndex.get()]);
  })
});

Template.sorusiralama.onRendered(function() {
  var template = this;
  template.autorun(function() {
    Tracker.afterFlush(function() {
      if (template.sinav.get() === true && template.seciliSoru.get().yanit.secenekler.length >=0) {
        var el = document.getElementById('siralama-'+template.seciliSoru.get().soruId+'-'+template.seciliSoru.get().yanitlandi);
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
          siralamaSortable.sort(_.map(template.seciliSoru.get().yanit.secenekler, function(secenek) {return JSON.stringify(secenek).toString().toHashCode();}));
        }
      }
    })
  })
});

Template.sorusiralama.helpers({
  secenekler: function() {
    if (Template.instance().sinav.get() === true) {
      return Template.instance().seciliSoru.get().yanit.secenekler;
    } else {
      return Template.instance().secenekler.get();
    }
  },
  id: function() {
    var id = 'siralama';
    if (Template.instance().sinav.get() === true) {
      id = id + '-' + Template.instance().seciliSoru.get().soruId + '-' + Template.instance().seciliSoru.get().yanitlandi;
    }
    return id;
  }
});
