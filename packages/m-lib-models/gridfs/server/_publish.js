import { M } from 'meteor/m:lib-core';
import { publishComposite } from 'meteor/reywood:publish-composite';

publishComposite(null, function() {
  return {
    find() {
      if (this.userId && !M.L.userHasRole(this.userId, 'ogrenci')) {
        return M.FS.KurumLogo.find();
      }
    }
  };
});

publishComposite(null, function() {
  return {
    find() {
      if (this.userId && !M.L.userHasRole(this.userId, 'ogrenci')) {
        return M.FS.Avatar.find();
      }
    }
  };
});

// TODO: dersicerik requires metadata to optimize its publish so we need an (after) insert/update hook on mufredat to track all file instances to update them with metadata (kurum, ders, konu, mufredatId etc)
// TODO: or we can use autoform metadata helper to get info but that info must be available or the file upload be disabled until that
publishComposite('fsdersicerik', function() {
  return {
    find() {
      if (this.userId) {
        return M.FS.DersIcerik.find();
      }
    }
  };
});

// TODO: sorugorsel requires metadata to optimize its publish so we need an (after) insert/update hook on mufredat to track all file instances to update them with metadata (kurum, ders, soruId etc)
// TODO: or we can use autoform metadata helper to get info but that info must be available or the file upload be disabled until that
publishComposite('fssorugorsel', function() {
  return {
    find() {
      if (this.userId) {
        return M.FS.SoruGorsel.find();
      }
    }
  };
});

publishComposite(null, function() {
  return {
    find() {
      if (this.userId) {
        return M.FS.Muhur.find();
      }
    }
  };
});

publishComposite(null, function() {
  return {
    find() {
      if (this.userId) {
        return M.FS.Karakter.find();
      }
    }
  };
});

publishComposite(null, function() {
  return {
    find() {
      if (this.userId) {
        return M.FS.YardimDokumani.find();
      }
    }
  };
});
