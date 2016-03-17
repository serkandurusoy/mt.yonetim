Template.soruSepeti.onCreated(function() {
  this.subscribe('mufredatlar');
});

Template.soruSepeti.helpers({
  sorular: function(){
    var sepetSoruIdArray = _.pluck(M.C.SoruSepetleri.find({createdBy: Meteor.userId()}).fetch(), 'soru');
    //TODO: sort and group by relevant fields
    var sorularCursor = M.C.Sorular.find({_id: {$in: sepetSoruIdArray}});
    return sorularCursor.count() && sorularCursor;
  }
});

Template.soruSepeti.events({
  'click [data-trigger="bosalt"]': function(e,t) {
    e.preventDefault();
    Meteor.call('soruSepetiBosalt', function(err,res) {
      if (err) {
        Materialize.toast('Bir hata oluştu daha sonra veya tek tek çıkarmayı deneyin', M.E.ToastDismiss, 'red')
      }
      if (res) {
        Materialize.toast('Sepetinizdeki tüm sorular boşaltıldı', M.E.ToastDismiss, 'green')
      }
    });
  }
});
