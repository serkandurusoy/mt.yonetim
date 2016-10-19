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
