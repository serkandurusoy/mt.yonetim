Meteor.startup( () => {
  moment.locale('tr');
  if (Meteor.isClient) {
    mo.setLocale('tr');
  }
});

M.L.ThrowError = e => {
  const {
    error,
    reason,
    details,
  } = e;
  const meteorError = new Meteor.Error(error, reason, details);
  if (Meteor.isClient) {
    return meteorError;
  } else if (Meteor.isServer) {
    throw meteorError;
  }
};

M.L.TestEmail = email => {
  email = email.toString();
  return /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|biz|info|io|aero|edu|de|co\.uk|com\.tr|org\.tr|k12\.tr|bel\.tr|gov\.tr|av\.tr|net\.tr|gen\.tr|edu\.tr|web\.tr)\b$/.test(email);
};

M.L.TestTel = tel => {
  tel = tel.toString();
  return /^[0-9]{10}$/.test(tel) && _.contains(['212','216','222','224','226','228','232','236','242','246','248','252','256','258','262','264','266','272','274','276','282','284','286','288','312','318','322','324','326','328','332','338','342','344','346','348','352','354','356','358','362','364','366','368','370','372','374','376','378','380','382','384','386','388','392','412','414','416','422','424','426','428','432','434','436','438','442','446','452','454','456','458','462','464','466','472','474','476','478','482','484','486','488','800','850','501','505','506','530','531','532','533','534','535','536','537','538','539','540','541','542','543','544','545','546','547','548','549','551','552','553','554','555','556','559'], tel.substring(0,3));
};

M.L.TestSaat = saat => {
  saat = saat.toString();
  return /([01][0-9]|2[0-3]):[0-5][0-9]/.test(saat);
};

M.L.Trim = value => {
  return value.replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "");
};

M.L.TrimButKeepParagraphs = value => {
  return value.replace(/[ \t]+/g, " ").replace(/^[ \t]+|[ \t]+$/g, "");
};

M.L.LatinizeLower = value => {
  return value.replace(/ç/g,'c')
              .replace(/Ç/g,'c')
              .replace(/I/g,'i')
              .replace(/İ/g,'i')
              .replace(/ı/g,'i')
              .replace(/ğ/g,'g')
              .replace(/Ğ/g,'g')
              .replace(/ü/g,'u')
              .replace(/Ü/g,'u')
              .replace(/ş/g,'s')
              .replace(/Ş/g,'s')
              .replace(/ö/g,'o')
              .replace(/Ö/g,'o')
              .toLowerCase();
};

M.L.formatTel = phone => {
  phone = '+90' + phone;
  phone = [phone.slice(0, 3), ' (', phone.slice(3)].join('');
  phone = [phone.slice(0, 8), ') ', phone.slice(8)].join('');
  phone = [phone.slice(0, 13), ' ', phone.slice(13)].join('');
  return phone;
};

M.L.RejectUndefinedFromArray = arr => {
  return _.reject(arr,val => {
    if (_.isUndefined(val)) {
      return true;
    }
  })
};

M.L.FormatSinavSuresi = t => {
  let formattedSure;
  let cd = 24 * 60 * 60 * 1000,
    ch = 60 * 60 * 1000,
    cm = 60 * 1000,
    cs = 1000,
    d = Math.floor(t / cd),
    h = Math.floor((t - d * cd) / ch),
    m = Math.floor((t - d * cd - h * ch) / cm),
    s = Math.round((t - d * cd - h * ch - m * cm ) / cs);

  const pad = n => {
      return n < 10 ? '0' + n : n;
    };
  if (s === 60) {
    m++;
    s = 0;
  }
  if (m === 60) {
    h++;
    m = 0;
  }
  if (h === 24) {
    d++;
    h = 0;
  }
  formattedSure = (d ? d + 'g ' : '') + (h ? h + 's ' : '') + (pad(m)) + ':' + (pad(s));
  return formattedSure;
};

M.L.userHasRole = (userId,role) => {
  check(userId, String);
  check(role, String);

  const user = M.C.Users.findOne({_id: userId});

  return user && user.aktif && user.role === role;
};

M.L.userInKurum = (userId,kurumId) => {
  check(userId, String);
  check(kurumId, String);

  const user = M.C.Users.findOne({_id: userId});
  const kurum = M.C.Kurumlar.findOne({_id: kurumId});

  return user && user.aktif && user.kurum === kurumId && kurum && kurum.aktif;
};

