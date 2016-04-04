Template.aktifEgitimYili.helpers({
  aktifEgitimYili: function() {
    return M.C.AktifEgitimYili.findOne();
  }
});

AutoForm.hooks({
  aktifEgitimYiliDuzenleForm: {
    onSuccess: function(operation, result, template) {
      if (result) {
        toastr.success('Aktif eğitim yılı değiştirildi.');
      }
    }
  }
});
