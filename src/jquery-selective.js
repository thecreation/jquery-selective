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
        }) || $('<select></select>');

        this.options = $.extend(true, {}, Selective.defaults, options);

        // this.$optgroups = this.$el.find('optgroup');

        this.namespace = this.options.namespace;

        this._init();
        this.opened = false;
    };

    Selective.defaults = {
        namespace: 'selective',
        // trigger: 'click', // 'hover' or 'click'
        closeOnSelect: true,
        data: null,
        withSearch: false,
        // triggerPosition: 'before', // before | after
        // tpl: {
        //     option: function(content) {
        //         return '<option>' + content + '</option>';
        //     },
        //     items: function() {
        //         return '<ul class="' + this.namespace + '-items"></ul>';
        //     },
        //     item: function(content) {
        //         return '<li class="' + this.namespace + '-item">' + content + '</li>';
        //     },
        //     itemRemove: function() {
        //         return '<span class="' + this.namespace + '-remove"></span>';
        //     },
        //     trigger: function() {
        //         return '<div class="' + this.namespace + '-trigger"></div>';
        //     },
        //     triggerButton: function() {
        //         return '<div class="' + this.namespace + '-trigger-button">Add</div>';
        //     },
        //     triggerDropdown: function() {
        //         return '<div class="' + this.namespace + '-trigger-dropdown"></div>'
        //     },
        //     search: function() {
        //         return '<input class="' + this.namespace + '-search" type="text" placeholder="Search...">';
        //     },
        //     list: function() {
        //         return '<ul class="' + this.namespace + '-list"></ul>';
        //     },
        //     listItem: function() {
        //         return '<li class="' + this.namespace + '-list-item">' + content + '</li>';
        //     }
        // }
        tpl: {
            frame: function() {
                return  '<div class="' + this.namespace + '">'+
                            '<div class="' + this.namespace + '-trigger">'+
                                this.options.tpl.triggerButton.call(this) +
                                '<div class="' + this.namespace + '-trigger-dropdown">'+
                                    this.options.tpl.list.call(this) + 
                                '</div>'+
                            '</div>'+
                            this.options.tpl.items.call(this) + 
                        '</div>'
            },

            search: function() {
                return '<input class="' + this.namespace + '-search" type="text" placeholder="Search...">';
            },
            select: function() {
                return '<select class="' + this.namespace + '-select" name="' + this.namespace + '" multiple="multiple"></select>';
            },
            optionValue: function(data) {
                return data.id;
            },
            option: function(content) {
                return '<option value="' + this.options.tpl.optionValue.call(this)+ '">' + content + '</option>';
            },
            items: function() {
                return '<ul class="' + this.namespace + '-items"></ul>';
            },
            item: function(content) {
                return  '<li class="' + this.namespace + '-item">' + 
                            content + 
                            this.options.tpl.itemRemove.call(this) +
                        '</li>';
            },
            itemRemove: function() {
                return '<span class="' + this.namespace + '-remove"></span>';
            },
            triggerButton: function() {
                return '<div class="' + this.namespace + '-trigger-button">Add</div>';
            },
            list: function() {
                return '<ul class="' + this.namespace + '-list"></ul>'
            },
            listItem: function(content) {
                return '<li class="' + this.namespace + '-list-item">' + content + '</li>';
            }
        }   
    };

    Selective.prototype = {
        constructor: Selective,
        _init: function() {
            var self = this;
            //get the select      
            this.$select = this.$el.is('select') === true ? this.$el : function _build(){
                self.$el.html(self.options.tpl.select.call(self));
                return self.$el.children('select');
            }();

            var $frame = $(this.options.tpl.frame.call(this));
            if(this.options.withSearch === true){
               $frame.find('.'+this.namespace+'-trigger-dropdown').prepend(this.options.tpl.search.call(this)); 
            } 
            this.$el.after($frame);

            this.$selective = this.$el.next('.' + this.namespace);
            this.$items = this.$selective.find('.' + this.namespace + '-items');
            this.$trigger = this.$selective.find('.' + this.namespace + '-trigger');
            this.$triggerButton = this.$selective.find('.' + this.namespace + '-trigger-button');
            this.$triggerDropdown = this.$selective.find('.' + this.namespace + '-trigger-dropdown');
            this.$list = this.$selective.find('.' + this.namespace + '-list');

            this._list.build.call(this);

            this._trigger.click.call(this);
            this._list.click.call(this);
        },
        _items: {
            // build: function() {
                // return self.options.tpl.items.call(self);
            // },
            add: function(content) {
                this.$items.append(this.options.tpl.item.call(this, content));
                return this;
            },
            remove: function($item) {
                $item.remove();
                return this;
            },
            getItem: function($list, index) {
                var _items = $list.children();
                for(var i = 0; i < _items.length; i++) {
                    if(_items.eq(i).data('selective_index') === index) {
                        return _items.eq(i);
                    }
                }
            },
            click: function() {

            }
        },
        _trigger: {
            // build: function() {
                // return  this.options.tpl.trigger.call(this);
            // },
            show: function() {
                this.$trigger.addClass(this.namespace + '-active');
                this.opened = true;
                return this;
            },
            hide: function() {
                this.$trigger.removeClass(this.namespace + '-active');
                this.opened = false;
                return this;
            },
            click: function() {
                var self = this;
                this.$triggerButton.on('click', function() {
                    if(self.opened === false) {
                        self._trigger.show.call(self);
                    }else if(self.opened === true){
                        self._trigger.hide.call(self);
                    }
                });
            }
        },
        _list: {
            build: function() {
                var $list = $(this.options.tpl.list.call(this)),
                    self = this;
                if(this.options.data === null) {
                    this.$options = this.$select.find('option');
                    if(this.$options.length !== 0){                   
                        $.each(this.$options, function(i, n) {
                            self._options.unselect(self.$options.eq(i));
                            var $listItem = $(self.options.tpl.listItem.call(self, n.text));
                            $listItem.data('selective-index', n.value);
                            $list.append($listItem);
                        });
                    }
                } else {
                    $.each(this.options.data, function(i, n) {
                      // _list += self.options.tpl.listItem.call(self, self.options.data[i]);  
                        var $listItem = $(self.options.tpl.listItem.call(self, self.options.data[i]));
                        $listItem.data('selective-index', self.options.tpl.optionValue(self.options.data[i]));
                        $list.append($listItem);
                    });
                }
                this.$list.replaceWith($list);
            },
            select: function(obj) {
                obj.addClass(this.namespace + '-selected');
                return this;
            },
            unselect: function() {
                obj.removeClass(this.namespace + '-selected');
                return this;
            },
            add: function(content) {
                this.$list.append(this.options.tpl.listItem.call(this, content));
                return this;
            },
            remove: function($li) {
                $li.remove();
                return this;
            },
            index: function($li, value) {
                $li.data('selective_index', value);
                return this;
            },
            filter: function(value) {
                //make contains CompareNoCase
                jQuery.expr[':'].Contains = function(a, i, m) {
                    return jQuery(a).text().toUpperCase()
                        .indexOf(m[3].toUpperCase()) >= 0;
                };

                if(value) {
                    this.$list.find("li:not(:Contains(" + value + "))").slideUp();
                    this.$list.find("li:Contains(" + value + ")").slideDown();
                } else {
                    this.$list.children('li').slideDown();
                }
            },
            click: function() {
                var self = this;
                this.$list.on('click', 'li', function() {
                    console.log('xxx');
                });
            }
        },
        _search: {
            // build: function() {
                // return this.options.tpl.search.call(this);
            // },
            bind: function() {

            }
        },
        _options: {
            select: function(opt) {
                opt.prop('selected', true);
                return self;
            },
            unselect: function(opt) {
                opt.prop('selected', false);
                return self;
            },
            add: function() {
                self.$select.append(self.options.tpl.option.call(self));
                return self;
            }
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
