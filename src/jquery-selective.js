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

        var self = this;
        //get the select      
        this.$select = this.$el.is('select') === true ? this.$el : function _build(){
            self.$el.html(self.options.tpl.select.call(self));
            return self.$el.children('select');
        }();

        var $frame = $(this.options.tpl.frame.call(this));
        this.$el.after($frame);

        this._init();
        this.opened = false;
    };

    Selective.defaults = {
        namespace: 'selective',
        closeOnSelect: false,
        data: null,
        items: null,
        withSearch: false,
        searchType: null, //'query', 'change' or 'keyup'
        // triggerPosition: 'before', // before | after
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
                return data.name;
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
                return '<span class="' + this.namespace + '-remove">x</span>';
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
        },
        query: function() {

        },
        onShow: function() {},
        onHide: function() {},
        onSearch: function() {},
        onSelected: function() {},
        onUnselect: function() {},
        onRemove: function() {},
        onAdd: function() {}
    };

    Selective.prototype = {
        constructor: Selective,
        _init: function() {
            var self = this;

            this.$selective = this.$el.next('.' + this.namespace);
            this.$items = this.$selective.find('.' + this.namespace + '-items');
            this.$trigger = this.$selective.find('.' + this.namespace + '-trigger');
            this.$triggerButton = this.$selective.find('.' + this.namespace + '-trigger-button');
            this.$triggerDropdown = this.$selective.find('.' + this.namespace + '-trigger-dropdown');
            this.$list = this.$selective.find('.' + this.namespace + '-list');

            
            if(this.options.items !== null) {
                this._list.build.call(this, this.options.items);

                $.each(this.$list.children(), function(i,n){
                    var $n = $(n);
                    self._list.select.call(self, $n);
                    self._options.add.call(self, $n.data('selective_index'), true);
                    self.itemAdd($n.data('selective_index'));
                    self._options.select.call(self, self._options.getOption.call(self, $n.data('selective_index'))); 
                }) 
            }
            
            if(this.options.withSearch === true){
               this.$triggerDropdown.prepend(this.options.tpl.search.call(this)); 
               this.$search = this.$selective.find('.' + this.namespace + '-search');
               this._search.bind.call(this, this.options.searchType);
            }

            this._list.build.call(this, this.options.data);

            if(this.options.data === null && this.$select.val() !== null) {
                $.each(this.$select.val(), function(i, n){
                    var $item = $(self.getItem(self.$list, n));
                    self.itemAdd($item.data('selective_index'));
                    self._list.select.call(self, $item);
                })
            }

            this._trigger.click.call(this);
            this._list.click.call(this);
            this._items.click.call(this);
        },
        _items: {
            // build: function(data) {
            //     var self = this;
            //     if(data !== null) {
            //         $.each(data, function(i, n){
            //             self._items.add.call(self, n, self.options.tpl.optionValue(n));
            //         });
            //     }
            // },
            add: function(content, data) {
                if(data === undefined) {
                   var $item = $(this.options.tpl.item.call(this, content));
                   this.setIndex($item, content);
                }else {
                   var $item = $(this.options.tpl.item.call(this, content)); 
                   this.setIndex($item, data);
                } 
                this.$items.append($item);
                return this;
            },
            remove: function($item) {
                $item.remove();
                return this;
            },
            click: function() {
                var self = this;
                this.$items.on('click', '.' + this.namespace + '-remove', function() {
                    var $this = $(this),
                        $item = $this.parents('li');
                    self.itemRemove($item);
                });
            }
        },
        _trigger: {
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
                        self.show();
                    }else if(self.opened === true){
                        self.hide();
                    }
                });
            }
        },
        _list: {
            build: function(data) {
                var $list = $(this.options.tpl.list.call(this)),
                    self = this;
                if(data === null) {
                    this.$options = this.$select.find('option');
                    if(this.$options.length !== 0){                   
                        $.each(this.$options, function(i, n) {
                            // self._options.unselect(self.$options.eq(i));
                            var $listItem = $(self.options.tpl.listItem.call(self, n.text));
                            $listItem.data('selective_index', n.value);
                            $list.append($listItem);
                        });
                    }
                } else {
                    $.each(data, function(i, n) {
                        var $listItem = $(self.options.tpl.listItem.call(self, data[i]));
                        self.setIndex($listItem, data[i]);
                        $list.append($listItem);
                    });
                }
                this.$list.append($list.children());
            },
            select: function(obj) {
                obj.addClass(this.namespace + '-selected');
                return this;
            },
            unselect: function(obj) {
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
                this.$list.on('click', 'li', function(){
                    var $this = $(this);

                    //only select
                    if(!$this.hasClass(self.namespace + '-selected')){
                        self.select($this);                      
                    }
                });
            }
        },
        _search: {
            bind: function(type) {
                var self = this,
                    old_value = '',
                    current_value = '';
                if(type === 'change') {
                    this.$search.change(function(){
                        self._list.filter.call(self, self.$search.val());
                    });
                }else if(type === 'keyup') {
                    this.$search.keyup(function() {
                        current_value = self.$search.val();
                        if (current_value !== old_value) {
                            self._list.filter.call(self, current_value);
                        }
                        old_value = current_value;
                    });
                }else if(type === 'query') {
                    // this.options.query.call(this, self.$search.val());
                }            
            }
        },
        _options: {
            // build: function(data) {
            //     var self = this;
            //     if(data !== null) {
            //         var $html = $('<select multiple="multiple"></select>');
            //         $.each(data, function(i, n){
            //             if(self._options.getOption.call(self, self.options.tpl.optionValue(n)) === undefined) {
            //                 var $item = $(self.options.tpl.option.call(self, n));
            //                 self.setIndex($item, data[i])._options.select($item);
            //                 // self._options.select($item);
            //                 $html.append($item);
            //             }
            //         });
            //         this.$select.append($html.children());
            //     }
            // },
            select: function(opt) {
                opt.prop('selected', true);
                return this;
            },
            unselect: function(opt) {
                opt.prop('selected', false);
                return this;
            },
            add: function(data, selected) {
                if(this._options.getOption.call(this, data) === undefined) {
                    var $option = $(this.options.tpl.option.call(this, data));
                    this.setIndex($option, data);
                    this.$select.append($option); 
                }
                return this;
            },
            getOption: function(val) {              
                var $options = this.$select.children('option'),
                    index = '', self = this;
                $.each($options, function(i, n) {
                    if(self.options.data === null){
                        if(n.value === val) {
                            index = i;
                        }
                    }else {
                        if($(n).data('selective_index') === val) {
                            index = i;
                        }
                    }
                    
                });

                return index === '' ? undefined : $options.eq(index);
            }
        },


        setPositon: function(obj, position) {
            obj.data('selective_position', position);
            return this;
        },
        setIndex: function(obj, index) {
            obj.data('selective_index', index);
            return this;
        },
        getItem: function($list, index) {
            var $items = $list.children('li');
            for(var i = 0; i < $items.length; i++) {
                if($items.eq(i).data('selective_index') === index) {
                    return $items.eq(i);
                }
            }
        },
        show: function() {
            this._trigger.show.call(this);
            var self = this;
            if(this.options.closeOnSelect === true) {
                $(document).on('click.select', function(ev){
                    if ($(ev.target).closest(self.$triggerButton).length === 0 && $(ev.target).closest(self.$search).length === 0) {
                        self._trigger.hide.call(self);
                    }
                });
            }else {
               $(document).on('click.select', function(ev){
                    if ($(ev.target).closest(self.$trigger).length === 0) {
                        self._trigger.hide.call(self);
                    }
                }); 
            }
            return this;       
        },
        hide: function() {
            this._trigger.hide.call(this);
            $(document).off('click.select');
            return this;
        },
        val: function() {
            return this.$select.val();
        },
        select: function($obj) {
            this._list.select.call(this, $obj);
            if(this.options.data === null) {
                this._items.add.call(this, $obj.text(), $obj.data('selective_index'));
                this._options.select.call(this, this._options.getOption.call(this, $obj.data('selective_index')));
            }else{
                this._options.add.call(this, $obj.data('selective_index'), true);
                this.itemAdd($obj.data('selective_index')); 
                this._options.select.call(this, this._options.getOption.call(this, $obj.data('selective_index')));          
            }
            return this;
        },
        unselect: function($obj) {
            this._list.unselect.call(this, $obj);
            return this;
        },
        itemAdd: function(data) {
            this._items.add.call(this, data);
            return this;
        },
        itemRemove: function($item) {
            this._list.unselect.call(this, this.getItem(this.$list, $item.data('selective_index')));
            this._options.unselect.call(this, this._options.getOption.call(this, $item.data('selective_index')));
            this._items.remove.call(this, $item);
            return this;
        },
        update: function(data) {
            this.$list.empty();
            this._list.build.call(this, data);
            return this;
        },
        clear: function() {
            this.$select.empty();
            this.$list.empty();
            this.$items.empty();
            return this;
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
