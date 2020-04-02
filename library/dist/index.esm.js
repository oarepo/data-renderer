/*!
 * undefined vundefined
 * (c) 
 */
import deepmerge from 'deepmerge';
import startCase from 'lodash.startcase';

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function isString(obj) {
  return Object.prototype.toString.call(obj) === '[object String]';
}

function isObject(obj) {
  return Object(obj) === obj;
}

function f(decorated) {
  if (decorated === undefined) {
    // used as a decorator
    return function (inner) {
      return f(inner);
    };
  }

  var ret = function ret() {
    return decorated.apply(void 0, arguments);
  };

  ret._dataRendererApply = true;
  return ret;
}
/**
 * description
 * @param funcOrValue
 * @param extra {context, layout, data, paths, value, values, pathValues}
 * @param recursive
 * @returns {{}|*}
 */


function applyFunctions(funcOrValue, extra) {
  var recursive = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  if (funcOrValue === null || funcOrValue === undefined) {
    return funcOrValue;
  }

  if (isString(funcOrValue)) {
    return funcOrValue;
  }

  if (funcOrValue instanceof Function) {
    if (funcOrValue._dataRendererApply) {
      // the result of a function is supposed to be resolved, so do not resolve again
      return funcOrValue(extra);
    } else {
      return funcOrValue;
    }
  }

  if (recursive) {
    if (Array.isArray(funcOrValue)) {
      return funcOrValue.map(function (x) {
        return applyFunctions(x, extra, recursive);
      });
    }

    if (isObject(funcOrValue)) {
      return Object.getOwnPropertyNames(funcOrValue).filter(function (x) {
        return !x.startsWith('__');
      }).reduce(function (prev, code) {
        prev[code] = applyFunctions(funcOrValue[code], extra, // do not recurse children, they should be evaluated when their kvpair is rendererd
        recursive && code !== 'children' && code !== 'item');
        return prev;
      }, {});
    }
  }

  return funcOrValue;
}

var RendererMixin = {
  props: {
    schema: {
      type: String,
      default: 'inline'
    },
    layout: Object,
    pathLayouts: Object,
    rendererComponents: Object,
    extraProps: Object,
    prop: [String, Number]
  },
  methods: {
    renderBefore: function renderBefore(h, before) {
      return h(before);
    },
    renderAfter: function renderAfter(h, after) {
      return h(after);
    },
    getLayout: function getLayout(code, extra) {
      var schema = this.schema;
      var localLayout = this.currentLayout[code] || {};
      var globalLayout = this.$oarepo.dataRenderer.layouts[schema][code];
      var pathLayout = this.getPathLayout(this.paths, code);
      var merged = (this.$oarepo.dataRenderer.merge || deepmerge.all)([globalLayout, localLayout, pathLayout], this.$oarepo.dataRenderer.layoutMergeOptions);
      return applyFunctions(merged, extra);
    },
    getPathLayout: function getPathLayout(paths, code) {
      if (this.pathLayouts === undefined) {
        return {};
      }

      for (var i = 0; i < paths.length; i++) {
        var p = this.pathLayouts[paths[i]];

        if (p && p[code] !== undefined) {
          return p[code];
        }
      }

      return {};
    },
    renderElement: function renderElement(h, elDef, options, paths, renderChildren, classCode, extra) {
      var component = elDef.component;

      if (component === null) {
        return [];
      }

      if (component !== undefined) {
        var ret = [h(component, Object.assign({}, extra, {
          class: [].concat(_toConsumableArray(elDef.class || []), ["iqdr-".concat(classCode)], _toConsumableArray(paths.map(function (path) {
            return "iqdr-path-".concat(path.replace('/', '-'));
          }))),
          style: elDef.style,
          attrs: elDef.attrs,
          props: options
        }))];
        return ret;
      }

      var element = elDef.element;

      if (element === null) {
        return [];
      }

      if (element !== undefined) {
        var _ret = [h(element, Object.assign({}, extra, {
          class: [].concat(_toConsumableArray(elDef.class || []), ["iqdr-".concat(classCode)], _toConsumableArray(paths.map(function (path) {
            return "iqdr-path-".concat(path.replace('/', '-'));
          }))),
          style: elDef.style,
          attrs: elDef.attrs,
          props: options
        }), renderChildren ? renderChildren() : [])];
        return _ret;
      }

      return renderChildren ? renderChildren() : [];
    }
  },
  computed: {
    currentLayout: function currentLayout() {
      return this.layout || {};
    }
  }
};

