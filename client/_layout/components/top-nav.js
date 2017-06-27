import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import { Blaze } from 'meteor/blaze';
import { $ } from 'meteor/jquery';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import { PDFJS } from 'meteor/pascoual:pdfjs';

import { M } from 'meteor/m:lib-core';

import './top-nav.html';

Template.topnav.onCreated(function() {
  this.searching = new ReactiveVar(false);
});

Template.topnav.helpers({
  'searching'() {
    return Template.instance().searching.get();
  }
});

Template.topmenu.onCreated(function() {
  const self = this;
  const favicon = new Favico({
    animation:'slide'/*,
     elementId: 'favico'*/
  });
  self.autorun(() => {
    let count = 0;
    M.C.Notifications.find().forEach(nt => {
      count += nt.count;
    });
    favicon.badge(count);
  });
});

Template.topmenu.onRendered(function() {
  this.$('[data-activates^="notifications"]').dropdown({
    constrain_width: false,
    belowOrigin: true
  });
  this.$('[data-activates="yardim-menu"]').dropdown({
    constrain_width: false,
    belowOrigin: true
  });
  this.$('[data-activates="user-menu"]').dropdown({
    constrain_width: false,
    belowOrigin: true
  });
  this.$('[data-activates="sidenav"]').sideNav({
    menuWidth: 240,
    edge: 'left',
    closeOnClick: window.matchMedia("only screen and (max-width : 992px)").matches
  });

});

Template.topmenu.helpers({
  kurumIsmi() {
    const kurum = Meteor.user() && Meteor.user().kurum;
    return kurum === 'mitolojix' ? 'Mitolojix' : M.C.Kurumlar.findOne({_id: kurum}) && M.C.Kurumlar.findOne({_id: kurum}).isim;
  },
  notifications() {
    const cursor = M.C.Notifications.find({},{sort: {at: -1}});
    return cursor.count() && cursor;
  },
  yardimDokumanlari() {
    const cursor = M.C.YardimDokumanlari.find({aktif: true},{sort: {isim: 1}});
    return cursor.count() && cursor;
  },
  searchableRoute() {
    const route = FlowRouter.getRouteName();
    const searchableRoutes = [
      'kullaniciListe',
      'kurumListe',
      'mufredatListe',
      'muhurListe',
      'soruListe',
      'sinavListe',
      'soruSepeti',
      'soruFavori'
    ];
    return searchableRoutes.includes(route);
  }
});

Template.notification.onRendered(() => {
  $('[data-activates^="notifications"]').dropdown({
    constrain_width: false,
    belowOrigin: true
  });
});

Template.notification.events({
  'click [data-trigger="notification-sil"]'(e,t) {
    M.C.Notifications.remove({_id: t.data._id});
  }
});

Template.topmenu.events({
  'click [data-trigger="notification-temizle"]'(e,t) {
    M.C.Notifications.find({to: Meteor.userId()}, {fields: {_id: 1}}).forEach(notification => {
      M.C.Notifications.remove({_id: notification._id});
    });
  },
  'click [data-activates="searchbox"]'(e,t) {
    e.preventDefault();
    t.parent().searching.set(true);
    Session.set('filters', {});
  },
  'click [data-logout]'(e,t) {
    Meteor.logout();
  }
});

Template.searchbox.onRendered(function() {
  const template = this;
  const oldRoute = FlowRouter.getRouteName();
  template.$('input').focus();
  template.autorun(() => {
    const newRoute = FlowRouter.getRouteName();
    if (oldRoute !== newRoute && template.parent().searching.get() === true) {
      template.parent().searching.set(false);
      M.L.clearSessionVariable('keywords');
      M.L.clearSessionVariable('filters');
    }
  });
});

Template.searchbox.events({
  'click [data-activates="topmenu"]'(e,t) {
    e.preventDefault();
    t.parent().searching.set(false);
    M.L.clearSessionVariable('keywords');
    M.L.clearSessionVariable('filters');
  },
  'keyup input'(e,t) {
    e.preventDefault();
    if (e.which === 27) {
      t.parent().searching.set(false);
      M.L.clearSessionVariable('keywords');
      M.L.clearSessionVariable('filters');
    }
  },
  'submit form, click [data-trigger="submit"]'(e,t) {
    e.preventDefault();
    const keywords = M.L.Trim(t.$('input').val());
    Session.set('keywords', keywords);
  }
});

Template.searchbox.onDestroyed(function() {
  M.L.clearSessionVariable('keywords');
  M.L.clearSessionVariable('filters');
});

Template.yardimDokumani.events({
  'click [data-trigger="previewIcerik"]'(e,t) {
    e.preventDefault();
    const icerik = this;
    const data = {
      fileName: icerik.name(),
      url: icerik.url({auth: false})
    };

    const view = Blaze.renderWithData(Template.previewIcerikModal, data, document.getElementsByTagName('main')[0]);

    $('#previewIcerikModal').openModal({
      ready() {
        PDFJS.workerSrc = '/packages/pascoual_pdfjs/build/pdf.worker.js';
        const modalWidth = $('#pdfcontainer').width();
        const modalHeight = $('.modal-content').height() - $('.modal-content h4').height() - $('.modal-content a').height();

        const url = data.url;
        let pdfDoc = null,
          pageNum = 1,
          pageRendering = false,
          pageNumPending = null,
          scale = 1,
          canvas = document.getElementById('pdfcanvas');
        const ctx = canvas.getContext('2d');

        function renderPage(num) {
          pageRendering = true;
          pdfDoc.getPage(num).then(page => {
            let viewport = page.getViewport(1);
            const ws = modalWidth / viewport.width;
            const hs = modalHeight / viewport.height;
            scale = hs < ws ? hs : ws;
            viewport = page.getViewport(scale);

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderTask = page.render({canvasContext: ctx, viewport: viewport});

            renderTask.promise.then(() => {
              pageRendering = false;
              if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
              }
            });
          });

          document.getElementById('page_num').textContent = pageNum;
        }

        function queueRenderPage(num) {
          if (pageRendering) {
            pageNumPending = num;
          } else {
            renderPage(num);
          }
        }

        function onPrevPage() {
          if (pageNum <= 1) {
            return;
          }
          pageNum--;
          queueRenderPage(pageNum);
        }
        document.getElementById('prev').addEventListener('click', onPrevPage);

        function onNextPage() {
          if (pageNum >= pdfDoc.numPages) {
            return;
          }
          pageNum++;
          queueRenderPage(pageNum);
        }
        document.getElementById('next').addEventListener('click', onNextPage);

        PDFJS.getDocument(url).then(pdfDoc_ => {
          pdfDoc = pdfDoc_;
          document.getElementById('page_count').textContent = pdfDoc.numPages;
          renderPage(pageNum);
        });

      },
      complete() {
        Blaze.remove(view);
      }
    });
  }
});
