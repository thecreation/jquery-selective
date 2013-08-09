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
      display: 'none'
    }) || $('<div></div>');

    this.options = $.extend(true, {}, Selective.defaults, options);
    this.$options = this.$el.find('option');
    // this.$optgroups = this.$el.find('optgroup');

    this.namespace = this.options.namespace;

    // flag
    this.opened = false;

    var self = this;

    // this.$el.change(function(){
    //   for(var i = 0; i < self.$options.length; i++) {
    //     console.log(self.$options[i].selected)
    //   }
    // });

    this.init();
  };

  Selective.defaults = {
    namespace: 'selective',
    trigger: 'click', // 'hover' or 'click'
    multiple: false,
    withSearch: false,
    insertLocation: 'before', // before | after
    autoPosition: false,
    tpl: {
      item: function(content) {
        return content;
      },
      itemRemove: function(content) {
        return content;
      },
      listItem: function(content) {
        return content;
      },
      trigger: function() {
        return 'Add';
      },
      search: function(namespace) {
        return '<input type="text" placeholder="Search...">';
      }
    },
  };

  Selective.prototype = {
    constructor: Selective,
    init: function() {
      var frame = '<div class="' + this.namespace + '">' +
                    '<div class="' + this.namespace + '-augment">' +
                      '<div class="' + this.namespace + '-toggle">' +
                        this.options.tpl.trigger() +
                      '</div>' +
                      '<div class="' + this.namespace + '-dropdown">'+
                        '<ul class="' + this.namespace + '-list"></ul>' +
                      '</div>' +
                    '</div>' +
                  '</div>';

      this.$select = $(frame);
      this.$augment = this.$select.find('.' + this.namespace + '-augment');
      this.$toggle = this.$select.find('.' + this.namespace + '-toggle');
      this.$dropdown = this.$select.find('.' + this.namespace + '-dropdown');
      this.$list = this.$select.find('.' + this.namespace + '-list');

      var listWrap = '<ul class="' + this.namespace + '-items"></ul>';

      if(this.options.insertLocation === 'before') {
        this.$augment.before(listWrap);
      }else if (this.options.insertLocation === 'after') {
        this.$augment.after(listWrap);
      }
      
      this.$items = this.$select.find('.' + this.namespace + '-items');

      if (this.options.withSearch) {
        this.$select.find('.' + this.namespace + '-dropdown').prepend(this.options.tpl.search(this.namespace));
      }

      if (this.$options.length !== 0) {
        for (var i = 0; i < this.$options.length; i++) {
          this.$options[i].selected = false;
          this.$list.append(this._listItemWrap(this.$options[i].text));
          this.$list.children().eq(i).data('position', i);
        }
      }

      this.$el.after(this.$select);
      
      this.$select.on({
        click: $.proxy(this._click, this)
      });
    },
    _itemWrap: function(content) {
      return  '<li class="' + this.namespace + '-item">' + this.options.tpl.item(content) + 
                '<div class="' + this.namespace + '-remove">' + this.options.tpl.itemRemove('x') + '</div>'+
              '</li>';
    },
    _listItemWrap: function(content) {
      return '<li class="' + this.namespace + '-listItem">' + this.options.tpl.listItem(content) + '</li>';
    },
    show: function() {
      var self = this;
      this.$augment.addClass(this.namespace + '-active');
      $(document).on('click.select', function(ev){
        if($(ev.target).closest(self.$select).length === 0 && $(ev.target).closest(self.$augment).length === 0){
          self.hide();
        }
      });
      return this;
    },
    hide: function() {
      this.$augment.removeClass(this.namespace + '-active');
      $(document).off('click.select');
      return this;
    },
    itemAdd: function(obj, content) {
      var $item = $(this._itemWrap(content));
      $item.data('position', obj.data('position'));
      this.$items.append($item);
      return this;
    },
    itemRemove: function(obj) {
      obj.remove();
      // this.unselect(obj);
      return this;
    },
    select: function(obj) {
      obj.addClass(this.namespace + '-selected');
      this.$options[obj.data('position')].selected = true;
      return this;
    },
    unselect: function(obj) {
      obj.removeClass(this.namespace + '-selected');
      this.$options[obj.data('position')].selected = false;
      return this;
    },
    _getItem: function(position) {
      var _listItems = this.$list.children();
      for(var i = 0; i < _listItems.length; i++){
        if(_listItems.eq(i).data('position') === position){
          return _listItems.eq(i);
        }
      }
    },
    _click: function(e) {
        var $target = $(e.target).closest('.' + this.namespace + '-toggle, .'+ this.namespace + '-remove, li');
        switch($target.attr('class')) {
          case this.namespace + '-toggle':
            if(this.$augment.hasClass(this.namespace + '-active')) {
              this.hide();
            }else {
              this.show();
            }
            break;
          case this.namespace + '-remove':
            var _item = $target.parents('.' + this.namespace + '-item'),
                _position = _item.data('position');
            this.itemRemove(_item).unselect(this._getItem(_position));

            break;
          default:
            if(!$target.hasClass(this.namespace + '-selected') && $target.hasClass(this.namespace + '-listItem') ){
              this.select($target).itemAdd($target, $target.text());
            }
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
