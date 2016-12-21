import { Meteor } from 'meteor/meteor';
import { Blaze } from 'meteor/blaze';
import { check } from 'meteor/check';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import { _ } from 'meteor/underscore';

import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { moment } from 'meteor/momentjs:moment';
import { TimeSync } from 'meteor/mizzao:timesync';

import { M } from 'meteor/m:lib-core';

M.L.CleanMaterializeSelectCaret = function($this) {
  $this.parent().find('span.caret').remove();
  $this.material_select();
};

M.L.clearSessionVariable = variable => {
  check(variable, String);
  Session.set(variable, undefined);
  delete Session.keys[variable];
};

M.L.getDataUri = (url, callback) => {
  const image = new Image();
  image.onload = function() {
    let canvas = document.createElement('canvas');
    canvas.width = this.naturalWidth;
    canvas.height = this.naturalHeight;
    canvas.getContext('2d').drawImage(this, 0, 0);
    callback(null, canvas.toDataURL());
  };
  image.onerror = function() {
    callback('error loading image', null)
  };
  image.src = url;
};

M.L.WriteRotatedText = text => {
  let ctx, canvas = document.createElement('canvas');
  canvas.width = 36;
  canvas.height = 270;
  ctx = canvas.getContext('2d');
  ctx.font = '36pt Arial';
  ctx.save();
  ctx.translate(36,270);
  ctx.rotate(-0.5*Math.PI);
  ctx.fillStyle = '#000';
  ctx.fillText(text , 0, 0);
  ctx.restore();
  return canvas.toDataURL();
};

M.L.CizgiCiz = (solId, sagId, wrapperElementId) => {
  let x1 = parseInt($('#sol-'+solId).position().left + parseInt($('#sol-'+solId).css('border-left-width').slice(0,-2)) + parseInt($('#sol-'+solId).css('margin-left').slice(0,-2)) + $('#sol-'+solId).width());
  let y1 = parseInt($('#sol-'+solId).position().top + parseInt($('#sol-'+solId).css('border-top-width').slice(0,-2)) + parseInt($('#sol-'+solId).css('margin-top').slice(0,-2)) + $('#sol-'+solId).height()/2);
  let x2 = parseInt($('#sag-'+sagId).position().left + parseInt($('#sag-'+sagId).css('border-left-width').slice(0,-2)) + parseInt($('#sag-'+sagId).css('margin-left').slice(0,-2)));
  let y2 = parseInt($('#sag-'+sagId).position().top  + parseInt($('#sag-'+sagId).css('border-top-width').slice(0,-2)) + parseInt($('#sag-'+sagId).css('margin-top').slice(0,-2)) + $('#sag-'+sagId).height()/2);

  if(y1 < y2){
    let pom = y1;
    y1 = y2;
    y2 = pom;
    pom = x1;
    x1 = x2;
    x2 = pom;
  }

  let a = Math.abs(x1-x2);
  let b = Math.abs(y1-y2);
  let c;
  const sx = (x1+x2)/2 ;
  const sy = (y1+y2)/2 ;
  const width = Math.sqrt(a*a + b*b ) ;
  const x = sx - width/2;
  const y = sy;

  a = width / 2;

  c = Math.abs(sx-x);

  b = Math.sqrt(Math.abs(x1-x)*Math.abs(x1-x)+Math.abs(y1-y)*Math.abs(y1-y) );

  const cosb = (b*b - a*a - c*c) / (2*a*c);
  const rad = Math.acos(cosb);
  const deg = (rad*180)/Math.PI;

  const htmlns = "http://www.w3.org/1999/xhtml";
  let div = document.createElementNS(htmlns, "div");
  div.setAttribute('style','border:none;border-top:2px solid #57492B;width:'+width+'px;height:0px;transform:rotate('+deg+'deg);position:absolute;top:'+y+'px;left:'+x+'px;');
  div.setAttribute('id','sol-'+solId+'-sag-'+sagId);
  div.setAttribute('class','cizgi');

  document.getElementById(wrapperElementId).appendChild(div);
};

