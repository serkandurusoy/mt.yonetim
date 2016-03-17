Meteor.startup(function() {
  if (Meteor.isServer) {
    if (!gm.isAvailable) {
      console.log(M.E.GraphicsMagickNotInstalledMessage);
    }
  }
});

if (Meteor.isServer) {
  if (gm.isAvailable) {
    var convertToJPG = function(fileObj) {
      return {
        extension: 'jpg',
        type: 'image/jpeg'
      };
    };
    var scaleDownToJPG = function(fileObj, readStream, writeStream) {
      var size = '500';
      gm(readStream, fileObj.name()).compress('JPEG').resize(size, size + '>').stream('JPEG').pipe(writeStream);
    };
    var scaleDownToJPGThumbSquare = function(fileObj, readStream, writeStream) {
      var size = '500';
      gm(readStream, fileObj.name()).autoOrient().compress('JPEG').resize(size, size + '^').gravity('Center').extent(size, size).stream('JPEG').pipe(writeStream);
    };
    var slugifyName = function(fileObj, readStream, writeStream) {
      fileObj.name(s.slugify(fileObj.name().replace(/\.[^/.]+$/, "")) + '.' + fileObj.extension());
      fileObj.type(fileObj.type());
      fileObj.extension(fileObj.extension());
      readStream.pipe(writeStream);
    };
  } else {
    console.log(M.E.GraphicsMagickNotInstalledMessage);
  }
}

M.FS.KurumLogo = new FS.Collection("M.FS.KurumLogo", {
  stores: [new FS.Store.GridFS("kurumLogoStore", { beforeWrite: convertToJPG, transformWrite: scaleDownToJPGThumbSquare })],
  filter: {
    maxSize: M.E.uploadMaxImage,
    allow: {
      contentTypes: ['image/*'],
      extensions: ['png','jpg','jpeg','gif']
    },
    onInvalid: function (message) {
      if (Meteor.isClient) {
        Materialize.toast(M.E.uploadMaxImageMessage, M.E.ToastDismiss, 'red');
      }
    }
  }
});

M.FS.Avatar = new FS.Collection("M.FS.Avatar", {
  stores: [new FS.Store.GridFS("avatarStore", { beforeWrite: convertToJPG, transformWrite: scaleDownToJPGThumbSquare })],
  filter: {
    maxSize: M.E.uploadMaxImage,
    allow: {
      contentTypes: ['image/*'],
      extensions: ['png','jpg','jpeg','gif']
    },
    onInvalid: function (message) {
      if (Meteor.isClient) {
        Materialize.toast(M.E.uploadMaxImageMessage, M.E.ToastDismiss, 'red');
      }
    }
  }
});

M.FS.DersIcerik = new FS.Collection("M.FS.DersIcerik", {
  stores: [new FS.Store.GridFS("dersIcerikStore", {})],
  filter: {
    maxSize: M.E.uploadMaxPDF,
    allow: {
      contentTypes: ['application/pdf'],
      extensions: ['pdf']
    },
    onInvalid: function (message) {
      if (Meteor.isClient) {
        Materialize.toast(M.E.uploadMaxPDFMessage, M.E.ToastDismiss, 'red');
      }
    }
  }
});

M.FS.SoruGorsel = new FS.Collection("M.FS.SoruGorsel", {
  stores: [new FS.Store.GridFS("soruGorselStore", { beforeWrite: convertToJPG, transformWrite: scaleDownToJPG })],
  filter: {
    maxSize: M.E.uploadMaxImage,
    allow: {
      contentTypes: ['image/*'],
      extensions: ['png','jpg','jpeg','gif']
    },
    onInvalid: function (message) {
      if (Meteor.isClient) {
        Materialize.toast(M.E.uploadMaxImageMessage, M.E.ToastDismiss, 'red');
      }
    }
  }
});

M.FS.Muhur = new FS.Collection("M.FS.Muhur", {
  stores: [new FS.Store.GridFS("muhurStore", { transformWrite: slugifyName })],
  filter: {
    maxSize: M.E.uploadMaxImage,
    allow: {
      contentTypes: ['image/*'],
      extensions: ['png','jpg','jpeg','gif']
    },
    onInvalid: function (message) {
      if (Meteor.isClient) {
        Materialize.toast(M.E.uploadMaxImageMessage, M.E.ToastDismiss, 'red');
      }
    }
  }
});

M.FS.Karakter = new FS.Collection("M.FS.Karakter", {
  stores: [new FS.Store.GridFS("karakterStore", { transformWrite: slugifyName })],
  filter: {
    maxSize: M.E.uploadMaxImage,
    allow: {
      contentTypes: ['image/*'],
      extensions: ['png','jpg','jpeg','gif']
    },
    onInvalid: function (message) {
      if (Meteor.isClient) {
        Materialize.toast(M.E.uploadMaxImageMessage, M.E.ToastDismiss, 'red');
      }
    }
  }
});

