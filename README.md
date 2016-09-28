# [jQuery selective](https://github.com/amazingSurge/jquery-selective) ![bower][bower-image] [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url] [![prs-welcome]](#contributing)

> A jquery plugin that used to tagging, selectors and so on.

## Table of contents
- [Main files](#main-files)
- [Quick start](#quick-start)
- [Requirements](#requirements)
- [Usage](#usage)
- [Examples](#examples)
- [Options](#options)
- [Methods](#methods)
- [Events](#events)
- [No conflict](#no-conflict)
- [Browser support](#browser-support)
- [Contributing](#contributing)
- [Development](#development)
- [Changelog](#changelog)
- [Copyright and license](#copyright-and-license)

## Main files
```
dist/
├── jquery-selective.js
├── jquery-selective.es.js
├── jquery-selective.min.js
└── css/
    ├── selective.css
    └── selective.min.css
```

## Quick start
Several quick start options are available:
#### Download the latest build

 * [Development](https://raw.githubusercontent.com/amazingSurge/jquery-selective/master/dist/jquery-selective.js) - unminified
 * [Production](https://raw.githubusercontent.com/amazingSurge/jquery-selective/master/dist/jquery-selective.min.js) - minified

#### Install From Bower
```sh
bower install jquery-selective --save
```

#### Install From Npm
```sh
npm install jquery-selective --save
```

#### Build From Source
If you want build from source:

```sh
git clone git@github.com:amazingSurge/jquery-selective.git
cd jquery-selective
npm install
npm install -g gulp-cli babel-cli
gulp build
```

Done!

## Requirements
`jquery-selective` requires the latest version of [`jQuery`](https://jquery.com/download/) and [`jquery-mousewheel`](https://github.com/jquery/jquery-mousewheel) if we need mouse wheel support.

## Usage
#### Including files:

```html
<link rel="stylesheet" href="/path/to/selective.css">
<script src="/path/to/jquery.js"></script>
<script src="/path/to/jquery.mousewheel"></script>
<script src="/path/to/jquery-selective.js"></script>
```

#### Required HTML structure

```html
<div class="example"></div>
```

#### Initialization
All you need to do is call the plugin on the element:

```javascript
jQuery(function($) {
  $('.example').selective(); 
});
```

## Examples
There are some example usages that you can look at to get started. They can be found in the
[examples folder](https://github.com/amazingSurge/jquery-selective/tree/master/examples).

## Options
`jquery-selective` can accept an options object to alter the way it behaves. You can see the default options by call `$.selective.setDefaults()`. The structure of an options object is as follows:

```
{
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
}
```

## Methods
Methods are called on selective instances through the selective method itself.
You can also save the instances to variable for further use.

```javascript
// call directly
$().selective('destory');

// or
var api = $().data('selective');
api.destory();
```

#### enable()
Enable the selective functions.
```javascript
$().selective('enable');
```

#### disable()
Disable the selective functions.
```javascript
$().selective('disable');
```

#### destroy()
Destroy the selective instance.
```javascript
$().selective('destroy');
```

## Events
`jquery-selective` provides custom events for the plugin’s unique actions. 

```javascript
$('.the-element').on('selective::ready', function (e) {
  // on instance ready
});

```

Event   | Description
------- | -----------
ready   | Fires when the instance is ready for API use.
enable  | This event is fired immediately when the `enable` instance method has been called.
disable | This event is fired immediately when the `disable` instance method has been called.
destroy | Fires when an instance is destroyed. 

## No conflict
If you have to use other plugin with the same namespace, just call the `$.selective.noConflict` method to revert to it.

```html
<script src="other-plugin.js"></script>
<script src="jquery-selective.js"></script>
<script>
  $.selective.noConflict();
  // Code that uses other plugin's "$().selective" can follow here.
</script>
```

## Browser support

Tested on all major browsers.

| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/safari/safari_32x32.png" alt="Safari"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/chrome/chrome_32x32.png" alt="Chrome"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/firefox/firefox_32x32.png" alt="Firefox"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/edge/edge_32x32.png" alt="Edge"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/internet-explorer/internet-explorer_32x32.png" alt="IE"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/opera/opera_32x32.png" alt="Opera"> |
|:--:|:--:|:--:|:--:|:--:|:--:|
| Latest ✓ | Latest ✓ | Latest ✓ | Latest ✓ | 9-11 ✓ | Latest ✓ |

As a jQuery plugin, you also need to see the [jQuery Browser Support](http://jquery.com/browser-support/).

## Contributing
Anyone and everyone is welcome to contribute. Please take a moment to
review the [guidelines for contributing](CONTRIBUTING.md). Make sure you're using the latest version of `jquery-selective` before submitting an issue. There are several ways to help out:

* [Bug reports](CONTRIBUTING.md#bug-reports)
* [Feature requests](CONTRIBUTING.md#feature-requests)
* [Pull requests](CONTRIBUTING.md#pull-requests)
* Write test cases for open bug issues
* Contribute to the documentation

## Development
`jquery-selective` is built modularly and uses Gulp as a build system to build its distributable files. To install the necessary dependencies for the build system, please run:

```sh
npm install -g gulp
npm install -g babel-cli
npm install
```

Then you can generate new distributable files from the sources, using:
```
gulp build
```

More gulp tasks can be found [here](CONTRIBUTING.md#available-tasks).

## Changelog
To see the list of recent changes, see [Releases section](https://github.com/amazingSurge/jquery-selective/releases).

## Copyright and license
Copyright (C) 2016 amazingSurge.

Licensed under [the LGPL license](LICENSE).

[⬆ back to top](#table-of-contents)

[bower-image]: https://img.shields.io/bower/v/jquery-selective.svg?style=flat
[bower-link]: https://david-dm.org/amazingSurge/jquery-selective/dev-status.svg
[npm-image]: https://badge.fury.io/js/jquery-selective.svg?style=flat
[npm-url]: https://npmjs.org/package/jquery-selective
[license]: https://img.shields.io/npm/l/jquery-selective.svg?style=flat
[prs-welcome]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg
[daviddm-image]: https://david-dm.org/amazingSurge/jquery-selective.svg?style=flat
[daviddm-url]: https://david-dm.org/amazingSurge/jquery-selective