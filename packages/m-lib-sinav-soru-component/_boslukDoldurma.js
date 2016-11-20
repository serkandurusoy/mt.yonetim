import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { ReactiveVar } from 'meteor/reactive-var'
import { $ } from 'meteor/jquery';

import { M } from 'meteor/m:lib-core';

import './_boslukDoldurma.html';

const event = 'oninput' in document.createElement('input') ? 'input' : 'keydown';

$.fn.autoGrowInput = options => {
  const o = $.extend({ maxWidth: 500, minWidth: 20, comfortZone: 0 }, options);

  this.each(function(){
    const input = $(this);
    let  val = ' ';
    const comfortZone = (options && 'comfortZone' in options) ? o.comfortZone : parseInt(input.css('fontSize'));
    let span = $('<span/>').css({
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
      }).appendTo('body');
      check = e => {
        if (val === (val = input.val()) && e.type !== 'autogrow') return;
        if (!val) val = input.attr('placeholder') || '';
        span.html(val.replace(/&/g, '&amp;').replace(/\s/g, '&nbsp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
        let newWidth = span.width() + comfortZone, mw = typeof(o.maxWidth) == "function" ? o.maxWidth() : o.maxWidth;
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

  this.yanit = new ReactiveVar();
  this.sinav = new ReactiveVar();
  this.cevap = new ReactiveVar();
  this.sinavKagidiId = new ReactiveVar();
  this.seciliSoruIndex = new ReactiveVar();

  this.autorun(() => {
    this.sinav.set(Template.currentData().sinav);
    this.cevap.set(Template.currentData().cevap);
    this.sinavKagidiId.set(Template.currentData().sinavKagidiId);
    this.seciliSoruIndex.set(Template.currentData().seciliSoruIndex);

    this.yanit.set(this.sinav.get() === true && M.C.SinavKagitlari.findOne({
        _id: this.sinavKagidiId.get()
      }).yanitlar[this.seciliSoruIndex.get()].yanit);
  })
});

Template.soruboslukDoldurma.onRendered(function() {
  this.autorun(() => {
    Tracker.afterFlush(() => {
      if (this.sinav.get() === true && this.yanit.get().cevaplar.length >= 0) {
        let $inputs = $('input[type="text"]');
        $inputs.autoGrowInput({ minWidth: 80, maxWidth: 400, comfortZone: 0 });
        this.yanit.get().cevaplar.forEach((cevap,cIx) => {
          $('input[type="text"]#'+cIx).val(cevap);
        });
        $inputs.trigger('autogrow');
      }
    })
  })
});

Template.soruboslukDoldurma.helpers({
  boslukDoldurma() {
    if (Template.instance().sinav.get() === true) {
      return Template.instance().yanit.get().bosluklar;
    } else {
      return '<p>' + splitOnNewlines(Template.instance().cevap.get().replace(/\[(.+?)\]/g, "<span class=\"boslukDoldurSecenekSpan\">$1</span>")).join('</p><p>') + '</p>'
    }
  }
});
