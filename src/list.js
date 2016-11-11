class List {
  constructor(instance) {
    this.instance = instance;
  }

  build(data) {
    const $list = $('<ul></ul>');
    const $options = this.instance._options.getOptions();
    if (this.instance.options.buildFromHtml === true) {
      if ($options.length !== 0) {
        $.each($options, (i, n) => {
          const $li = $(this.instance.options.tpl.listItem.call(this.instance, n.text));
          const $n = $(n);
          this.instance.setIndex($li, $n);
          if ($n.attr('selected') !== undefined) {
            this.instance.select($li);
          }
          $list.append($li);
        });
      }
    } else if (data !== null) {
      $.each(data, i => {
        const $li = $(this.instance.options.tpl.listItem.call(this.instance, data[i]));

        this.instance.setIndex($li, data[i]);
        $list.append($li);
      });

      if ($options.length !== 0) {
        $.each($options, (i, n) => {
          const $n = $(n);
          const li = this.instance.getItem('li', $list, this.instance.options.tpl.optionValue($n.data('selective_index')));

          if (li !== undefined) {
            this.instance._list.select(li);
          }
        });
      }   
    }

    this.instance.$list.append($list.children('li'));
    return this.instance;
  }

  buildSearch() {
    if (this.instance.options.withSearch === true) {
      this.instance.$triggerDropdown.prepend(this.instance.options.tpl.search.call(this.instance));
      this.instance.$search = this.instance.$triggerDropdown.find(`.${this.instance.namespace}-search`);
    }
    return this.instance;
  }

  select(obj) {
    this.instance._trigger("beforeSelected");
    $(obj).addClass(`${this.instance.namespace}-selected`);
    this.instance._trigger("afterSelected");
    return this.instance;
  }

  unselect(obj) {
    this.instance._trigger("beforeUnselected");
    $(obj).removeClass(`${this.instance.namespace}-selected`);
    this.instance._trigger("afterUnselected");
    return this.instance;
  }

  click() {
    const that = this;
    this.instance.$list.on('click', 'li', function() {
      const $this = $(this);
      if (!$this.hasClass(`${that.instance.namespace}-selected`)) {
        that.instance.select($this);
      }
    });
  }

  filter(val) {
    $.expr[':'].Contains = (a, i, m) => jQuery(a).text().toUpperCase().includes(m[3].toUpperCase());
    if (val) {
      this.instance.$list.find(`li:not(:Contains(${val}))`).slideUp();
      this.instance.$list.find(`li:Contains(${val})`).slideDown();
    } else {
      this.instance.$list.children('li').slideDown();
    }
    return this.instance;
  }

  loadMore() {
    const pageMax = this.instance.options.ajax.pageSize || 9999;
       
    this.instance.$listWrap.on('scroll.selective', () => {
      if (pageMax > this.instance.page) {
        const listHeight = this.instance.$list.outerHeight(true);
        const wrapHeight = this.instance.$listWrap.outerHeight();
        const wrapScrollTop = this.instance.$listWrap.scrollTop();
        const below = listHeight - wrapHeight - wrapScrollTop;
        if (below === 0) {
          this.instance.options.query(this.instance, this.instance.$search.val(), ++this.instance.page);
        }
      }
    });
    return this.instance;
  }

  loadMoreRemove() {
    this.instance.$listWrap.off('scroll.selective');
    return this.instance;
  }
}

export default List;
