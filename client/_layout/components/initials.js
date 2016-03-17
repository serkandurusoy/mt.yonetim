// https://github.com/judesfernando/initial.js
(function ($) {
  $.fn.initial = function (options) {

    return this.each(function () {

      var e = $(this);
      var settings = $.extend({
        // Default settings
        name: 'Name',
        textColor: '#ffffff',
        height: 100,
        width: 100,
        fontSize: 60,
        fontWeight: 400,
        fontFamily: 'HelveticaNeue-Light,Helvetica Neue Light,Helvetica Neue,Helvetica, Arial,Lucida Grande, sans-serif',
        radius: 0
      }, options);

      // overriding from data attributes
      settings = $.extend(settings, e.data());

      // making the text object
      var allInitials = s.words(settings.name).map(function (s) { return s.charAt(0); }).join('').toLocaleUpperCase();
      var first = _.first(allInitials);
      var last = _.last(allInitials);
      var c = first + last;
      var cobj = $('<text text-anchor="middle"></text>').attr({
        'y': '50%',
        'x': '50%',
        'dy' : '0.35em',
        'pointer-events':'auto',
        'fill': settings.textColor,
        'font-family': settings.fontFamily
      }).html(c).css({
        'font-weight': settings.fontWeight,
        'font-size': settings.fontSize+'px',
      });

      var stringToColor = function(str) {
        for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));
        for (var i = 0, colour = "#"; i < 3; colour += ("00" + ((hash >> i++ * 8) & 0xFF).toString(16)).slice(-2));
        return colour;
      };

      var color = stringToColor(settings.name);

      var svg = $('<svg></svg>').attr({
        'xmlns': 'http://www.w3.org/2000/svg',
        'pointer-events':'none',
        'width': settings.width,
        'height': settings.height
      }).css({
        'background-color': color,
        'width': settings.width+'px',
        'height': settings.height+'px',
        'border-radius': settings.radius+'px',
        '-moz-border-radius': settings.radius+'px'
      });

      svg.append(cobj);
      // svg.append(group);
      var svgHtml = window.btoa(unescape(encodeURIComponent($('<div>').append(svg.clone()).html())));

      e.attr("src", 'data:image/svg+xml;base64,' + svgHtml);

    })
  };

}(jQuery));
