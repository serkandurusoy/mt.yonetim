// TODO: bir onceki egitim yilina donus yapilamamali ve geciste onceki yil icin clean up ve kapanis olmali
M.C.setUpCollection({
  object: 'AktifEgitimYili',
  collection: 'aktifEgitimYili',
  schema: {
    egitimYili: {
      label: 'Aktif eğitim yılını seçin',
      type: String,
      index: 1,
      custom: function() {
        if (this.isSet) {
          var value = this.value;
          if (!_.contains(M.E.EgitimYili, value)) {
            return 'notAllowed';
          }
        }
      },
      autoform: {
        type: 'select-radio',
        options: function(){
          return _.map(M.E.EgitimYiliObjects, function(s) {
            return {
              label: s.label, value: s.name
            };
          });
        }
      }
    }
  },
  permissions: {
    insert: 'nobody',
    update: 'mitolojix'
  }
});
