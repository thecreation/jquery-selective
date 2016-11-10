class Items {
  constructor(instance) {
    this.instance = instance;
  }

  withDefaults(data) {
    if (data !== null) {
      $.each(data, i => {
        this.instance._options.add(data[i]);
        this.instance._options.select(this.instance.getItem('option', this.instance.$select, this.instance.options.tpl.optionValue(data[i])));
        this.instance._items.add(data[i]);
      });
    }
  }

  add(data, content) {
    let $item;

    let fill;
    if (this.instance.options.buildFromHtml === true) {
      fill = content;
    } else {
      fill = data;
    }
    $item = $(this.instance.options.tpl.item.call(this.instance, fill));
    this.instance.setIndex($item, data);
    this.instance.$items.append($item);
  }

  remove(obj) {
    obj = $(obj);
    let $li;
    let $option;
    if (this.instance.options.buildFromHtml === true) {
      this.instance._list.unselect(obj.data('selective_index'));
      this.instance._options.unselect(obj.data('selective_index').data('selective_index'));
    } else {
      $li = this.instance.getItem('li', this.instance.$list, this.instance.options.tpl.optionValue(obj.data('selective_index')));
      if ($li !== undefined) {
        this.instance._list.unselect($li);
      }
      $option = this.instance.getItem('option', this.instance.$select, this.instance.options.tpl.optionValue(obj.data('selective_index')));
      this.instance._options.unselect($option)._options.remove($option);
    }

    obj.remove();
    return this.instance;
  }

  click() {
    const that = this;
    this.instance.$items.on('click', `.${this.instance.namespace}-remove`, function() {
      const $this = $(this);
      const $item = $this.parents('li');
      that.instance.itemRemove($item);
    });
  }
}

export default Items;
