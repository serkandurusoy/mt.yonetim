Template.soruFavori.onCreated(function() {
  this.subscribe('mufredatlar');
});

Template.soruFavori.helpers({
  sorular: function(){
    var favoriSoruIdArray = _.pluck(M.C.SoruFavorileri.find({createdBy: Meteor.userId()}, {sort: {createdAt: 1}}).fetch(), 'soru');
    var sorularCursor = M.C.Sorular.find({_id: {$in: favoriSoruIdArray}},{sort:{kurum: -1, 'alan.ders': -1}}); //TODO: sort by dersCollate
    return sorularCursor.count() && sorularCursor;
  }
});

Template.soruFavori.events({
  'click [data-trigger="bosalt"]': function(e,t) {
    e.preventDefault();
    Meteor.call('soruFavoriBosalt', function(err,res) {
      if (err) {
        toastr.error(M.E.BilinmeyenHataMessage)
      }
      if (res) {
        toastr.success('Favorilerim listenizdeki tüm sorular boşaltıldı.')
      }
    });
  }
});
