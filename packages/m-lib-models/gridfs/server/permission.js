Security.permit([ 'insert' ]).collections([ M.FS.KurumLogo ]).ifLoggedIn().userHasRole('mitolojix').allowInClientCode();
Security.permit([ 'update' ]).collections([ M.FS.KurumLogo ]).ifLoggedIn().userHasRole('mitolojix').allowInClientCode();
Security.permit([ 'remove' ]).collections([ M.FS.KurumLogo ]).never().allowInClientCode();
Security.permit([ 'download' ]).collections([ M.FS.KurumLogo ]).allowInClientCode();


Security.permit([ 'insert' ]).collections([ M.FS.Avatar ]).ifLoggedIn().userHasRole('mitolojix').allowInClientCode();
Security.permit([ 'update' ]).collections([ M.FS.Avatar ]).ifLoggedIn().userHasRole('mitolojix').allowInClientCode();
Security.permit([ 'insert' ]).collections([ M.FS.Avatar ]).ifLoggedIn().userHasRole('teknik').allowInClientCode();
Security.permit([ 'update' ]).collections([ M.FS.Avatar ]).ifLoggedIn().userHasRole('teknik').allowInClientCode();
Security.permit([ 'insert' ]).collections([ M.FS.Avatar ]).ifLoggedIn().userHasRole('mudur').allowInClientCode();
Security.permit([ 'update' ]).collections([ M.FS.Avatar ]).ifLoggedIn().userHasRole('mudur').allowInClientCode();
Security.permit([ 'insert' ]).collections([ M.FS.Avatar ]).ifLoggedIn().userHasRole('ogretmen').allowInClientCode();
Security.permit([ 'update' ]).collections([ M.FS.Avatar ]).ifLoggedIn().userHasRole('ogretmen').allowInClientCode();
Security.permit([ 'remove' ]).collections([ M.FS.Avatar ]).never().allowInClientCode();
Security.permit([ 'download' ]).collections([ M.FS.Avatar ]).ifLoggedIn().allowInClientCode();


Security.permit([ 'insert' ]).collections([ M.FS.DersIcerik ]).ifLoggedIn().userHasRole('mitolojix').allowInClientCode();
Security.permit([ 'update' ]).collections([ M.FS.DersIcerik ]).ifLoggedIn().userHasRole('mitolojix').allowInClientCode();
Security.permit([ 'insert' ]).collections([ M.FS.DersIcerik ]).ifLoggedIn().userHasRole('teknik').allowInClientCode();
Security.permit([ 'update' ]).collections([ M.FS.DersIcerik ]).ifLoggedIn().userHasRole('teknik').allowInClientCode();
Security.permit([ 'insert' ]).collections([ M.FS.DersIcerik ]).ifLoggedIn().userHasRole('ogretmen').allowInClientCode();
Security.permit([ 'update' ]).collections([ M.FS.DersIcerik ]).ifLoggedIn().userHasRole('ogretmen').allowInClientCode();
Security.permit([ 'remove' ]).collections([ M.FS.DersIcerik ]).never().allowInClientCode();
Security.permit([ 'download' ]).collections([ M.FS.DersIcerik ]).ifLoggedIn().allowInClientCode();


Security.permit([ 'insert' ]).collections([ M.FS.SoruGorsel ]).ifLoggedIn().userHasRole('mitolojix').allowInClientCode();
Security.permit([ 'update' ]).collections([ M.FS.SoruGorsel ]).ifLoggedIn().userHasRole('mitolojix').allowInClientCode();
Security.permit([ 'insert' ]).collections([ M.FS.SoruGorsel ]).ifLoggedIn().userHasRole('teknik').allowInClientCode();
Security.permit([ 'update' ]).collections([ M.FS.SoruGorsel ]).ifLoggedIn().userHasRole('teknik').allowInClientCode();
Security.permit([ 'insert' ]).collections([ M.FS.SoruGorsel ]).ifLoggedIn().userHasRole('ogretmen').allowInClientCode();
Security.permit([ 'update' ]).collections([ M.FS.SoruGorsel ]).ifLoggedIn().userHasRole('ogretmen').allowInClientCode();
Security.permit([ 'remove' ]).collections([ M.FS.SoruGorsel ]).never().allowInClientCode();
Security.permit([ 'download' ]).collections([ M.FS.SoruGorsel ]).ifLoggedIn().allowInClientCode();


Security.permit([ 'insert' ]).collections([ M.FS.Muhur ]).ifLoggedIn().userHasRole('mitolojix').allowInClientCode();
Security.permit([ 'update' ]).collections([ M.FS.Muhur ]).ifLoggedIn().userHasRole('mitolojix').allowInClientCode();
Security.permit([ 'remove' ]).collections([ M.FS.Muhur ]).never().allowInClientCode();
Security.permit([ 'download' ]).collections([ M.FS.Muhur ]).allowInClientCode();


Security.permit([ 'insert' ]).collections([ M.FS.Karakter ]).ifLoggedIn().userHasRole('mitolojix').allowInClientCode();
Security.permit([ 'update' ]).collections([ M.FS.Karakter ]).ifLoggedIn().userHasRole('mitolojix').allowInClientCode();
Security.permit([ 'remove' ]).collections([ M.FS.Karakter ]).never().allowInClientCode();
Security.permit([ 'download' ]).collections([ M.FS.Karakter ]).allowInClientCode();
