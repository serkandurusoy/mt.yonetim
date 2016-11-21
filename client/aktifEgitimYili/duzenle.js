import { Template } from 'meteor/templating';

import { AutoForm } from 'meteor/aldeed:autoform';

import { M } from 'meteor/m:lib-core';

import './duzenle.html';

Template.aktifEgitimYili.helpers({
  aktifEgitimYili() {
    return M.C.AktifEgitimYili.findOne();
  }
});

AutoForm.hooks({
  aktifEgitimYiliDuzenleForm: {
    onSuccess(operation, result, template) {
      if (result) {
        toastr.success('Aktif eğitim yılı değiştirildi.');
      }
    }
  }
});
