import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { $ } from 'meteor/jquery';

import { FlowRouter } from 'meteor/kadira:flow-router';

import { M } from 'meteor/m:lib-core';

import './comments.html';

Template.comments.onCreated(function(){
  const routeName = FlowRouter.getRouteName();
  const doc = FlowRouter.getParam('_id');
  let collection;
  let commentMeta;
  if (routeName === 'sinavDetay') {
    collection = 'Sinavlar';
  }
  if (routeName === 'soruDetay') {
    collection = 'Sorular';
  }
  if (collection) {
    commentMeta =  {collection: collection, doc: doc}
  }
  this.commentMeta = new ReactiveVar(commentMeta);
});

Template.comments.helpers({
  comments() {
    const commentsCursor = M.C.Comments.find(Template.instance().commentMeta.get(), {sort: {createdAt: 1}, fields: {_id: 1, createdBy:1, createdAt: 1, body: 1}});
    return commentsCursor.count() && commentsCursor;
  },
  commentMeta() {
    return Template.instance().commentMeta.get();
  }
});

Template.comment.onRendered(function() {
  //TODO last tooltip seems not to initialize, check this out again!
  this.$('[data-tooltip]').tooltip({delay: 50, position: 'right'});
});

Template.comment.onDestroyed(function(){
  this.$('[data-tooltip]').tooltip('remove');
});

Template.comments.onDestroyed(() => {
  $('.material-tooltip').remove();
});


Template.comment.helpers({
  createdByUser() {
    return M.C.Users.find({_id: this.createdBy}).map(user => {
      user.tooltip = user.name + ' ' + user.lastName + '\n' + (!user.kurum || user.kurum === 'mitolojix' ? 'Mitolojix' : M.C.Kurumlar.findOne({_id: user.kurum}).isim) + '\n' + M.L.enumLabel(user.role)
      return user;
    })[0];
  },
  initialsOptions() {
    const user = M.C.Users.findOne({_id: this._id});
    return user && {
      name: user.name + ' ' + user.lastName,
      height: 250,
      width: 250,
      charCount: 2,
      textColor: '#ffffff',
      fontSize: 80,
      fontWeight: 400,
      radius: 0
    };
  }
});

