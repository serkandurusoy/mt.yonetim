var event = 'oninput' in document.createElement('input') ? 'input' : 'keydown';

$.fn.autoGrowInput = function(options){
  var o = $.extend({ maxWidth: 500, minWidth: 20, comfortZone: 0 }, options);

  this.each(function(){
    var input = $(this),
      val = ' ',
      comfortZone = (options && 'comfortZone' in options) ? o.comfortZone : parseInt(input.css('fontSize')),
      span = $('<span/>').css({
        position: 'absolute',
        top: -9999,
        left: -9999,
        width: 'auto',
        fontSize: input.css('fontSize'),
        fontFamily: input.css('fontFamily'),
        fontWeight: input.css('fontWeight'),
        letterSpacing: input.css('letterSpacing'),
        textTransform: input.css('textTransform'),
        whiteSpace: 'nowrap',
        ariaHidden: true
      }).appendTo('body'),
      check = function(e){
        if (val === (val = input.val()) && e.type !== 'autogrow') return;
        if (!val) val = input.attr('placeholder') || '';
        span.html(val.replace(/&/g, '&amp;').replace(/\s/g, '&nbsp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
        var newWidth = span.width() + comfortZone, mw = typeof(o.maxWidth) == "function" ? o.maxWidth() : o.maxWidth;
        if (newWidth > mw) newWidth = mw;
        else if (newWidth < o.minWidth) newWidth = o.minWidth;
        if (newWidth != input.width()) input.width(newWidth);
      };
    input.on(event+'.autogrow autogrow', check);
    // init on page load
    check();
  });
  return this;
};

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
        var $inputs = $('input[type="text"]');
        $inputs.autoGrowInput({ minWidth: 80, maxWidth: 400, comfortZone: 0 });
        _.each(template.yanit.get().cevaplar, function(cevap,cIx) {
          $('input[type="text"]#'+cIx).val(cevap);
        });
        $inputs.trigger('autogrow');
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
