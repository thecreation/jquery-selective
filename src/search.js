class Search {
  constructor(instance) {
    this.instance = instance;
  }

  change() {
    this.instance.$search.change(() => {
      this.instance._trigger("beforeSearch");
      if (this.instance.options.buildFromHtml === true) {
        this.instance._list.filter(this.instance.$search.val());
      } else if (this.instance.$search.val() !== '') {
        this.instance.page = 1;
        this.instance.options.query(this.instance.$search.val(), this.instance.page);
      } else {
        this.instance.update(this.instance.options.local);
      }
      this.instance._trigger("afterSearch");
    });
  }

  keyup() {
    const quietMills = this.instance.options.ajax.quietMills || 1000;
    let oldValue = '';
    let currentValue = '';
    let timeout;

    this.instance.$search.on('keyup', e => {
      this.instance._trigger("beforeSearch");
      currentValue = this.instance.$search.val();
      if (this.instance.options.buildFromHtml === true) {
        if (currentValue !== oldValue) {
          this.instance._list.filter(currentValue);
        }
      } else if (currentValue !== oldValue || e.keyCode === 13) {
        window.clearTimeout(timeout);
        timeout = window.setTimeout(() => {
          if (currentValue !== '') {
            this.instance.page = 1;
            this.instance.options.query(this.instance, currentValue, this.instance.page);
          } else {
            this.instance.update(this.instance.options.local);
          }
        }, quietMills);
      }
      oldValue = currentValue;
      this.instance._trigger("afterSearch");
    });
  }

  bind(type) {
    if (type === 'change') {
      this.change();
    } else if (type === 'keyup') {
      this.keyup();
    }
  }
}

export default Search;
