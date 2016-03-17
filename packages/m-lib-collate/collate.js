var ilib = Npm.require('ilib');
var Collator = Npm.require('ilib/lib/Collator.js');
var collator = new Collator({locale: 'tr'});
var bin2hex = function (s) {
  var i, l, o = '', n;

  s += '';

  for (i = 0, l = s.length; i < l; i++) {
    n = s.charCodeAt(i)
      .toString(16);
    o += n.length < 2 ? '0' + n : n;
  }

  return o;
};

Collate = function(text) {
  check(text, String);
  return bin2hex(collator.sortKey(text.substr(0, 7)));
};
