/*eslint no-empty-function: "off"*/
export default {
  namespace: 'selective',
  buildFromHtml: true,
  closeOnSelect: false,
  local: null,
  selected: null,
  withSearch: false,
  searchType: null, //'change' or 'keyup'
  ajax: {
    work: false,
    url: null,
    quietMills: null,
    loadMore: false,
    pageSize: null
  },
  query: function() {}, //function(api, search_text, page) {},
  tpl: {
    frame: function() {
      return `<div class="${this.namespace}"><div class="${this.namespace}-trigger">${this.options.tpl.triggerButton.call(this)}<div class="${this.namespace}-trigger-dropdown"><div class="${this.namespace}-list-wrap">${this.options.tpl.list.call(this)}</div></div></div>${this.options.tpl.items.call(this)}</div>`;
    },
    search: function() {
      return `<input class="${this.namespace}-search" type="text" placeholder="Search...">`;
    },
    select: function() {
      return `<select class="${this.namespace}-select" name="${this.namespace}" multiple="multiple"></select>`;
    },
    optionValue: function(data) {
      if('name' in data) {
        return data.name;
      } else {
        return data;
      }
    },
    option: function(content) {
      return `<option value="${this.options.tpl.optionValue.call(this)}">${content}</option>`;
    },
    items: function() {
      return `<ul class="${this.namespace}-items"></ul>`;
    },
    item: function(content) {
      return `<li class="${this.namespace}-item">${content}${this.options.tpl.itemRemove.call(this)}</li>`;
    },
    itemRemove: function() {
      return `<span class="${this.namespace}-remove">x</span>`;
    },
    triggerButton: function() {
      return `<div class="${this.namespace}-trigger-button">Add</div>`;
    },
    list: function() {
      return `<ul class="${this.namespace}-list"></ul>`;
    },
    listItem: function(content) {
      return `<li class="${this.namespace}-list-item">${content}</li>`;
    }
  },

  onBeforeShow: null,
  onAfterShow: null,
  onBeforeHide: null,
  onAfterHide: null,
  onBeforeSearch: null,
  onAfterSearch: null,
  onBeforeSelected: null,
  onAfterSelected: null,
  onBeforeUnselect: null,
  onAfterUnselect: null,
  onBeforeItemRemove: null,
  onAfterItemRemove: null,
  onBeforeItemAdd: null,
  onAfterItemAdd: null
};
