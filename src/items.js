class Items {
  constructor(instance) {
    this.instance = instance;
  }

  withDefaults(data) {
    if (data !== null) {
      $.each(data, i => {
        this.instance._options.add(this.instance, data[i]);
        this.instance._options.select(this.instance, this.instance.getItem('option', this.instance.$select, this.instance.options.tpl.optionValue(data[i])));
        this.instance._items.add(this.instance, data[i]);
      });
    }
  }

  add(data, content) {
    // this.instance._trigger("beforeItemAdd");
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
    // this.instance._trigger("afterItemAdd");
    // return $item;
  }

  remove(obj) {
    obj = $(obj);
    let $li;
    let $option;
    if (this.instance.options.buildFromHtml === true) {
      this.instance._list.unselect(this.instance, obj.data('selective_index'));
      this.instance._options.unselect(this.instance, obj.data('selective_index').data('selective_index'));
    } else {
      $li = this.instance.getItem('li', this.instance.$list, this.instance.options.tpl.optionValue(obj.data('selective_index')));
      if ($li !== undefined) {
        this.instance._list.unselect(this.instance, $li);
      }
      $option = this.instance.getItem('option', this.instance.$select, this.instance.options.tpl.optionValue(obj.data('selective_index')));
      this.instance._options.unselect(this.instance, $option)._options.remove(this.instance, $option);
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