var KVPairComponent = {
  name: 'DataRendererKVPair',
  mixins: [RendererMixin],
  props: {
    context: [Array, Object],
    prop: [String, Number],
    paths: Array
  },
  methods: {
    createLabel: function createLabel(h, label, value, extra) {
      var labelTranslator = this.layout.labelTranslator || this.$oarepo.dataRenderer.layouts[this.schema].labelTranslator;
      return this.renderElement(h, label, Object.assign({}, this.$props, {
        value: value
      }), this.paths, function () {
        return [labelTranslator(label.label, extra)];
      }, 'label', {});
    },
    getChildComponent: function getChildComponent(value) {
      var valueType = Object.prototype.toString.call(value);
      var type;

      if (valueType === '[object String]') {
        type = 'string';
      } else if (valueType === '[object Number]') {
        type = 'number';
      } else if (valueType === '[object Boolean]') {
        type = 'boolean';
      } else if (valueType === '[object Array]') {
        type = 'array';
      } else if (valueType === '[object Object]') {
        type = 'object';
      } else if (this.layout.children !== undefined) {
        type = 'object';
      } else if (this.layout.item !== undefined) {
        type = 'array';
      } else {
        type = 'undefined';
      }

      return this.rendererComponents[type] || this.$oarepo.dataRenderer.rendererComponents[type];
    },
    renderChildren: function renderChildren(h, value, extra) {
      var ret = [];
      var label = this.getLayout('label', extra);

      if (label.label) {
        ret.push(this.createLabel(h, label, value, extra));
      }

      var childComponent = this.getChildComponent(value);
      ret.push(h(childComponent, {
        props: {
          value: value,
          schema: this.schema,
          layout: this.layout,
          paths: this.paths,
          pathLayouts: this.pathLayouts,
          rendererComponents: this.rendererComponents,
          extraProps: this.extraProps,
          context: this.context,
          prop: this.prop
        },
        scopedSlots: this.$scopedSlots,
        slots: this.slots
      }));
      return ret;
    }
  },
  render: function render(h) {
    var _this = this;

    var value = this.context[this.prop];
    var extra = Object.assign({}, this.$props, {
      value: value
    });
    return this.renderElement(h, this.getLayout('wrapper', extra), Object.assign({}, this.$props, {
      value: value
    }), this.paths, function () {
      return _this.renderChildren(h, value, extra);
    }, 'wrapper', {});
  }
};

function range(n) {
  return Array.from(Array(n).keys());
}

var ArrayComponent = {
  name: 'data-renderer-array-component',
  mixins: [RendererMixin],
  props: {
    value: Array,
    paths: Array
  },
  render: function render(h) {
    var _this = this;

    var layout = this.currentLayout;
    var value = this.value;
    var itemLayout = layout.item;

    if (itemLayout === undefined) {
      itemLayout = this.$oarepo.dataRenderer.createDynamicArrayLayout({
        value: value,
        paths: this.paths,
        schema: this.schema,
        layout: layout,
        pathLayouts: this.pathLayouts,
        rendererComponents: this.rendererComponents,
        vue: this
      });
    }

    itemLayout.showEmpty = layout.showEmpty || this.$oarepo.dataRenderer.layouts[this.schema].showEmpty;
    return this.renderElement(h, this.getLayout('arrayWrapper', this.$props), this.$props, this.paths, function () {
      if (!value) {
        return [];
      }

      return range(value.length).map(function (index) {
        return h(KVPairComponent, {
          props: {
            context: value,
            prop: index,
            schema: _this.schema,
            layout: Object.assign({}, _this.$oarepo.dataRenderer.layouts[_this.schema], {}, itemLayout),
            // paths: this.paths,
            paths: [].concat(_toConsumableArray(_this.paths.map(function (path) {
              return "".concat(path, "/").concat(index);
            })), ["".concat(index)]),
            pathLayouts: _this.pathLayouts,
            rendererComponents: _this.rendererComponents,
            extraProps: _this.extraProps
          },
          scopedSlots: _this.$scopedSlots,
          slots: _this.slots
        });
      });
    }, 'arrayWrapper', {});
  },
  computed: {}
};

