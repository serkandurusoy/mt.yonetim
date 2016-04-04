Template.kurumListe.onCreated(function() {
  var template = this;
  template.searchResults = new ReactiveVar();
  template.autorun(function() {
    var keywords = Session.get('keywords');
    if (keywords) {
      Meteor.call('search.kurum',keywords, function(err,res) {
        if (err) {
          toastr.error('Bilinmeyen bir hata oluştu, daha sonra tekrar deneyin.');
          template.searchResults.set({_id: {$in: []}});
        }
        if (res) {
          template.searchResults.set({_id: {$in: res}});
        }
      })
    } else {
      template.searchResults.set({});
    }
  })
});

Template.kurumListe.helpers({
  kurumlar: function(){
    var selector = Template.instance().searchResults.get();
    var kurumlarCursor = M.C.Kurumlar.find(selector,{sort:{isimCollate: 1}});
    return kurumlarCursor.count() && kurumlarCursor;
  }
});
