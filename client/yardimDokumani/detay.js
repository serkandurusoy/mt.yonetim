Template.yardimDokumaniDetay.helpers({
  yardimDokumani: function() {
    return M.C.YardimDokumanlari.findOne({_id: FlowRouter.getParam('_id')});
  }
});

Template.yardimDokumaniDetayKart.onRendered(function(){
  this.parent().$('.collapsible').collapsible();
});

Template.yardimDokumaniDetayKart.events({
  'click [data-trigger="previewIcerik"]' : function(e,t) {
    e.preventDefault();
    var icerik = this;
    var data = {
      fileName: icerik.name(),
      url: icerik.url()
    };

    var view = Blaze.renderWithData(Template.previewIcerikModal, data, document.getElementsByTagName('main')[0]);

    $('#previewIcerikModal').openModal({
      ready: function() {
        PDFJS.workerSrc = '/packages/pascoual_pdfjs/build/pdf.worker.js';
        var modalWidth = $('#pdfcontainer').width();
        var modalHeight = $('.modal-content').height() - $('.modal-content h4').height() - $('.modal-content a').height();

        var url = data.url;
        var pdfDoc = null,
          pageNum = 1,
          pageRendering = false,
          pageNumPending = null,
          scale = 1,
          canvas = document.getElementById('pdfcanvas'),
          ctx = canvas.getContext('2d');

        function renderPage(num) {
          pageRendering = true;
          pdfDoc.getPage(num).then(function(page) {
            var viewport = page.getViewport(1);
            var ws = modalWidth / viewport.width;
            var hs = modalHeight / viewport.height;
            scale = hs < ws ? hs : ws;
            viewport = page.getViewport(scale);

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            var renderTask = page.render({canvasContext: ctx, viewport: viewport});

            renderTask.promise.then(function () {
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

        PDFJS.getDocument(url).then(function (pdfDoc_) {
          pdfDoc = pdfDoc_;
          document.getElementById('page_count').textContent = pdfDoc.numPages;
          renderPage(pageNum);
        });

      },
      complete: function() {
        Blaze.remove(view);
      }
    });
  }
});