var ObjectComponent = {
  name: 'data-renderer-object-component',
  mixins: [RendererMixin],
  props: {
    value: Object,
    paths: Array
  },
  render: function render(h) {
    var _this = this;

    var layout = this.currentLayout;
    var value = this.value || {};
    var childrenLayouts = layout.children;

    if (childrenLayouts === undefined) {
      childrenLayouts = this.$oarepo.dataRenderer.createDynamicObjectLayout({
        value: value,
        paths: this.paths,
        schema: this.schema,
        layout: layout,
        vue: this
      });
    }

    var valueProps = Object.keys(value);

    if (valueProps.length !== childrenLayouts.length) {
      var childrenLayoutProps = [];
      childrenLayouts.forEach(function (childLayout) {
        return childrenLayoutProps.push(childLayout.prop);
      });
      valueProps.forEach(function (valueProp) {
        if (!childrenLayoutProps.includes(valueProp)) {
          childrenLayouts.push({
            prop: valueProp
          });
        }
      });
    }

    var showEmpty = layout.showEmpty || this.$oarepo.dataRenderer.layouts[this.schema].showEmpty;
    return this.renderElement(h, this.getLayout('childrenWrapper', Object.assign({}, this.$props, {
      value: value
    })), Object.assign({}, this.$props, {
      value: value
    }), this.paths, function () {
      var ret = [];

      if (layout.before) {
        ret.push(_this.renderBefore(h, layout.before));
      }

      var renderedItems = childrenLayouts.map(function (childLayout) {
        var prop = childLayout.prop;
        var dynamicLayout = Object.assign({}, _this.$oarepo.dataRenderer.createDynamicObjectPropLayout({
          value: prop,
          schema: _this.schema,
          vue: _this
        }), {}, childLayout, {
          showEmpty: showEmpty
        });

        if ((value[prop] === null || value[prop] === undefined) && !showEmpty) {
          return;
        }

        ret.push(h(KVPairComponent, {
          props: {
            context: value,
            prop: prop,
            schema: _this.schema,
            layout: dynamicLayout,
            paths: [].concat(_toConsumableArray(_this.paths.map(function (path) {
              return "".concat(path, "/").concat(prop);
            })), [prop]),
            pathLayouts: _this.pathLayouts,
            rendererComponents: _this.rendererComponents,
            extraProps: _this.extraProps
          },
          scopedSlots: _this.$scopedSlots,
          slots: _this.slots
        }));
      });
      ret.push(renderedItems);

      if (layout.after) {
        ret.push(_this.renderAfter(h, layout.after));
      }

      return ret;
    }, 'childrenWrapper', {});
  },
  computed: {}
};

var DataRendererComponent = {
  name: 'data-renderer',
  props: {
    schema: {
      type: String,
      default: 'inline'
    },
    layout: Object,
    data: Object,
    pathLayouts: Object,
    rendererComponents: Object,
    extraProps: Object
  },
  render: function render(h) {
    var context = this.data;

    if (Array.isArray(context)) {
      return h(ArrayComponent, {
        props: {
          value: context,
          paths: [],
          schema: this.schema,
          layout: this.layout || {},
          pathLayouts: this.pathLayouts,
          rendererComponents: this.rendererComponents || {},
          extraProps: this.extraProps
        }
      });
    } else {
      return h(ObjectComponent, {
        props: {
          value: context,
          paths: [],
          schema: this.schema,
          layout: this.layout || {},
          pathLayouts: this.pathLayouts,
          rendererComponents: this.rendererComponents || {},
          extraProps: this.extraProps
        }
      });
    }
  }
};

function createDynamicArrayLayout(_ref) {
  var schema = _ref.schema,
      vue = _ref.vue;
  return vue.$oarepo.dataRenderer.layouts[schema];
}

function createDynamicObjectLayout(_ref2) {
  var value = _ref2.value,
      schema = _ref2.schema,
      vue = _ref2.vue;
  var props = Object.keys(value);
  var itemDef = vue.$oarepo.dataRenderer.layouts[schema];
  return props.map(function (prop) {
    var item = Object.assign({}, itemDef, {
      prop: prop
    });

    if (!item.label.label) {
      item.label = Object.assign({}, item.label, {
        label: prop
      });
    }

    return item;
  });
}

function createDynamicObjectPropLayout(_ref3) {
  var value = _ref3.value,
      schema = _ref3.schema,
      vue = _ref3.vue;
  var itemDef = vue.$oarepo.dataRenderer.layouts[schema];
  var item = Object.assign({}, itemDef);

  if (!item.label.label) {
    item.label = Object.assign({}, item.label, {
      label: value
    });
  }

  return item;
}

var StringComponent = {
  name: 'data-renderer-string-component',
  mixins: [RendererMixin],
  props: {
    value: String,
    paths: Array
  },
  render: function render(h) {
    var _this = this;

    var valueDef = this.getLayout('value', this.$props);
    return this.renderElement(h, valueDef, this.$props, this.paths, function () {
      return [_this.value];
    }, 'value', {});
  },
  computed: {}
};

var NumberComponent = {
  name: 'data-renderer-number-component',
  mixins: [RendererMixin],
  props: {
    value: Number,
    paths: Array
  },
  render: function render(h) {
    var _this = this;

    var value = this.getLayout('value', this.$props);
    return this.renderElement(h, value, this.$props, this.paths, function () {
      return [_this.value.toString()];
    }, 'value', {});
  },
  computed: {}
};

