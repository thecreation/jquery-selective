/*! jQuery Selective - v0.1.0 - 2013-07-31
* https://github.com/amazingSurge/jquery-selective
* Copyright (c) 2013 amazingSurge; Licensed GPL */
(function(window, document, $, undefined) {
  "use strict";

  // Constructor
  var Selective = $.Selective = function(element, options) {
    this.el = element;
    this.$el = $(element);

    this.options = $.extend(true, {}, Selective.defaults, options);
  };

  Selective.defaults = {

  };

  Selective.prototype = {

  };

  // Collection method.
  $.fn.selective = function(options) {
    if (typeof options === 'string') {
      var method = options;
      var method_arguments = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : undefined;

      return this.each(function() {
        var api = $.data(this, 'selective');
        if (typeof api[method] === 'function') {
          api[method].apply(api, method_arguments);
        }
      });
    } else {
      return this.each(function() {
        if (!$.data(this, 'selective')) {
          $.data(this, 'selective', new Selective(this, options));
        }
      });
    }
  };
}(window, document, jQuery));