M.L.CizgiSil = (solId, sagId, wrapperElementId) => {
  $('#'+wrapperElementId+' > #sol-'+solId+'-sag-'+sagId).remove();
};

Template.registerHelper('pathWithParam', (pathName, paramName) => {
  let routeParams = {};
  routeParams[paramName] = FlowRouter.getParam(paramName);
  return FlowRouter.path(pathName, routeParams);
});

Template.registerHelper('foreignField', (collection, id, field) => {
  const doc = M.C[collection].findOne({_id: id});
  return doc && doc[field];
});

Template.registerHelper('tarihce', (collection) => {
  const doc = M.C[collection].findOne({_id: FlowRouter.getParam('_id')});
  // TODO: we are using an undocumented hack. convert to nested helper when meteor 1.2 gets released
  return doc && Blaze._globalHelpers.$mapped(doc.versions());
});

Template.registerHelper('formatTel', (tel) => {
  return M.L.formatTel(tel);
});

Template.registerHelper('log', (obj) => {
  console.log(obj);
});

Template.registerHelper('isOdd', num => {
  return !!(num%2);
});

Template.registerHelper('parseInt', (numTxt) => {
  return parseInt(numTxt);
});

Template.registerHelper('join', (/*arguments*/) => {
  let args = Array.prototype.slice.call(arguments);
  args.pop();
  return args.join("-");
});

Template.registerHelper('showFilters', () => {
  return !!Session.get('filters');
});

Template.registerHelper('detayPath', (collection,doc) => {
  const pathMap = {
    Users: 'kullaniciDetay',
    Sinavlar: 'sinavDetay',
    Sorular: 'soruDetay',
    Kurumlar: 'kurumDetay',
    Karakterler: 'karakterDetay',
    Dersler: 'dersDetay',
    Mufredat: 'mufredatDetay',
    Muhurler: 'muhurDetay',
    YardimDokumanlari: 'yardimDokumaniDetay'
  };
  return FlowRouter.path(pathMap[collection], {_id: doc});
});

Template.registerHelper('aktifEgitimYili', () => {
  const aktifEgitimYili = M.C.AktifEgitimYili.findOne({});
  return aktifEgitimYili && M.L.enumLabel(aktifEgitimYili.egitimYili);
});

Template.registerHelper('ilAdi', ilce => {
  return M.C.Ilceler.findOne({_id: ilce}).il;
});

Template.registerHelper('ilceAdi', ilce => {
  return M.C.Ilceler.findOne({_id: ilce}).ilce;
});

Template.registerHelper('userHasRole', role => {
  return M.L.userHasRole(Meteor.userId(),role);
});

Template.registerHelper('enumLabel', val => {
  return M.L.enumLabel(val);
});

Template.registerHelper( 'liveTime', date => {
  const locale = mo.currentLocale.get();
  let result;

  const dateA = mo._getMoment( date );
  const dateB = mo.now.get();

  if ( dateA && dateB ) {
    result = dateA.from( dateB );
  }

  return result;
});

Template.registerHelper('userInKurum', kurumId => {
  return M.L.userInKurum(Meteor.userId(),kurumId);
});

Template.registerHelper('userFullName', userId => {
  check(userId, String);
  const user = M.C.Users.findOne({_id: userId});
  if (!user) {
    return 'Sistem';
  }
  return user.name + ' ' + user.lastName;
});

Template.registerHelper('instance', () => {
  return Template.instance();
});

Template.registerHelper('plusOne', num => {
  return parseInt(num) + 1;
});

Template.registerHelper('yeniKayit', (coll,docId) => {
  const doc = M.C[coll].findOne({_id: docId});
  return doc.createdBy === Meteor.userId() && moment(TimeSync.serverTime(null, 5 * 60 * 1000)).isBefore(moment(new Date(doc.createdAt)).add(15,'seconds'))
});

