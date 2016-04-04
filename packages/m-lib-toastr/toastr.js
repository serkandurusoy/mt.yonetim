/*
 * Toastr
 * Copyright 2012-2015
 * Authors: John Papa, Hans Fjällemark, and Tim Ferrell.
 * All Rights Reserved.
 * Use, reproduction, distribution, and modification of this code is subject to the terms and
 * conditions of the MIT license, available at http://www.opensource.org/licenses/mit-license.php
 *
 * ARIA Support: Greta Krafsig
 *
 * Project: https://github.com/CodeSeven/toastr
 */
/* global define */
(function (define) {
  define(['jquery'], function ($) {
    return (function () {
      var $container;
      var listener;
      var toastrId = 0;
      var toastrType = {
        error: 'error',
        info: 'info',
        success: 'success',
        warning: 'warning'
      };

      var toastr = {
        clear: clear,
        remove: remove,
        error: error,
        getContainer: getContainer,
        info: info,
        options: {},
        subscribe: subscribe,
        success: success,
        version: '2.1.2',
        warning: warning
      };

      var previousToastr;

      return toastr;

      ////////////////

      function error(message, title, optionsOverride) {
        return notify({
          type: toastrType.error,
          iconClass: getOptions().iconClasses.error,
          message: message,
          optionsOverride: optionsOverride,
          title: title
        });
      }

      function getContainer(options, create) {
        if (!options) { options = getOptions(); }
        $container = $('#' + options.containerId);
        if ($container.length) {
          return $container;
        }
        if (create) {
          $container = createContainer(options);
        }
        return $container;
      }

      function info(message, title, optionsOverride) {
        return notify({
          type: toastrType.info,
          iconClass: getOptions().iconClasses.info,
          message: message,
          optionsOverride: optionsOverride,
          title: title
        });
      }

      function subscribe(callback) {
        listener = callback;
      }

      function success(message, title, optionsOverride) {
        return notify({
          type: toastrType.success,
          iconClass: getOptions().iconClasses.success,
          message: message,
          optionsOverride: optionsOverride,
          title: title
        });
      }

      function warning(message, title, optionsOverride) {
        return notify({
          type: toastrType.warning,
          iconClass: getOptions().iconClasses.warning,
          message: message,
          optionsOverride: optionsOverride,
          title: title
        });
      }

      function clear($toastrElement, clearOptions) {
        var options = getOptions();
        if (!$container) { getContainer(options); }
        if (!clearToastr($toastrElement, options, clearOptions)) {
          clearContainer(options);
        }
      }

      function remove($toastrElement) {
        var options = getOptions();
        if (!$container) { getContainer(options); }
        if ($toastrElement && $(':focus', $toastrElement).length === 0) {
          removeToastr($toastrElement);
          return;
        }
        if ($container.children().length) {
          $container.remove();
        }
      }

      // internal functions

      function clearContainer (options) {
        var toastrsToClear = $container.children();
        for (var i = toastrsToClear.length - 1; i >= 0; i--) {
          clearToastr($(toastrsToClear[i]), options);
        }
      }

      function clearToastr ($toastrElement, options, clearOptions) {
        var force = clearOptions && clearOptions.force ? clearOptions.force : false;
        if ($toastrElement && (force || $(':focus', $toastrElement).length === 0)) {
          $toastrElement[options.hideMethod]({
            duration: options.hideDuration,
            easing: options.hideEasing,
            complete: function () { removeToastr($toastrElement); }
          });
          return true;
        }
        return false;
      }

      function createContainer(options) {
        $container = $('<div/>')
          .attr('id', options.containerId)
          .addClass(options.positionClass)
          .attr('aria-live', 'polite')
          .attr('role', 'alert');

        $container.appendTo($(options.target));
        return $container;
      }

      function getDefaults() {
        return {
          tapToDismiss: true,
          toastrClass: 'toastr',
          containerId: 'toastr-container',
          debug: false,

          showMethod: 'fadeIn', //fadeIn, slideDown, and show are built into jQuery
          showDuration: 300,
          showEasing: 'swing', //swing and linear are built into jQuery
          onShown: undefined,
          hideMethod: 'fadeOut',
          hideDuration: 1000,
          hideEasing: 'swing',
          onHidden: undefined,
          closeMethod: false,
          closeDuration: false,
          closeEasing: false,

          extendedTimeOut: 1000,
          iconClasses: {
            error: 'toastr-error',
            info: 'toastr-info',
            success: 'toastr-success',
            warning: 'toastr-warning'
          },
          iconClass: 'toastr-info',
          positionClass: 'toastr-top-right',
          timeOut: 5000, // Set timeOut and extendedTimeOut to 0 to make it sticky
          titleClass: 'toastr-title',
          messageClass: 'toastr-message',
          escapeHtml: false,
          target: 'body',
          closeHtml: '<button type="button">&times;</button>',
          newestOnTop: true,
          preventDuplicates: false,
          progressBar: false
        };
      }

      function publish(args) {
        if (!listener) { return; }
        listener(args);
      }

      function notify(map) {
        var options = getOptions();
        var iconClass = map.iconClass || options.iconClass;

        if (typeof (map.optionsOverride) !== 'undefined') {
          options = $.extend(options, map.optionsOverride);
          iconClass = map.optionsOverride.iconClass || iconClass;
        }

        if (shouldExit(options, map)) { return; }

        toastrId++;

        $container = getContainer(options, true);

        var intervalId = null;
        var $toastrElement = $('<div/>');
        var $titleElement = $('<div/>');
        var $messageElement = $('<div/>');
        var $progressElement = $('<div/>');
        var $closeElement = $(options.closeHtml);
        var progressBar = {
          intervalId: null,
          hideEta: null,
          maxHideTime: null
        };
        var response = {
          toastrId: toastrId,
          state: 'visible',
          startTime: new Date(),
          options: options,
          map: map
        };

        personalizeToastr();

        displayToastr();

        handleEvents();

        publish(response);

        if (options.debug && console) {
          console.log(response);
        }

        return $toastrElement;

        function escapeHtml(source) {
          if (source == null)
            source = "";

          return new String(source)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        }

        function personalizeToastr() {
          setIcon();
          setTitle();
          setMessage();
          setCloseButton();
          setProgressBar();
          setSequence();
        }

        function handleEvents() {
          $toastrElement.hover(stickAround, delayedHideToastr);
          if (!options.onclick && options.tapToDismiss) {
            $toastrElement.click(hideToastr);
          }

          if (options.closeButton && $closeElement) {
            $closeElement.click(function (event) {
              if (event.stopPropagation) {
                event.stopPropagation();
              } else if (event.cancelBubble !== undefined && event.cancelBubble !== true) {
                event.cancelBubble = true;
              }
              hideToastr(true);
            });
          }

          if (options.onclick) {
            $toastrElement.click(function (event) {
              options.onclick(event);
              hideToastr();
            });
          }
        }

        function displayToastr() {
          $toastrElement.hide();

          $toastrElement[options.showMethod](
            {duration: options.showDuration, easing: options.showEasing, complete: options.onShown}
          );

          if (options.timeOut > 0) {
            intervalId = setTimeout(hideToastr, options.timeOut);
            progressBar.maxHideTime = parseFloat(options.timeOut);
            progressBar.hideEta = new Date().getTime() + progressBar.maxHideTime;
            if (options.progressBar) {
              progressBar.intervalId = setInterval(updateProgress, 10);
            }
          }
        }

        function setIcon() {
          if (map.iconClass) {
            $toastrElement.addClass(options.toastrClass).addClass(iconClass);
          }
        }

        function setSequence() {
          if (options.newestOnTop) {
            $container.prepend($toastrElement);
          } else {
            $container.append($toastrElement);
          }
        }

        function setTitle() {
          if (map.title) {
            $titleElement.append(!options.escapeHtml ? map.title : escapeHtml(map.title)).addClass(options.titleClass);
            $toastrElement.append($titleElement);
          }
        }

        function setMessage() {
          if (map.message) {
            $messageElement.append(!options.escapeHtml ? map.message : escapeHtml(map.message)).addClass(options.messageClass);
            $toastrElement.append($messageElement);
          }
        }

        function setCloseButton() {
          if (options.closeButton) {
            $closeElement.addClass('toastr-close-button').attr('role', 'button');
            $toastrElement.prepend($closeElement);
          }
        }

        function setProgressBar() {
          if (options.progressBar) {
            $progressElement.addClass('toastr-progress');
            $toastrElement.prepend($progressElement);
          }
        }

        function shouldExit(options, map) {
          if (options.preventDuplicates) {
            if (map.message === previousToastr) {
              return true;
            } else {
              previousToastr = map.message;
            }
          }
          return false;
        }

        function hideToastr(override) {
          var method = override && options.closeMethod !== false ? options.closeMethod : options.hideMethod;
          var duration = override && options.closeDuration !== false ?
            options.closeDuration : options.hideDuration;
          var easing = override && options.closeEasing !== false ? options.closeEasing : options.hideEasing;
          if ($(':focus', $toastrElement).length && !override) {
            return;
          }
          clearTimeout(progressBar.intervalId);
          return $toastrElement[method]({
            duration: duration,
            easing: easing,
            complete: function () {
              removeToastr($toastrElement);
              if (options.onHidden && response.state !== 'hidden') {
                options.onHidden();
              }
              response.state = 'hidden';
              response.endTime = new Date();
              publish(response);
            }
          });
        }

        function delayedHideToastr() {
          if (options.timeOut > 0 || options.extendedTimeOut > 0) {
            intervalId = setTimeout(hideToastr, options.extendedTimeOut);
            progressBar.maxHideTime = parseFloat(options.extendedTimeOut);
            progressBar.hideEta = new Date().getTime() + progressBar.maxHideTime;
          }
        }

        function stickAround() {
          clearTimeout(intervalId);
          progressBar.hideEta = 0;
          $toastrElement.stop(true, true)[options.showMethod](
            {duration: options.showDuration, easing: options.showEasing}
          );
        }

        function updateProgress() {
          var percentage = ((progressBar.hideEta - (new Date().getTime())) / progressBar.maxHideTime) * 100;
          $progressElement.width(percentage + '%');
        }
      }

      function getOptions() {
        return $.extend({}, getDefaults(), toastr.options);
      }

      function removeToastr($toastrElement) {
        if (!$container) { $container = getContainer(); }
        if ($toastrElement.is(':visible')) {
          return;
        }
        $toastrElement.remove();
        $toastrElement = null;
        if ($container.children().length === 0) {
          $container.remove();
          previousToastr = undefined;
        }
      }

    })();
  });
}(typeof define === 'function' && define.amd ? define : function (deps, factory) {
  if (typeof module !== 'undefined' && module.exports) { //Node
    module.exports = factory(require('jquery'));
  } else {
    window.toastr = factory(window.jQuery);
  }
}));