var BooleanComponent = {
  name: 'data-renderer-boolean-component',
  mixins: [RendererMixin],
  props: {
    value: Boolean,
    paths: Array
  },
  render: function render(h) {
    var _this = this;

    var value = this.getLayout('value', this.$props);
    return this.renderElement(h, value, this.$props, this.paths, function () {
      return [_this.value.toString()];
    }, 'value', {});
  },
  computed: {}
};

var UndefinedComponent = {
  name: 'data-renderer-undefined-component',
  mixins: [RendererMixin],
  props: {
    value: [undefined, null],
    paths: Array
  },
  render: function render(h) {
    var value = this.getLayout('value', this.$props);
    return this.renderElement(h, value, this.$props, this.paths, function () {
      return ['---'];
    }, 'value', {});
  },
  computed: {}
};

var index = {
  install: function install(Vue, options) {
    options = Object.assign({}, options, {
      showEmpty: false
    });
    Vue.component(options.dataRendererName || DataRendererComponent.name, DataRendererComponent);

    if (Vue.prototype.$oarepo === undefined) {
      Vue.prototype.$oarepo = {};
    }

    Vue.prototype.$oarepo.dataRenderer = Object.assign({
      layouts: {
        inline: {
          childrenWrapper: {
            element: 'div',
            style: {
              'margin-left': '30px'
            }
          },
          linkWrapper: {
            element: 'router-link',
            attrs: {
              to: f(function (options) {
                return options.url;
              })
            }
          },
          arrayWrapper: {
            element: 'div',
            style: {
              display: 'inline-table'
            },
            class: [],
            attrs: {}
          },
          wrapper: {
            element: 'div'
          },
          label: {
            element: 'label'
          },
          value: {
            element: 'div',
            style: {
              display: 'inline'
            }
          },
          // labelTranslator: (label, /*extra*/) => `${label}: `,
          labelTranslator: function labelTranslator(label) {
            return (
              /*extra*/
              "".concat(startCase(label), ": ")
            );
          },
          showEmpty: false
        },
        block: {
          childrenWrapper: {
            element: 'div',
            style: {
              'margin-left': '30px'
            }
          },
          arrayWrapper: {
            element: 'div',
            style: {
              display: 'block'
            },
            class: [],
            attrs: {}
          },
          wrapper: {
            element: 'div'
          },
          label: {
            element: 'label',
            style: {
              'vertical-align': 'top'
            }
          },
          value: {
            element: 'div'
          },
          labelTranslator: function labelTranslator(label) {
            return (
              /*extra*/
              startCase(label)
            );
          },
          showEmpty: false
        },
        table: {
          childrenWrapper: {
            element: 'table',
            style: {
              'border-collapse': 'collapse'
            }
          },
          arrayWrapper: {
            element: 'div',
            style: {
              display: 'block'
            },
            class: [],
            attrs: {}
          },
          wrapper: {
            element: 'tr'
          },
          label: {
            element: 'td',
            style: {
              'vertical-align': 'top'
            }
          },
          value: {
            element: 'td'
          },
          labelTranslator: function labelTranslator(label) {
            return (
              /*extra*/
              startCase(label)
            );
          },
          showEmpty: false
        },
        flex: {
          childrenWrapper: {
            element: 'div'
          },
          arrayWrapper: {
            element: 'div',
            style: {
              display: 'block'
            },
            class: [],
            attrs: {}
          },
          wrapper: {
            element: 'div',
            class: ['row', 'q-col-gutter-sm']
          },
          label: {
            element: 'label',
            style: {
              'vertical-align': 'top'
            },
            class: ['col-3']
          },
          value: {
            element: 'div',
            style: {
              display: 'block'
            },
            class: ['col-9']
          },
          labelTranslator: function labelTranslator(label) {
            return (
              /*extra*/
              startCase(label)
            );
          },
          showEmpty: false
        }
      },
      layoutMergeOptions: {},
      rendererComponents: {
        string: StringComponent,
        number: NumberComponent,
        boolean: BooleanComponent,
        undefined: UndefinedComponent,
        array: ArrayComponent,
        object: ObjectComponent
      },
      createDynamicObjectLayout: createDynamicObjectLayout,
      createDynamicArrayLayout: createDynamicArrayLayout,
      createDynamicObjectPropLayout: createDynamicObjectPropLayout
    }, options);
  }
};

export default index;
export { ArrayComponent, BooleanComponent, DataRendererComponent, NumberComponent, ObjectComponent, StringComponent, UndefinedComponent, f };
