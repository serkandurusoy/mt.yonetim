Template.soruSepeti.onCreated(function() {
  this.subscribe('mufredatlar');
});

Template.soruSepeti.helpers({
  sorular: function(){
    var sepetSoruIdArray = _.pluck(M.C.SoruSepetleri.find({createdBy: Meteor.userId()}, {sort: {createdAt: 1}}).fetch(), 'soru');
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
        toastr.error('Bir hata oluştu daha sonra veya tek tek çıkarmayı deneyin')
      }
      if (res) {
        toastr.success('Sepetinizdeki tüm sorular boşaltıldı')
      }
    });
  }
});