M.L.validatePasswordStrength = (userId,newPass,zorluk) =>{
  check(userId, String);
  check(newPass, String);
  check(zorluk, Match.Optional(String));

  newPass = M.L.Trim(newPass);

  const user = M.C.Users.findOne({_id: userId});
  zorluk = zorluk ? zorluk : user.kurum === 'mitolojix' ? 'kolay' : M.C.Kurumlar.findOne({_id: user.kurum}).sifre;

  const cokKisa = newPass.length < 6;
  const boslukVar = /[ ]/.test(newPass);

  const alfabe = /[A-ZÖÇŞIİĞÜa-zöçşıiğü]/.test(newPass);
  const rakam = /[0-9]/.test(newPass);
  const buyukharf = /[A-ZÖÇŞIİĞÜ]/.test(newPass);
  const kucukharf = /[a-zöçşıiğü]/.test(newPass);
  const noktalama = /[\.\?\+\*\$\-\|_\\\(\)\[\],:;!/&%#'"<>{}"]/.test(newPass);

  if (cokKisa || boslukVar) {
    return false;
  }

  if (zorluk !== 'kolay') {
    if (!alfabe || !rakam) {
      return false;
    }
  }

  if (zorluk === 'zor') {
    if (!buyukharf || !kucukharf || !noktalama) {
      return false;
    }
  }

  return true;

};

M.L.ArraysEqual = (a, b) =>{
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  a.sort();
  b.sort();

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

M.L.cyclicIterator = (array, startAt) => {
  let index = startAt || 0;
  const copy = array.slice(0);

  return {
    getCurrent() {
      return copy[index];
    },

    getNext() {
      index = ++index % copy.length;
      return this.getCurrent();
    },

    getPrevious() {
      if(--index < 0) {
        index += copy.length;
      }
      return this.getCurrent();
    }
  };
};

String.prototype.toLocaleUpperCase = () => {
  return this.replace(/ğ/g, 'Ğ')
    .replace(/ü/g, 'Ü')
    .replace(/ş/g, 'Ş')
    .replace(/ı/g, 'I')
    .replace(/i/g, 'İ')
    .replace(/ö/g, 'Ö')
    .replace(/ç/g, 'Ç')
    .toUpperCase();
};

String.prototype.toLocaleLowerCase = () => {
  return this.replace(/Ğ/g, 'ğ')
    .replace(/Ü/g, 'ü')
    .replace(/Ş/g, 'ş')
    .replace(/I/g, 'ı')
    .replace(/İ/g, 'i')
    .replace(/Ö/g, 'ö')
    .replace(/Ç/g, 'ç')
    .toLowerCase();
};

String.prototype.localeCapitalize = () => {
  return this.charAt(0).toLocaleUpperCase() + this.slice(1).toLocaleLowerCase()
};

String.prototype.localeTitleize = () => {
  let a = this.split(' ');
  for(let i=0;i < a.length; i++) a[i] = a[i].localeCapitalize();
  return a.join(' ');
};

String.prototype.localeSentenceize = () => {
  let capText = this.toLocaleLowerCase();
  capText = capText.replace(/\.\n/g,".[-<br>-]. ");
  capText = capText.replace(/\.\s\n/g,". [-<br>-]. ");
  const wordSplit = '. '; //TODO: buna ? ! falan gibi noktalamalari da eklemek lazim ki yine de boyle bir conversion yapmamak daha dogru sanki
  let wordArray = capText.split(wordSplit);
  const numWords = wordArray.length;
  for(let x=0; x<numWords; x++) {
    wordArray[x] = wordArray[x].replace(wordArray[x].charAt(0),wordArray[x].charAt(0).toLocaleUpperCase());
    if(x==0) {
      capText = wordArray[x]+". ";
    } else if (x != numWords -1) {
      capText = capText+wordArray[x]+". ";
    } else if (x == numWords -1) {
      capText = capText+wordArray[x];
    }
  }
  capText = capText.replace(/\[-<br>-\]\.\s/g,"\n");
  capText = capText.replace(/\si\s/g," I ");
  return capText;
};

String.prototype.toHashCode = () => {
  let hash = 0;
  if (this.length == 0) return hash;
  for (let i = 0; i < this.length; i++) {
    const character = this.charCodeAt(i);
    hash = ((hash<<5)-hash)+character;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};

if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = predicate => {
    if (this === null) {
      throw new TypeError('Array.prototype.findIndex called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    const list = Object(this);
    const length = list.length >>> 0;
    const thisArg = arguments[1];
    let value;

    for (let i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return i;
      }
    }
    return -1;
  };
}
