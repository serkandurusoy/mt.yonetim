Template.aktifEgitimYili.helpers({
  aktifEgitimYili: function() {
    return M.C.AktifEgitimYili.findOne();
  }
});

AutoForm.hooks({
  aktifEgitimYiliDuzenleForm: {
    onSuccess: function(operation, result, template) {
      if (result) {
        Materialize.toast('Aktif eğitim yılı değiştirildi.', M.E.ToastDismiss, 'green');
      }
    }
  }
});
