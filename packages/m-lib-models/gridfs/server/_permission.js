import { Security } from 'meteor/ongoworks:security';

import { M } from 'meteor/m:lib-core';

Security.permit([ 'insert' ]).collections([ M.FS.KurumLogo ]).ifLoggedIn().userHasRole('mitolojix').allowInClientCode();
Security.permit([ 'update' ]).collections([ M.FS.KurumLogo ]).ifLoggedIn().userHasRole('mitolojix').allowInClientCode();
Security.permit([ 'remove' ]).collections([ M.FS.KurumLogo ]).never().allowInClientCode();
//Security.permit([ 'download' ]).collections([ M.FS.KurumLogo ]).allowInClientCode();
M.FS.KurumLogo.allow({
  download(userId, fileObj) {
    return true;
  }
});


Security.permit([ 'insert' ]).collections([ M.FS.Avatar ]).ifLoggedIn().userHasRole('mitolojix').allowInClientCode();
Security.permit([ 'update' ]).collections([ M.FS.Avatar ]).ifLoggedIn().userHasRole('mitolojix').allowInClientCode();
Security.permit([ 'insert' ]).collections([ M.FS.Avatar ]).ifLoggedIn().userHasRole('teknik').allowInClientCode();
Security.permit([ 'update' ]).collections([ M.FS.Avatar ]).ifLoggedIn().userHasRole('teknik').allowInClientCode();
Security.permit([ 'insert' ]).collections([ M.FS.Avatar ]).ifLoggedIn().userHasRole('mudur').allowInClientCode();
Security.permit([ 'update' ]).collections([ M.FS.Avatar ]).ifLoggedIn().userHasRole('mudur').allowInClientCode();
Security.permit([ 'insert' ]).collections([ M.FS.Avatar ]).ifLoggedIn().userHasRole('ogretmen').allowInClientCode();
Security.permit([ 'update' ]).collections([ M.FS.Avatar ]).ifLoggedIn().userHasRole('ogretmen').allowInClientCode();
Security.permit([ 'remove' ]).collections([ M.FS.Avatar ]).never().allowInClientCode();
//Security.permit([ 'download' ]).collections([ M.FS.Avatar ]).ifLoggedIn().allowInClientCode();
M.FS.Avatar.allow({
  download(userId, fileObj) {
    return true;
  }
});


Security.permit([ 'insert' ]).collections([ M.FS.DersIcerik ]).ifLoggedIn().userHasRole('mitolojix').allowInClientCode();
Security.permit([ 'update' ]).collections([ M.FS.DersIcerik ]).ifLoggedIn().userHasRole('mitolojix').allowInClientCode();
Security.permit([ 'insert' ]).collections([ M.FS.DersIcerik ]).ifLoggedIn().userHasRole('teknik').allowInClientCode();
Security.permit([ 'update' ]).collections([ M.FS.DersIcerik ]).ifLoggedIn().userHasRole('teknik').allowInClientCode();
Security.permit([ 'insert' ]).collections([ M.FS.DersIcerik ]).ifLoggedIn().userHasRole('ogretmen').allowInClientCode();
Security.permit([ 'update' ]).collections([ M.FS.DersIcerik ]).ifLoggedIn().userHasRole('ogretmen').allowInClientCode();
Security.permit([ 'remove' ]).collections([ M.FS.DersIcerik ]).never().allowInClientCode();
//Security.permit([ 'download' ]).collections([ M.FS.DersIcerik ]).ifLoggedIn().allowInClientCode();
M.FS.DersIcerik.allow({
  download(userId, fileObj) {
    return true;
  }
});

Security.permit([ 'insert' ]).collections([ M.FS.SoruGorsel ]).ifLoggedIn().userHasRole('mitolojix').allowInClientCode();
Security.permit([ 'update' ]).collections([ M.FS.SoruGorsel ]).ifLoggedIn().userHasRole('mitolojix').allowInClientCode();
Security.permit([ 'insert' ]).collections([ M.FS.SoruGorsel ]).ifLoggedIn().userHasRole('teknik').allowInClientCode();
Security.permit([ 'update' ]).collections([ M.FS.SoruGorsel ]).ifLoggedIn().userHasRole('teknik').allowInClientCode();
Security.permit([ 'insert' ]).collections([ M.FS.SoruGorsel ]).ifLoggedIn().userHasRole('ogretmen').allowInClientCode();
Security.permit([ 'update' ]).collections([ M.FS.SoruGorsel ]).ifLoggedIn().userHasRole('ogretmen').allowInClientCode();
Security.permit([ 'remove' ]).collections([ M.FS.SoruGorsel ]).never().allowInClientCode();
//Security.permit([ 'download' ]).collections([ M.FS.SoruGorsel ]).ifLoggedIn().allowInClientCode();
M.FS.SoruGorsel.allow({
  download(userId, fileObj) {
    return !!userId;
  }
});

Security.permit([ 'insert' ]).collections([ M.FS.Muhur ]).ifLoggedIn().userHasRole('mitolojix').allowInClientCode();
Security.permit([ 'update' ]).collections([ M.FS.Muhur ]).ifLoggedIn().userHasRole('mitolojix').allowInClientCode();
Security.permit([ 'remove' ]).collections([ M.FS.Muhur ]).never().allowInClientCode();
//Security.permit([ 'download' ]).collections([ M.FS.Muhur ]).allowInClientCode();
M.FS.Muhur.allow({
  download(userId, fileObj) {
    return true;
  }
});

Security.permit([ 'insert' ]).collections([ M.FS.Karakter ]).ifLoggedIn().userHasRole('mitolojix').allowInClientCode();
Security.permit([ 'update' ]).collections([ M.FS.Karakter ]).ifLoggedIn().userHasRole('mitolojix').allowInClientCode();
Security.permit([ 'remove' ]).collections([ M.FS.Karakter ]).never().allowInClientCode();
//Security.permit([ 'download' ]).collections([ M.FS.Karakter ]).allowInClientCode();
M.FS.Karakter.allow({
  download(userId, fileObj) {
    return true;
  }
});

Security.permit([ 'insert' ]).collections([ M.FS.YardimDokumani ]).ifLoggedIn().userHasRole('mitolojix').allowInClientCode();
Security.permit([ 'update' ]).collections([ M.FS.YardimDokumani ]).ifLoggedIn().userHasRole('mitolojix').allowInClientCode();
Security.permit([ 'remove' ]).collections([ M.FS.YardimDokumani ]).never().allowInClientCode();
//Security.permit([ 'download' ]).collections([ M.FS.YardimDokumani ]).allowInClientCode();
M.FS.YardimDokumani.allow({
  download(userId, fileObj) {
    return true;
  }
});
