import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { FlowRouter } from 'meteor/kadira:flow-router';
import { AutoForm } from 'meteor/aldeed:autoform';

import { M } from 'meteor/m:lib-core';

import './yeni.html';

Template.soruYeni.onCreated(function() {
  this.subscribe('mufredatlar');
  this.subscribe('fssorugorsel');
  this.data.soruClone = Session.get('soruClone');
  M.L.clearSessionVariable('soruClone');
});


Template.soruFormFields.helpers({
  selectedSinifHasMufredatForDers(){
    const formId = AutoForm.getFormId();
    const kurum = Meteor.user().role !== 'mitolojix' ? Meteor.user().kurum : AutoForm.getFieldValue('kurum', formId);
    const ders = AutoForm.getFieldValue('alan.ders', formId);
    const sinif = AutoForm.getFieldValue('alan.sinif', formId);
    const mufredat = M.C.Mufredat.findOne({kurum, egitimYili: M.C.AktifEgitimYili.findOne().egitimYili, ders, sinif});

    return !!mufredat;
  }
});

AutoForm.hooks({
  soruYeniForm: {
    onSuccess(operation, result, template) {
      if (result) {
        FlowRouter.go('soruDetay', {_id: result});
      }
    }
  }
});