Template.registerHelper('sinavYayinda', sinavId => {
  const sinav = M.C.Sinavlar.findOne({
    $and: [
      {
        _id: sinavId,
        taslak: false,
        aktif: true,
        iptal: false,
        muhur: {$exists: true},
        egitimYili: M.C.AktifEgitimYili.findOne().egitimYili,
        acilisZamani: {$lt: moment(TimeSync.serverTime(null, 5 * 60 * 1000)).toDate()}
      },
      {
        $or: [
          {
            tip: {$ne: 'canli'},
            kapanisZamani: {$gt: moment(TimeSync.serverTime(null, 5 * 60 * 1000)).toDate()}
          },
          {
            tip: 'canli',
            kapanisZamani: {$gt: moment(TimeSync.serverTime(null, 5 * 60 * 1000)).toDate()},
            canliStatus: {$ne: 'completed'}
          }
        ]
      }
    ]
  });
  return !!sinav;
});

Template.registerHelper('sinavBaslamayiBekliyor', sinavId => {
  const sinav = M.C.Sinavlar.findOne({
    _id: sinavId,
    iptal: false,
    taslak: false,
    acilisZamani: {$gt: moment(TimeSync.serverTime(null, 5 * 60 * 1000)).toDate()}
  });
  return !!sinav;
});

Template.registerHelper('sinavBaslamaTarihiGecmis', sinavId => {
  const sinav = M.C.Sinavlar.findOne({
    _id: sinavId,
    iptal: false,
    taslak: false,
    kilitli: true,
    acilisZamani: {$lt: moment(TimeSync.serverTime(null, 5 * 60 * 1000)).toDate()}
  });
  return !!sinav;
});

Template.registerHelper('sinavRaporlamayaUygun', sinavId => {
  const sinav = M.C.Sinavlar.findOne({
    _id: sinavId,
    iptal: false,
    taslak: false,
    kilitli: true,
    kapanisZamani: {$lt: moment(TimeSync.serverTime(null, 5 * 60 * 1000)).subtract(1,'minutes').toDate()}
  });
  return !!sinav;
});

Template.registerHelper('sinavKagidi', sinavId => {
  return M.C.SinavKagitlari.findOne({
    ogrenci: Meteor.userId(),
    sinav: sinavId,
    kurum: Meteor.user() && Meteor.user().kurum,
    sinif: Meteor.user() && Meteor.user().sinif,
    egitimYili: M.C.AktifEgitimYili.findOne().egitimYili,
    ogrenciSinavaGirdi: true
  });
});

Template.registerHelper('sinavKapanmis', sinavId => {
  const sinav = M.C.Sinavlar.findOne({
    $and: [
      {
        _id: sinavId
      },
      {
        $or: [
          {
            kapanisZamani: {$lt: moment(TimeSync.serverTime(null, 5 * 60 * 1000)).toDate()}
          },
          {
            tip: 'canli',
            canliStatus: 'completed'
          }
        ]
      }
    ]
  });
  return !!sinav;
});

Template.registerHelper('sinavYanitlariAcilmis', sinavId => {
  const sinav = M.C.Sinavlar.findOne({
    _id: sinavId,
    yanitlarAcilmaZamani: {$lt: moment(TimeSync.serverTime(null, 5 * 60 * 1000)).toDate()}
  });
  return !!sinav;
});

Template.registerHelper('sinavYanitlariAcilmamis', sinavId => {
  const sinav = M.C.Sinavlar.findOne({
    _id: sinavId,
    yanitlarAcilmaZamani: {$gt: moment(TimeSync.serverTime(null, 5 * 60 * 1000)).toDate()}
  });
  return !!sinav;
});

Template.registerHelper('currentFieldValue', fieldName => {
  return AutoForm.getFieldValue(fieldName);
});

Template.registerHelper('toHashCode', text => {
  if (_.isObject(text)) {
    text = JSON.stringify(text);
  }
  return text.toString().toHashCode();
});
