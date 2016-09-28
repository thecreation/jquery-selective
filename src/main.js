import $ from 'jquery';
import Selective from './selective';
import info from './info';

const NAMESPACE = 'selective';
const OtherSelective = $.fn.selective;

const jQuerySelective = function(options, ...args) {
  if (typeof options === 'string') {
    const method = options;

    if (/^_/.test(method)) {
      return false;
    } else if ((/^(get)/.test(method))) {
      const instance = this.first().data(NAMESPACE);
      if (instance && typeof instance[method] === 'function') {
        return instance[method](...args);
      }
    } else {
      return this.each(function() {
        const instance = $.data(this, NAMESPACE);
        if (instance && typeof instance[method] === 'function') {
          instance[method](...args);
        }
      });
    }
  }

  return this.each(function() {
    if (!$(this).data(NAMESPACE)) {
      $(this).data(NAMESPACE, new Selective(this, options));
    }
  });
};

$.fn.selective = jQuerySelective;

$.selective = $.extend({
  setDefaults: Selective.setDefaults,
  noConflict: function() {
    $.fn.selective = OtherSelective;
    return jQuerySelective;
  }
}, info);
