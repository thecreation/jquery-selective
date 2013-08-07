/*
 * jquery-selective
 * https://github.com/amazingSurge/jquery-selective
 *
 * Copyright (c) 2013 amazingSurge
 * Licensed under the GPL license.
 */

(function(window, document, $, undefined) {
  "use strict";

  // Constructor
  var Selective = $.Selective = function(element, options) {
    this.el = element;
    this.$el = $(element).css({
      // display: 'none'
    }) || $('<div></div>');

    this.options = $.extend(true, {}, Selective.defaults, options);
    this.$options = this.$el.find('option');
    // this.$optgroups = this.$el.find('optgroup');

    this.namespace = this.options.namespace;

    // flag
    this.opened = false;

    var self = this;

    this.$el.change(function(){
      console.log(self.el.value)
    });

    this.init();
  };

  Selective.defaults = {
    namespace: 'selective',
    trigger: 'click', // 'hover' or 'click'
    multiple: false,
    withSearch: false,
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
                    '<div class="' + this.namespace + '-toggle">' +
                      this.options.tpl.trigger() +
                    '</div>' +
                    '<div class="' + this.namespace + '-dropdown">' +
                      '<ul class="' + this.namespace + '-list"></ul>' +
                    '</div>' +
                  '</div>';

      this.$select = $(frame);
      this.$toggle = this.$select.find('.' + this.namespace + '-toggle');
      this.$dropdown = this.$select.find('.' + this.namespace + '-dropdown');
      this.$list = this.$select.find('.' + this.namespace + '-list');

      var listWrap = '<ul class="' + this.namespace + '-items"></ul>';

      if(this.options.insertLocation = 'before') {
        this.$toggle.before(listWrap);
      }else if (this.options.insertLocation = 'after') {
        this.$toggle.after(listWrap);
      }
      
      this.$items = this.$select.find('.' + this.namespace + '-items');

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
      this.$dropdown.css({display: 'block'});
      this.$toggle.addClass(this.namespace + '-active');
      return this;
    },
    hide: function() {
      this.$dropdown.css({display: 'none'});
      this.$toggle.removeClass(this.namespace + '-active');
      return this;
    },
    itemAdd: function(content) {
      this.options.tpl.item(content);
    },
    itemRemove: function() {

    },
    liAdd: function() {

    },
    liRemove: function() {

    },
    select: function($el) {
      $el.addClass(this.namespace + 'selected');
      return this;
    },
    unselect: function($el) {
      $el.removeClass(this.namespace + 'selected');
      return this;
    },
    _click: function(e) {
        var $target = $(e.target).closest('div, li');
        switch($target[0].nodeName.toLowerCase()) {
          case 'div': 

            break;
          case 'li':
            
            break;
        }
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
