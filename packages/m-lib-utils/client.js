// TODO: Ugly hack to rename src from autoform materialize file due to it appending the token and using full url as src instead of file name
if (Meteor.settings.public.APP === 'YONETIM') {
  Template.fileThumbIcon.helpers({
    'src': function() {
      return this.src && this.src.split("/")[5] ? this.src.split("/")[5].split("?")[0] : this.src;
    }
  });
}

M.L.CleanMaterializeSelectCaret = function($this) {
  $this.parent().find('span.caret').remove();
  $this.material_select();
};

M.L.clearSessionVariable = function(variable) {
  check(variable, String);
  Session.set(variable, undefined);
  delete Session.keys[variable];
};

M.L.getDataUri = function (url, callback) {
  var image = new Image();
  image.onload = function () {
    var canvas = document.createElement('canvas');
    canvas.width = this.naturalWidth;
    canvas.height = this.naturalHeight;
    canvas.getContext('2d').drawImage(this, 0, 0);
    callback(canvas.toDataURL());
  };
  image.src = url;
};

M.L.WriteRotatedText = function(text) {
  var ctx, canvas = document.createElement('canvas');
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

M.L.CizgiCiz = function (solId, sagId, wrapperElementId) {
  var x1 = parseInt($('#sol-'+solId).position().left + parseInt($('#sol-'+solId).css('border-left-width').slice(0,-2)) + parseInt($('#sol-'+solId).css('margin-left').slice(0,-2)) + $('#sol-'+solId).width());
  var y1 = parseInt($('#sol-'+solId).position().top + parseInt($('#sol-'+solId).css('border-top-width').slice(0,-2)) + parseInt($('#sol-'+solId).css('margin-top').slice(0,-2)) + $('#sol-'+solId).height()/2);
  var x2 = parseInt($('#sag-'+sagId).position().left + parseInt($('#sag-'+sagId).css('border-left-width').slice(0,-2)) + parseInt($('#sag-'+sagId).css('margin-left').slice(0,-2)));
  var y2 = parseInt($('#sag-'+sagId).position().top  + parseInt($('#sag-'+sagId).css('border-top-width').slice(0,-2)) + parseInt($('#sag-'+sagId).css('margin-top').slice(0,-2)) + $('#sag-'+sagId).height()/2);

  if(y1 < y2){
    var pom = y1;
    y1 = y2;
    y2 = pom;
    pom = x1;
    x1 = x2;
    x2 = pom;
  }

  var a = Math.abs(x1-x2);
  var b = Math.abs(y1-y2);
  var c;
  var sx = (x1+x2)/2 ;
  var sy = (y1+y2)/2 ;
  var width = Math.sqrt(a*a + b*b ) ;
  var x = sx - width/2;
  var y = sy;

  a = width / 2;

  c = Math.abs(sx-x);

  b = Math.sqrt(Math.abs(x1-x)*Math.abs(x1-x)+Math.abs(y1-y)*Math.abs(y1-y) );

  var cosb = (b*b - a*a - c*c) / (2*a*c);
  var rad = Math.acos(cosb);
  var deg = (rad*180)/Math.PI;

  var htmlns = "http://www.w3.org/1999/xhtml";
  var div = document.createElementNS(htmlns, "div");
  div.setAttribute('style','border:none;border-top:2px solid #57492B;width:'+width+'px;height:0px;transform:rotate('+deg+'deg);position:absolute;top:'+y+'px;left:'+x+'px;');
  div.setAttribute('id','sol-'+solId+'-sag-'+sagId);
  div.setAttribute('class','cizgi');

  document.getElementById(wrapperElementId).appendChild(div);
};

M.L.CizgiSil = function (solId, sagId, wrapperElementId) {
  $('#'+wrapperElementId+' > #sol-'+solId+'-sag-'+sagId).remove();
};

Template.registerHelper('pathWithParam', function(pathName, paramName) {
  var routeParams = {};
  routeParams[paramName] = FlowRouter.getParam(paramName);
  return FlowRouter.path(pathName, routeParams);
});

Template.registerHelper('foreignField', function(collection, id, field) {
  var doc = M.C[collection].findOne({_id: id});
  return doc && doc[field];
});

Template.registerHelper('tarihce', function(collection) {
  var doc = M.C[collection].findOne({_id: FlowRouter.getParam('_id')});
  // TODO: we are using an undocumented hack. convert to nested helper when meteor 1.2 gets released
  return doc && Blaze._globalHelpers.$mapped(doc.versions());
});

Template.registerHelper('formatTel', function(tel) {
  return M.L.formatTel(tel);
});

Template.registerHelper('log', function(obj) {
  console.log(obj);
});

Template.registerHelper('isOdd', function(num) {
  return !!(num%2);
});

Template.registerHelper('parseInt', function(numTxt) {
  return parseInt(numTxt);
});

Template.registerHelper('join', function(/*arguments*/) {
  var args = Array.prototype.slice.call(arguments);
  args.pop();
  return args.join("-");
});

Template.registerHelper('showFilters', function() {
  return !!Session.get('filters');
});

Template.registerHelper('detayPath', function(collection,doc) {
  var pathMap = {
    Users: 'kullaniciDetay',
    Sinavlar: 'sinavDetay',
    Sorular: 'soruDetay',
    Kurumlar: 'kurumDetay',
    Karakterler: 'karakterDetay',
    Dersler: 'dersDetay',
    Mufredat: 'mufredatDetay',
    Muhurler: 'muhurDetay'
  };
  return FlowRouter.path(pathMap[collection], {_id: doc});
});

Template.registerHelper('aktifEgitimYili', function() {
  var aktifEgitimYili = M.C.AktifEgitimYili.findOne({});
  return aktifEgitimYili && M.L.enumLabel(aktifEgitimYili.egitimYili);
});

Template.registerHelper('ilAdi', function(ilce) {
  return M.C.Ilceler.findOne({_id: ilce}).il;
});

Template.registerHelper('ilceAdi', function(ilce) {
  return M.C.Ilceler.findOne({_id: ilce}).ilce;
});

Template.registerHelper('userHasRole', function(role) {
  return M.L.userHasRole(Meteor.userId(),role);
});

Template.registerHelper('enumLabel', function(val) {
  return M.L.enumLabel(val);
});

Template.registerHelper( 'liveTime', function (dateA) {
  var locale = mo.currentLocale.get();
  var result;

  var dateA = mo._getMoment( dateA );
  var dateB = mo.now.get();

  if ( dateA && dateB ) {
    result = dateA.from( dateB );
  }

  return result;
});

Template.registerHelper('userInKurum', function(kurumId) {
  return M.L.userInKurum(Meteor.userId(),kurumId);
});

Template.registerHelper('userFullName', function(userId) {
  check(userId, String);
  var user = M.C.Users.findOne({_id: userId});
  if (!user) {
    return 'Sistem';
  }
  return user.name + ' ' + user.lastName;
});

Template.registerHelper('instance', function() {
  return Template.instance();
});

Template.registerHelper('plusOne', function(num) {
  return parseInt(num) + 1;
});

Template.registerHelper('yeniKayit', function(coll,docId) {
  var doc = M.C[coll].findOne({_id: docId});
  return doc.createdBy === Meteor.userId() && moment(TimeSync.serverTime(null, 5 * 60 * 1000)).isBefore(moment(new Date(doc.createdAt)).add(15,'seconds'))
});

Template.registerHelper('sinavYayinda', function(sinavId) {
  var sinav = M.C.Sinavlar.findOne({
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

Template.registerHelper('sinavBaslamayiBekliyor', function(sinavId) {
  var sinav = M.C.Sinavlar.findOne({
    _id: sinavId,
    iptal: false,
    taslak: false,
    acilisZamani: {$gt: moment(TimeSync.serverTime(null, 5 * 60 * 1000)).toDate()}
  });
  return !!sinav;
});

Template.registerHelper('sinavBaslamaTarihiGecmis', function(sinavId) {
  var sinav = M.C.Sinavlar.findOne({
    _id: sinavId,
    iptal: false,
    taslak: false,
    kilitli: true,
    acilisZamani: {$lt: moment(TimeSync.serverTime(null, 5 * 60 * 1000)).toDate()}
  });
  return !!sinav;
});

Template.registerHelper('sinavRaporlamayaUygun', function(sinavId) {
  var sinav = M.C.Sinavlar.findOne({
    _id: sinavId,
    iptal: false,
    taslak: false,
    kilitli: true,
    kapanisZamani: {$lt: moment(TimeSync.serverTime(null, 5 * 60 * 1000)).subtract(1,'minutes').toDate()}
  });
  return !!sinav;
});

Template.registerHelper('sinavKagidi', function(sinavId) {
  return M.C.SinavKagitlari.findOne({
    ogrenci: Meteor.userId(),
    sinav: sinavId,
    kurum: Meteor.user() && Meteor.user().kurum,
    sinif: Meteor.user() && Meteor.user().sinif,
    egitimYili: M.C.AktifEgitimYili.findOne().egitimYili,
    ogrenciSinavaGirdi: true
  });
});

Template.registerHelper('sinavKapanmis', function(sinavId) {
  var sinav = M.C.Sinavlar.findOne({
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

Template.registerHelper('sinavYanitlariAcilmis', function(sinavId) {
  var sinav = M.C.Sinavlar.findOne({
    _id: sinavId,
    yanitlarAcilmaZamani: {$lt: moment(TimeSync.serverTime(null, 5 * 60 * 1000)).toDate()}
  });
  return !!sinav;
});

Template.registerHelper('sinavYanitlariAcilmamis', function(sinavId) {
  var sinav = M.C.Sinavlar.findOne({
    _id: sinavId,
    yanitlarAcilmaZamani: {$gt: moment(TimeSync.serverTime(null, 5 * 60 * 1000)).toDate()}
  });
  return !!sinav;
});

Template.registerHelper('currentFieldValue', function (fieldName) {
  return AutoForm.getFieldValue(fieldName);
});

Template.registerHelper('toHashCode', function(text) {
  if (_.isObject(text)) {
    text = JSON.stringify(text);
  }
  return text.toString().toHashCode();
});
