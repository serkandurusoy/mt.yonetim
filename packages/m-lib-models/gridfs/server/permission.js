M.FS.KurumLogo.files.permit('insert').ifLoggedIn().userHasRole('mitolojix').apply();
M.FS.KurumLogo.files.permit('update').ifLoggedIn().userHasRole('mitolojix').apply();
M.FS.KurumLogo.files.permit('remove').never().apply();

M.FS.KurumLogo.allow({
  download: function(userId, fileObj) {
    return true;
  }
});

M.FS.Avatar.files.permit('insert').ifLoggedIn().userHasRole('mitolojix').apply();
M.FS.Avatar.files.permit('update').ifLoggedIn().userHasRole('mitolojix').apply();
M.FS.Avatar.files.permit('insert').ifLoggedIn().userHasRole('teknik').apply();
M.FS.Avatar.files.permit('update').ifLoggedIn().userHasRole('teknik').apply();
M.FS.Avatar.files.permit('insert').ifLoggedIn().userHasRole('mudur').apply();
M.FS.Avatar.files.permit('update').ifLoggedIn().userHasRole('mudur').apply();
M.FS.Avatar.files.permit('insert').ifLoggedIn().userHasRole('ogretmen').apply();
M.FS.Avatar.files.permit('update').ifLoggedIn().userHasRole('ogretmen').apply();
M.FS.Avatar.files.permit('remove').never().apply();

M.FS.Avatar.allow({
  download: function(userId, fileObj) {
    return !!userId;
  }
});

M.FS.DersIcerik.files.permit('insert').ifLoggedIn().userHasRole('mitolojix').apply();
M.FS.DersIcerik.files.permit('update').ifLoggedIn().userHasRole('mitolojix').apply();
M.FS.DersIcerik.files.permit('insert').ifLoggedIn().userHasRole('teknik').apply();
M.FS.DersIcerik.files.permit('update').ifLoggedIn().userHasRole('teknik').apply();
M.FS.DersIcerik.files.permit('insert').ifLoggedIn().userHasRole('ogretmen').apply();
M.FS.DersIcerik.files.permit('update').ifLoggedIn().userHasRole('ogretmen').apply();
M.FS.DersIcerik.files.permit('remove').never().apply();

M.FS.DersIcerik.allow({
  download: function(userId, fileObj) {
    return !!userId;
  }
});

M.FS.SoruGorsel.files.permit('insert').ifLoggedIn().userHasRole('mitolojix').apply();
M.FS.SoruGorsel.files.permit('update').ifLoggedIn().userHasRole('mitolojix').apply();
M.FS.SoruGorsel.files.permit('insert').ifLoggedIn().userHasRole('teknik').apply();
M.FS.SoruGorsel.files.permit('update').ifLoggedIn().userHasRole('teknik').apply();
M.FS.SoruGorsel.files.permit('insert').ifLoggedIn().userHasRole('ogretmen').apply();
M.FS.SoruGorsel.files.permit('update').ifLoggedIn().userHasRole('ogretmen').apply();
M.FS.SoruGorsel.files.permit('remove').never().apply();

M.FS.SoruGorsel.allow({
  download: function(userId, fileObj) {
    return !!userId;
  }
});

M.FS.Muhur.files.permit('insert').ifLoggedIn().userHasRole('mitolojix').apply();
M.FS.Muhur.files.permit('update').ifLoggedIn().userHasRole('mitolojix').apply();
M.FS.Muhur.files.permit('remove').never().apply();

M.FS.Muhur.allow({
  download: function(userId, fileObj) {
    return true;
  }
});

M.FS.Karakter.files.permit('insert').ifLoggedIn().userHasRole('mitolojix').apply();
M.FS.Karakter.files.permit('update').ifLoggedIn().userHasRole('mitolojix').apply();
M.FS.Karakter.files.permit('remove').never().apply();

M.FS.Karakter.allow({
  download: function(userId, fileObj) {
    return true;
  }
});

