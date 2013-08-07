/*! jQuery Selective - v0.1.0 - 2013-08-07
* https://github.com/amazingSurge/jquery-selective
* Copyright (c) 2013 amazingSurge; Licensed GPL */
(function(window, document, $, undefined) {
  "use strict";

  // Constructor
  var Selective = $.Selective = function(element, options) {
    this.el = element;
    this.$el = $(element).css({
      display: 'none'
    }) || $('<div></div>');

    this.options = $.extend(true, {}, Selective.defaults, options);
    this.$options = this.$el.find('option');
    // this.$optgroups = this.$el.find('optgroup');

    this.namespace = this.options.namespace;

    // flag
    this.opened = false;

    this.init();
  };

  Selective.defaults = {
    namespace: 'selective',
    multiple: false,
    withSearch: true,
    insertLocation: 'before', // before | after
    tpl: {
      item: function(content) {
        return '<li>' + content + '</li>';
      },
      listItem: function(content) {
        return '<li>' + content + '</li>';
      },
      trigger: function() {
        return '<button>Add</button>';
      },
      search: function() {
        return '<input type="text" placeholder="Search...">';
      }
    }

  };

  Selective.prototype = {
    constructor: Selective,
    init: function() {
      var frame = '<div class="' + this.namespace + '">' +
        '<ul class="' + this.namespace + '-items"></ul>' +
        '<div class="' + this.namespace + '-tragger">' +
        this.options.tpl.trigger() +
        '</div>' +
        '<div class="' + this.namespace + '-dropdown">' +
        '<ul class="' + this.namespace + '-list"></ul>' +
        '</div>' +
        '</div>';

      this.$select = $(frame);

      if (this.options.withSearch) {
        this.$select.find('.' + this.namespace + '-dropdown').prepend(this.options.tpl.search());
      }

      if (this.$options.length !== 0) {
        var list = this.$select.find('.' + this.namespace + '-list');
        for (var i = 0; i < this.$options.length; i++) {
          list.append(this.options.tpl.listItem(this.$options[i].text));
        }
      }

      this.$el.after(this.$select);

      this.$select.on({
        click: $.proxy(this._click, this)
      });
    },
    show: function() {

    },
    hide: function() {

    },
    add: function() {

    },
    remove: function() {

    },
    select: function() {

    },
    unselect: function() {

    },
    _click: function() {

    },
    get: function() {

    }
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
