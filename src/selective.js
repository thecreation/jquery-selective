import $ from 'jquery';
import DEFAULTS from './defaults';
import Options from './options';
import List from './list';
import Search from './search';
import Items from './items';

const NAMESPACE = 'selective';

/**
 * Plugin constructor
 **/
class Selective {
  constructor(element, options = {}) {
    this.element = element;
    this.$element = $(element).hide() || $('<select></select>');

    this.options = $.extend(true, {}, DEFAULTS, options);

    this.namespace = this.options.namespace;

    const $frame = $(this.options.tpl.frame.call(this));

    //get the select
    const _build = () => {
      this.$element.html(this.options.tpl.select.call(this));
      return this.$element.children('select');
    };

    this.$select = this.$element.is('select') === true ? this.$element : _build();

    this.$element.after($frame);

    this.init();
    this.opened = false;
  }

  init() {
    this.$selective = this.$element.next(`.${this.namespace}`);
    this.$items = this.$selective.find(`.${this.namespace}-items`);
    this.$trigger = this.$selective.find(`.${this.namespace}-trigger`);
    this.$triggerButton = this.$selective.find(`.${this.namespace}-trigger-button`);
    this.$triggerDropdown = this.$selective.find(`.${this.namespace}-trigger-dropdown`);
    this.$listWrap = this.$selective.find(`.${this.namespace}-list-wrap`);
    this.$list = this.$selective.find(`.${this.namespace}-list`);

    this._list = new List(this);
    this._options = new Options(this);
    this._search = new Search(this);
    this._items = new Items(this);

    this._items.withDefaults(this.options.selected);
    this.update(this.options.local)._list.buildSearch();

    this.$triggerButton.on('click', () => {
      if (this.opened === false) {
        this.show();
      } else {
        this.hide();
      }
    });

    this._list.click(this);
    this._items.click(this);

    if (this.options.withSearch === true) {
      this._search.bind(this.options.searchType);
    }

    this._trigger('ready');
  }

  _trigger(eventType, ...params) {
    let data = [this].concat(params);

    // event
    this.$element.trigger(`${NAMESPACE}::${eventType}`, data);

    // callback
    eventType = eventType.replace(/\b\w+\b/g, (word) => {
      return word.substring(0, 1).toUpperCase() + word.substring(1);
    });
    let onFunction = `on${eventType}`;

    if (typeof this.options[onFunction] === 'function') {
      this.options[onFunction].apply(this, params);
    }
  }

  _show() {
    $(document).on('click.selective', e => {
      if (this.options.closeOnSelect === true) {
        if ($(e.target).closest(this.$triggerButton).length === 0 &&
          $(e.target).closest(this.$search).length === 0) {
          this._hide();
        }
      } else if ($(e.target).closest(this.$trigger).length === 0) {
        this._hide();
      }
    });

    this.$trigger.addClass(`${this.namespace}-active`);
    this.opened = true;

    if (this.options.ajax.loadMore === true) {
      this._list.loadMore();
    }
    return this;
  }

  _hide() {
    $(document).off('click.selective');

    this.$trigger.removeClass(`${this.namespace}-active`);
    this.opened = false;

    if (this.options.ajax.loadMore === true) {
      this._list.loadMoreRemove();
    }
    return this;
  }

  show() {
    this._trigger("beforeShow");
    this._show();
    this._trigger("afterShow");
    return this;
  }

  hide() {
    this._trigger("beforeHide");
    this._hide();
    this._trigger("afterHide");
    return this;
  }

  select($li) {
    this._list.select($li);
    const data = $li.data('selective_index');

    if (this.options.buildFromHtml === true) {
      this._options.select(data);
      this.itemAdd($li, data.text());
    } else {
      this._options.add(data);
      this._options.select(this.getItem('option', this.$select, this.options.tpl.optionValue(data)));
      this.itemAdd(data);
    }

    return this;
  }

  unselect($li) {
    this._list.unselect($li);
    return this;
  }

  setIndex(obj, index) {
    obj.data('selective_index', index);
    return this;
  }

  getItem(type, $list, index) {
    const $items = $list.children(type);
    let position = '';
    for (let i = 0; i < $items.length; i++) {
      if (this.options.tpl.optionValue($items.eq(i).data('selective_index')) === index) {
        position = i;
      }
    }
    return position === '' ? undefined : $items.eq(position);
  }

  itemAdd(data, content) {
    this._trigger("beforeItemAdd");
    this._items.add(data, content);
    this._trigger("afterItemAdd");

    return this;
  }

  itemRemove($li) {
    this._trigger("beforeItemRemove");
    this._items.remove($li);
    this._trigger("afterItemRemove");

    return this;
  }

  optionAdd(data) {
    this._options.add(data);

    return this;
  }

  optionRemove(opt) {
    this._options.remove(opt);

    return this;
  }

  update(data) {
    this.$list.empty();
    this.page = 1;
    if (data !== null) {
      this._list.build(data);
    } else {
      this._list.build();
    }

    return this;
  }

  destroy() {
    this.$selective.remove();
    this.$element.show();
    $(document).off('click.selective');

    this._trigger('destroy');
  }

  static setDefaults(options) {
    $.extend(true, DEFAULTS, $.isPlainObject(options) && options);
  }
}

export default Selective;
