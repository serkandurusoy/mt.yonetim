M.L.PrintReport = function(res, content, orientation, fileName, reportName) {
  var report = {};
  report.pageSize = 'A4';
  report.pageOrientation = orientation;
  report.pageMargins = [40,80,40,40];
  report.styles = {
    mainFont: {
      fontSize: 10
    },
    smallTableFont: {
      fontSize: 8
    }
  };

  report.content = _.union([
    {text: reportName, bold: true, alignment: 'center', margin: [0,16,0,16], fontSize: 16},
    {
      margin: [0,0,0,20],
      style: 'mainFont',
      table: {
        widths: [70, '*', 70, '*', 70, '*'],
        body: [
          [{text: 'Sınav Adı', bold: true}, {text: res.meta.egitimYili + ' ' + res.meta.sinif + ' ' + res.meta.ders + ' ' + res.meta.sure + ' ' + res.meta.tip + (!!res.meta.aciklama ? ('\n' + res.meta.aciklama) : '') + '\n\n', colSpan: 5},{},{},{},{}],
          [{text: 'Sınav Tarihi', bold: true}, res.meta.testTarihi, {text: 'Katılan', bold: true}, res.stats.kagitSayisi.toString(), {text: 'Soru Sayısı', bold: true}, res.stats.soruSayisi.toString()],
          [{text: 'Zorluk', bold: true}, res.stats.zorluk, {text: 'Ortalama DY', bold: true}, res.stats.ortalamaDY, {text: 'Mod', bold: true}, res.stats.mode],
          [{text: 'Std. Sapma', bold: true}, res.stats.stdSapma, {text: 'Medyan', bold: true}, res.stats.medyan, {text: 'Ranj', bold: true}, res.stats.ranj]
        ]
      },
      layout: {
        hLineWidth: function(i,node) { return 0},
        vLineWidth: function() {return 0},
        hLineColor: function() {return 'black'},
        vLineColor: function() {return 'black'},
        paddingLeft: function(i, node) { return 0; },
        paddingRight: function(i, node) { return 0; },
        paddingTop: function(i, node) { return 4; },
        paddingBottom: function(i, node) { return 4; }
      }
    }
  ], content);

  report.footer = function(currentPage, pageCount) {
    return [{
      margin: [20,0,20,0],
      table: {
        widths:['*','auto','*'],
        body: [
          [
            { text: reportName},
            { text: currentPage.toString() + '/' + pageCount, alignment: 'center'},
            { text: '© UWS - Mitolojix - www.mitolojix.com', alignment: 'right'}
          ]
        ]
      }, layout: {
        hLineWidth: function(i,node) { return i === 0 ? 1 : 0},
        vLineWidth: function() {return 0},
        hLineColor: function() {return 'black'},
        vLineColor: function() {return 'black'},
        paddingLeft: function(i, node) { return 0; },
        paddingRight: function(i, node) { return 0; },
        paddingTop: function(i, node) { return 2; },
        paddingBottom: function(i, node) { return 2; }
      }
    }];
  };

  M.L.getDataUri('/mitolojix-logo-rapor-bg.jpg', function(mitolojixLogo) {
    var marginTop = orientation === 'landscape' ? 100 : 220;
    report.background = function(currentPage, pageCount) {
      return [
        { image: mitolojixLogo, fit: [400,400], alignment: 'center', margin: [0, marginTop, 0, 0] }
      ];
    };

    M.L.getDataUri(res.meta.logo, function(kurumLogo) {
      report.header = function(currentPage, pageCount) {
        return [{
          margin: [20,20,20,20],
          table: {
            widths:['*','*'],
            body: [
              [
                { image: kurumLogo, fit: [50,50] },
                { text: [res.meta.kurum, '\nRapor Tarihi: ' + res.meta.raporTarihi], alignment: 'right', margin: [0,12,0,0]}
              ]
            ]
          }, layout: {
            hLineWidth: function(i,node) { return i === 1 ? 1 : 0},
            vLineWidth: function() {return 0},
            hLineColor: function() {return 'black'},
            vLineColor: function() {return 'black'},
            paddingLeft: function(i, node) { return 0; },
            paddingRight: function(i, node) { return 0; },
            paddingTop: function(i, node) { return 2; },
            paddingBottom: function(i, node) { return 2; }
          }
        }];
      };

      if( /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor) ){
        pdfMake.createPdf(report).download(fileName);
      } else {
        pdfMake.createPdf(report).open();
      }

    })
  })
};

