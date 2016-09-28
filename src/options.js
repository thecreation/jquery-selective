class Options {
  constructor(instance) {
    this.instance = instance;
  }

  getOptions() {
    this.instance.$options = this.instance.$select.find('option');
    return this.instance.$options;
  }

  select(opt) {
    $(opt).prop('selected', true);
    return this.instance;
  }

  unselect(opt) {
    $(opt).prop('selected', false);
    return this.instance;
  }

  add(data) {
    /*eslint consistent-return: "off"*/
    if (this.instance.options.buildFromHtml === false &&
      this.instance.getItem('option', this.instance.$select, this.instance.options.tpl.optionValue(data)) === undefined) {
      const $option = $(this.instance.options.tpl.option.call(this.instance, data));
      this.instance.setIndex($option, data);
      this.instance.$select.append($option);
      return $option;
    }
  }

  remove(opt) {
    $(opt).remove();
    return this.instance;
  }
}

export default Options;
