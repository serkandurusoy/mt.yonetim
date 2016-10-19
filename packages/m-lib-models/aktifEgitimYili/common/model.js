// TODO: bir onceki egitim yilina donus yapilamamali ve geciste onceki yil icin clean up ve kapanis olmali
M.C.setUpCollection({
  object: 'AktifEgitimYili',
  collection: 'aktifEgitimYili',
  schema: {
    egitimYili: {
      label: 'Aktif eğitim yılını seçin',
      type: String,
      index: 1,
      custom() {
        if (this.isSet) {
          if (!_.contains(M.E.EgitimYili, this.value)) {
            return 'notAllowed';
          }
        }
      },
      autoform: {
        type: 'select-radio',
        options(){
          return M.E.EgitimYiliObjects.map(s => {
            const {
              label,
              name: value,
            } = s;
            return {
              label,
              value,
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