M.L.analizRaporuContent = function(res){
  var content = [];
  var rows = [
    [{text: 'Şube Puan Karşılaştırması', bold: true, alignment: 'center', colSpan: 9}, {}, {}, {}, {}, {}, {}, {}, {}],
    [
      {text: 'Şube', bold: true},
      {text: 'Katılan', bold: true},
      {text: 'END', bold: true, alignment: 'right'},
      {text: 'ENY', bold: true, alignment: 'right'},
      {text: 'ORT', bold: true, alignment: 'right'},
      {text: 'STS', bold: true, alignment: 'right'},
      {text: 'MED', bold: true, alignment: 'right'},
      {text: 'MOD', bold: true, alignment: 'right'},
      {text: 'RNJ', bold: true, alignment: 'right'}
    ]
  ];

  _.each(res.report.subeler, function(row, ix) {
    rows.push([
      {text: res.meta.sinifKisa + row.sube, bold: true},
      {text: row.katilan},
      {text: row.enDusuk, alignment: 'right'},
      {text: row.enYuksek, alignment: 'right'},
      {text: row.ortalama, alignment: 'right'},
      {text: row.stdSapma, alignment: 'right'},
      {text: row.medyan, alignment: 'right'},
      {text: row.mode, alignment: 'right'},
      {text: row.ranj, alignment: 'right'}
    ])
  });

  rows.push([
    {text: 'Genel', bold: true},
    {text: res.report.genel.katilan.toString(), bold: true},
    {text: res.report.genel.enDusuk, alignment: 'right', bold: true},
    {text: res.report.genel.enYuksek, alignment: 'right', bold: true},
    {text: res.report.genel.ortalama, alignment: 'right', bold: true},
    {text: res.report.genel.stdSapma, alignment: 'right', bold: true},
    {text: res.report.genel.medyan, alignment: 'right', bold: true},
    {text: res.report.genel.mode, alignment: 'right', bold: true},
    {text: res.report.genel.ranj, alignment: 'right', bold: true}
  ]);

  var table = [
    {
      margin: [0,0,0,0],
      style: 'mainFont',
      table: {
        widths: ['*', '*', '*', '*', '*', '*', '*', '*', '*'],
        body: rows
      },
      layout:  {
        hLineWidth: function(i, node) {
          return (i === 0 || i === node.table.body.length) ? 0 : 1;
        },
        vLineWidth: function(i, node) { return 0; },
        hLineColor: function(i, node) { return '#aaa'; },
        vLineColor: function(i, node) { return 'black'; },
        paddingLeft: function(i, node) { return 0; },
        paddingRight: function(i, node) { return 0; },
        paddingTop: function(i, node) { return 8; },
        paddingBottom: function(i, node) { return 8; }
      }
    }
  ];

  content.push(table);

  var sinifKarsilastirmalariCanvas = document.createElement('canvas');
  sinifKarsilastirmalariCanvas.width = 1000;
  sinifKarsilastirmalariCanvas.height = 500;

  var sinifKarsilastirmalariData = {
    labels: _.pluck(res.report.grafik.sinifKarsilastirmalari, 'sube'),
    datasets: [
      {
        data: _.pluck(res.report.grafik.sinifKarsilastirmalari, 'ortalama'),
        fillColor: '#3399FF'
      }
    ]
  };

  var sinifKarsilastirmalariChart = new Chart(sinifKarsilastirmalariCanvas.getContext('2d')).Bar(sinifKarsilastirmalariData, {
    animation: false,
    scaleBeginAtZero: true,
    scaleFontSize: 24,
    scaleLineWidth: 4,
    scaleGridLineWidth: 4,
    showTooltips: false,
    barShowStroke: false,
    scaleShowVerticalLines: false
  }).toBase64Image();

  content.push(
    {
      table: {
        headerRows: 1,
        keepWithHeaderRows: 1,
        dontBreakRows: true,
        widths: ['*'],
        body: [
          [{text: 'Şube Karşılaştırmaları', bold: true, alignment: 'center', margin: [0,40,0,0]}],
          [{image: sinifKarsilastirmalariChart, fit: [400,200], alignment: 'center'}]
        ]
      },
      layout: 'noBorders'
    }
  );

  var puanFrekanslariCanvas = document.createElement('canvas');
  puanFrekanslariCanvas.width = 1000;
  puanFrekanslariCanvas.height = 500;

  var puanFrekanslariData = {
    labels: _.pluck(res.report.grafik.puanFrekanslari, 'puan'),
    datasets: [
      {
        data: _.pluck(res.report.grafik.puanFrekanslari, 'ogrenciSayisi'),
        strokeColor: '#3399FF',
        pointColor: '#3399FF'
      }
    ]
  };

  var puanFrekanslariChart = new Chart(puanFrekanslariCanvas.getContext('2d')).Line(puanFrekanslariData, {
    bezierCurve: false,
    animation: false,
    scaleBeginAtZero: true,
    scaleFontSize: 24,
    scaleLineWidth: 4,
    scaleGridLineWidth: 4,
    showTooltips: false,
    scaleShowVerticalLines: false,
    datasetFill: false,
    pointDotRadius: 12,
    datasetStrokeWidth: 4
  }).toBase64Image();

  content.push(
    {
      table: {
        headerRows: 1,
        keepWithHeaderRows: 1,
        dontBreakRows: true,
        widths: ['*'],
        body: [
          [{text: 'Puan Öğrenci Sayısı Frekansları', bold: true, alignment: 'center', margin: [0,40,0,0]}],
          [{image: puanFrekanslariChart, fit: [400,200], alignment: 'center'}]
        ]
      },
      layout: 'noBorders'
    }
  );

  return content;
};

