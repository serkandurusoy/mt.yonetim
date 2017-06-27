import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Blaze } from 'meteor/blaze';
import { _ } from 'meteor/underscore';
import { $ } from 'meteor/jquery';

import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { PDFJS } from 'meteor/pascoual:pdfjs';

import { M } from 'meteor/m:lib-core';

import './detay.html';
import './detayKart.html';

Template.mufredatDetay.onCreated(function() {
  this.autorun(()=> {
    this.subscribe('mufredat', FlowRouter.getParam('_id'));
    this.subscribe('fsdersicerik');
  });
});

Template.mufredatDetay.helpers({
  mufredat() {
    return M.C.Mufredat.findOne({_id: FlowRouter.getParam('_id')});
  }
});

Template.mufredatDetayKart.onRendered(function(){
  this.parent().$('.collapsible').collapsible();
});

Template.mufredatDetayKart.events({
  'click [data-trigger="clone"]'(e,t) {
    let doc = t.data;
    doc = _.extend(_.pick(doc, 'kurum', 'egitimYili', 'ders', 'sinif', 'konular', 'aktif'), {_clonedFrom: {_id: doc._id, _version: doc._version}});
    Session.set('mufredatClone',doc);
    FlowRouter.go('mufredatYeni');
  },
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
          canvas = document.getElementById('pdfcanvas'),
          ctx = canvas.getContext('2d');

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

        PDFJS.getDocument(url).then( pdfDoc_ => {
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