M.L.testMaddeAnaliziContent = function(res) {
  var sayfaBoyu = 25;

  var tamSayfaSayisi = parseInt(res.report.sorular.length/sayfaBoyu);
  var artikSayfa = res.report.sorular.length % sayfaBoyu;

  var sayfaSayisi = tamSayfaSayisi + (!!(artikSayfa) ? 1 : 0);

  var content = [];

  _.each(_.range( sayfaSayisi ), function(sayfa) {
    var rangeEnd = sayfa * sayfaBoyu + ((sayfaSayisi === sayfa + 1) ? (!!artikSayfa ? artikSayfa : sayfaBoyu) : sayfaBoyu);
    var rows = [];

    var header = [
      {text: 'ŞB', bold: true, alignment: 'center', margin: [0,30,0,0]},{text: 'Öğrenci', bold: true, margin: [2,30,0,0]}
    ];
    _.each(_.range( sayfa*sayfaBoyu , rangeEnd ), function(ix) {
      header.push({image: M.L.WriteRotatedText(res.report.sorular[ix].kod), fit:[5,38], alignment: 'center'});
    });
    rows.push(header);

    _.each(res.report.subeler, function(sube) {
      _.each(sube.sinavKagitlari, function(sinavKagidi) {
        var row = [{text: res.meta.sinifKisa + sube.sube, bold: true, alignment: 'center'}];
        row.push({text: sinavKagidi.ogrenci, margin: [2,0,0,0]});
        _.each(_.range( sayfa*sayfaBoyu , rangeEnd ), function(ix) {
          row.push({
            text: sinavKagidi.yanitlar[ix].yanitlandi === 0 ? 'B' : ( (sinavKagidi.yanitlar[ix].dogru === true ? 'D' : 'Y') + (res.meta.tip === 'Alıştırma Testi' ? sinavKagidi.yanitlar[ix].yanitlandi.toString() : '' ) ),
            color: sinavKagidi.yanitlar[ix].yanitlandi === 0 ? 'goldenrod' : (sinavKagidi.yanitlar[ix].dogru === true ? 'gray' : 'darkred'),
            bold: sinavKagidi.yanitlar[ix].yanitlandi === 0 ? true : !sinavKagidi.yanitlar[ix].dogru,
            alignment: 'center'
          });
        });
        rows.push(row);
      })
    });

    var footer = [
      {text: ''},{text: 'Sınıf Bazında Doğru Yüzde', bold: true, alignment: 'right', margin: [0,0,4,0]}
    ];
    _.each(_.range( sayfa*sayfaBoyu , rangeEnd ), function(ix) {
      footer.push({text: res.report.sorular[ix].dogruOran, alignment: 'center', color: res.report.sorular[ix].dogruOran === '100.00' ? 'darkgreen' : (res.report.sorular[ix].dogruOran === '0.00' ? 'darkred' : undefined), bold: true, fontSize: 7, margin: [0,2,0,0]});
    });
    rows.push(footer);

    var widths = [
      22,160
    ];
    _.each(_.range( sayfa*sayfaBoyu , rangeEnd ), function(ix) {
      widths.push(22);
    });

    var table = [
      {
        margin: [0,0,0,20],
        style: 'smallTableFont',
        table: {
          widths: widths,
          body: rows
        },
        layout:  {
          hLineWidth: function(i, node) { return 1; },
          vLineWidth: function(i, node) { return 1; },
          hLineColor: function(i, node) { return '#aaa'; },
          vLineColor: function(i, node) { return '#aaa'; },
          paddingLeft: function(i, node) { return 0; },
          paddingRight: function(i, node) { return 0; },
          paddingTop: function(i, node) { return 4; },
          paddingBottom: function(i, node) { return 4; }
        }
      }
    ];

    content.push(table);

  });

  return content;
};

M.L.testCeldiriciAnaliziContent = function(res) {
  var content = [];
  var rows = [
    [
      {text: 'No', bold: true},
      {text: 'Kod', bold: true},
      {text: 'Tip', bold: true},
      {text: 'ZD', bold: true, alignment: 'center'},
      {text: 'PN', bold: true, alignment: 'right'},
      {text: 'DA', bold: true, alignment: 'right'},
      {text: 'DY', bold: true, alignment: 'right'},
      {text: 'YA', bold: true, alignment: 'right'},
      {text: 'YY', bold: true, alignment: 'right'},
      {text: 'BA', bold: true, alignment: 'right'},
      {text: 'BY', bold: true, alignment: 'right'}
    ]
  ];

  _.each(res.report, function(row, ix) {
    var color = row.dogruOran === '100.00' ? 'darkgreen' : (row.yanlisOran === '100.00' ? 'darkred' : ((row.bosOran === '100.00'&& row.dogruOran === '0.00') ? 'goldenrod' : undefined));
    rows.push([
      {text: (ix+1).toString(), bold: true, color: color},
      {text: row.kod, color: color},
      {text: row.tip, color: color},
      {text: row.zorlukDerecesi.toString(), alignment: 'center', color: color},
      {text: row.puan.toString(), alignment: 'right', color: color},
      {text: row.dogruSayi.toString(), alignment: 'right', color: color},
      {text: row.dogruOran, alignment: 'right', color: color},
      {text: row.yanlisSayi.toString(), alignment: 'right', color: color},
      {text: row.yanlisOran, alignment: 'right', color: color},
      {text: row.bosSayi.toString(), alignment: 'right', color: color},
      {text: row.bosOran, alignment: 'right', color: color}
    ])
  });

  var table = [
    {
      margin: [0,0,0,0],
      style: 'mainFont',
      table: {
        widths: [30, 60, '*', 20, 40, 40, 50, 40, 50, 40, 50],
        body: rows
      },
      layout:  {
        hLineWidth: function(i, node) {
          return (i === 0 || i === node.table.body.length) ? 0 : 1;
        },
        vLineWidth: function(i, node) { return 0; },
        hLineColor: function(i, node) { return '#aaa'; },
        vLineColor: function(i, node) { return 'black'; },
        paddingLeft: function(i, node) { return 0; },
        paddingRight: function(i, node) { return 0; },
        paddingTop: function(i, node) { return 8; },
        paddingBottom: function(i, node) { return 8; }
      }
    }
  ];

  content.push(table);

  return content;
};

M.L.sinifBazindaPuanlarContent = function(res) {
  var content = [];
  var rows = [
    [
      {text: 'Şb', bold: true, alignment: 'center'},
      {text: 'Öğrenci', bold: true},
      {text: 'DA', bold: true, alignment: 'right'},
      {text: 'YA', bold: true, alignment: 'right'},
      {text: 'BA', bold: true, alignment: 'right'},
      {text: 'Nt', bold: true, alignment: 'right'},
      {text: 'Yz', bold: true, alignment: 'right'},
      {text: 'NY', bold: true, alignment: 'right'},
      {text: 'Pn', bold: true, alignment: 'right'},
      {text: 'GS', bold: true, alignment: 'right'},
      {text: 'ŞS', bold: true, alignment: 'right'}
    ]
  ];

  _.each(res.report, function(row) {
    rows.push([
      {text: res.meta.sinifKisa + row.sube, alignment: 'center'},
      {text: row.ogrenci},
      {text: row.dogruYanit.toString(), alignment: 'right'},
      {text: row.yanlisYanit.toString(), alignment: 'right'},
      {text: row.bosYanit.toString(), alignment: 'right'},
      {text: row.net, alignment: 'right'},
      {text: row.yuzde, alignment: 'right'},
      {text: row.netYuzde.toString(), alignment: 'right'},
      {text: row.puan.toString(), alignment: 'right'},
      {text: row.sira.toString(), alignment: 'right'},
      {text: row.subeSira.toString(), alignment: 'right'}
    ]);
  });

  var table = [
    {
      margin: [0,0,0,0],
      style: 'smallTableFont',
      table: {
        widths: [30, '*', 30, 30, 30, 40, 50, 50, 40, 30, 30],
        body: rows
      },
      layout:  {
        hLineWidth: function(i, node) {
          return (i === 0 || i === node.table.body.length) ? 0 : 1;
        },
        vLineWidth: function(i, node) { return 0; },
        hLineColor: function(i, node) { return '#aaa'; },
        vLineColor: function(i, node) { return 'black'; },
        paddingLeft: function(i, node) { return 0; },
        paddingRight: function(i, node) { return 0; },
        paddingTop: function(i, node) { return 4; },
        paddingBottom: function(i, node) { return 4; }
      }
    }
  ];

  content.push(table);

  return content;
};

M.L.subeBazindaPuanlarContent = function(res) {
  var content = [];

  _.each(res.report.subeler, function(sube) {
    var rows = [
      [
        {text: 'Şb', bold: true, alignment: 'center'},
        {text: 'Öğrenci', bold: true},
        {text: 'DA', bold: true, alignment: 'right'},
        {text: 'YA', bold: true, alignment: 'right'},
        {text: 'BA', bold: true, alignment: 'right'},
        {text: 'Nt', bold: true, alignment: 'right'},
        {text: 'Yz', bold: true, alignment: 'right'},
        {text: 'NY', bold: true, alignment: 'right'},
        {text: 'Pn', bold: true, alignment: 'right'},
        {text: 'GS', bold: true, alignment: 'right'},
        {text: 'ŞS', bold: true, alignment: 'right'}
      ]
    ];

    _.each(sube.sinavKagitlari, function(row) {
      rows.push([
        {text: res.meta.sinifKisa + row.sube, alignment: 'center'},
        {text: row.ogrenci},
        {text: row.dogruYanit.toString(), alignment: 'right'},
        {text: row.yanlisYanit.toString(), alignment: 'right'},
        {text: row.bosYanit.toString(), alignment: 'right'},
        {text: row.net, alignment: 'right'},
        {text: row.yuzde, alignment: 'right'},
        {text: row.netYuzde.toString(), alignment: 'right'},
        {text: row.puan.toString(), alignment: 'right'},
        {text: row.sira.toString(), alignment: 'right'},
        {text: row.subeSira.toString(), alignment: 'right'}
      ]);
    });

    rows.push([
      {text: ''},
      {text: 'En Yüksek', bold: true},
      {text: sube.ozet.enYuksek.dogruYanit, alignment: 'right'},
      {text: sube.ozet.enYuksek.yanlisYanit, alignment: 'right'},
      {text: sube.ozet.enYuksek.bosYanit, alignment: 'right'},
      {text: sube.ozet.enYuksek.net, alignment: 'right'},
      {text: sube.ozet.enYuksek.yuzde, alignment: 'right'},
      {text: sube.ozet.enYuksek.netYuzde, alignment: 'right'},
      {text: sube.ozet.enYuksek.puan, alignment: 'right'},
      {text: ''},
      {text: ''}
    ]);

    rows.push([
      {text: ''},
      {text: 'En Düşük', bold: true},
      {text: sube.ozet.enDusuk.dogruYanit, alignment: 'right'},
      {text: sube.ozet.enDusuk.yanlisYanit, alignment: 'right'},
      {text: sube.ozet.enDusuk.bosYanit, alignment: 'right'},
      {text: sube.ozet.enDusuk.net, alignment: 'right'},
      {text: sube.ozet.enDusuk.yuzde, alignment: 'right'},
      {text: sube.ozet.enDusuk.netYuzde, alignment: 'right'},
      {text: sube.ozet.enDusuk.puan, alignment: 'right'},
      {text: ''},
      {text: ''}
    ]);

    rows.push([
      {text: ''},
      {text: 'Ortalama', bold: true},
      {text: sube.ozet.ortalama.dogruYanit, alignment: 'right'},
      {text: sube.ozet.ortalama.yanlisYanit, alignment: 'right'},
      {text: sube.ozet.ortalama.bosYanit, alignment: 'right'},
      {text: sube.ozet.ortalama.net, alignment: 'right'},
      {text: sube.ozet.ortalama.yuzde, alignment: 'right'},
      {text: sube.ozet.ortalama.netYuzde, alignment: 'right'},
      {text: sube.ozet.ortalama.puan, alignment: 'right'},
      {text: ''},
      {text: ''}
    ]);

    rows.push([
      {text: ''},
      {text: 'Mod', bold: true},
      {text: sube.ozet.mod.dogruYanit, alignment: 'right'},
      {text: sube.ozet.mod.yanlisYanit, alignment: 'right'},
      {text: sube.ozet.mod.bosYanit, alignment: 'right'},
      {text: sube.ozet.mod.net, alignment: 'right'},
      {text: sube.ozet.mod.yuzde, alignment: 'right'},
      {text: sube.ozet.mod.netYuzde, alignment: 'right'},
      {text: sube.ozet.mod.puan, alignment: 'right'},
      {text: ''},
      {text: ''}
    ]);

    rows.push([
      {text: ''},
      {text: 'Medyan', bold: true},
      {text: sube.ozet.medyan.dogruYanit, alignment: 'right'},
      {text: sube.ozet.medyan.yanlisYanit, alignment: 'right'},
      {text: sube.ozet.medyan.bosYanit, alignment: 'right'},
      {text: sube.ozet.medyan.net, alignment: 'right'},
      {text: sube.ozet.medyan.yuzde, alignment: 'right'},
      {text: sube.ozet.medyan.netYuzde, alignment: 'right'},
      {text: sube.ozet.medyan.puan, alignment: 'right'},
      {text: ''},
      {text: ''}
    ]);

    rows.push([
      {text: ''},
      {text: 'Ranj', bold: true},
      {text: sube.ozet.ranj.dogruYanit, alignment: 'right'},
      {text: sube.ozet.ranj.yanlisYanit, alignment: 'right'},
      {text: sube.ozet.ranj.bosYanit, alignment: 'right'},
      {text: sube.ozet.ranj.net, alignment: 'right'},
      {text: sube.ozet.ranj.yuzde, alignment: 'right'},
      {text: sube.ozet.ranj.netYuzde, alignment: 'right'},
      {text: sube.ozet.ranj.puan, alignment: 'right'},
      {text: ''},
      {text: ''}
    ]);

    rows.push([
      {text: ''},
      {text: 'Std Sapma', bold: true},
      {text: sube.ozet.stdSapma.dogruYanit, alignment: 'right'},
      {text: sube.ozet.stdSapma.yanlisYanit, alignment: 'right'},
      {text: sube.ozet.stdSapma.bosYanit, alignment: 'right'},
      {text: sube.ozet.stdSapma.net, alignment: 'right'},
      {text: sube.ozet.stdSapma.yuzde, alignment: 'right'},
      {text: sube.ozet.stdSapma.netYuzde, alignment: 'right'},
      {text: sube.ozet.stdSapma.puan, alignment: 'right'},
      {text: ''},
      {text: ''}
    ]);

    rows.push([
      {text: ''},
      {text: 'Ortalama - Std Sapma', bold: true},
      {text: sube.ozet.ortalamaEksiStdSapma.dogruYanit, alignment: 'right'},
      {text: sube.ozet.ortalamaEksiStdSapma.yanlisYanit, alignment: 'right'},
      {text: sube.ozet.ortalamaEksiStdSapma.bosYanit, alignment: 'right'},
      {text: sube.ozet.ortalamaEksiStdSapma.net, alignment: 'right'},
      {text: sube.ozet.ortalamaEksiStdSapma.yuzde, alignment: 'right'},
      {text: sube.ozet.ortalamaEksiStdSapma.netYuzde, alignment: 'right'},
      {text: sube.ozet.ortalamaEksiStdSapma.puan, alignment: 'right'},
      {text: ''},
      {text: ''}
    ]);

    var table = [
      {
        margin: [0,0,0,50],
        style: 'smallTableFont',
        table: {
          widths: [30, '*', 30, 30, 30, 40, 50, 50, 40, 30, 30],
          body: rows
        },
        layout:  {
          hLineWidth: function(i, node) {
            return (i === 0 || i === node.table.body.length) ? 0 : 1;
          },
          vLineWidth: function(i, node) { return 0; },
          hLineColor: function(i, node) { return '#aaa'; },
          vLineColor: function(i, node) { return 'black'; },
          paddingLeft: function(i, node) { return 0; },
          paddingRight: function(i, node) { return 0; },
          paddingTop: function(i, node) { return 4; },
          paddingBottom: function(i, node) { return 4; }
        }
      }
    ];

    content.push(table);
  });

  return content;
};
