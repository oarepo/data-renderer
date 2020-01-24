/*!
 * undefined vundefined
 * (c) 
 */
import { JSONPath } from 'jsonpath-plus';
import deepmerge from 'deepmerge';
import startCase from 'lodash.startcase';

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function decomposePointer(pointer) {
  pointer = pointer.split('/');
  return pointer.filter(function (x) {
    return x !== '';
  }).map(function (x) {
    return x.replace(/^[0-9]$/, 'arritm');
  });
}

function addPointerToPaths(paths, key, pointer) {
  if (pointer === undefined) {
    return [].concat(_toConsumableArray((paths || []).map(function (x) {
      return "".concat(x, "/").concat(key);
    })), [key]);
  }

  var decomposedPointer = decomposePointer(pointer);
  var pointerWithoutArrays = decomposedPointer.join('/');
  return [].concat(_toConsumableArray((paths || []).map(function (x) {
    return "".concat(x, "/").concat(key || pointerWithoutArrays);
  })), _toConsumableArray(key ? [key] : decomposedPointer.reduce(function (arr, path) {
    return [].concat(_toConsumableArray(arr.map(function (x) {
      return "".concat(x, "/").concat(path);
    })), [path]);
  }, [])));
}

function evaluatePath(jsonPath, context, jsonPointer, paths, key) {
  if (!jsonPath) {
    if (key) {
      return [{
        jsonPointer: jsonPointer,
        paths: addPointerToPaths(paths, key),
        value: context
      }];
    } else {
      return [{
        jsonPointer: jsonPointer,
        paths: paths,
        value: context
      }];
    }
  }

  var values = JSONPath({
    path: jsonPath,
    json: context,
    resultType: 'all',
    flatten: true
  });

  if (!values) {
    return undefined;
  }

  if (values.length === 0) {
    return undefined;
  }

  return values.map(function (value) {
    return {
      jsonPointer: "".concat(jsonPointer).concat(value.pointer),
      paths: addPointerToPaths(paths, key, value.pointer),
      value: value.value
    };
  });
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

function applyFunctions(funcOrValue, extra
/*{context, layout, data, paths, value, values, pathValues}*/
) {
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
      }).reduce(function (prev, current) {
        prev[current] = applyFunctions(funcOrValue[current], extra, // do not recurse children, they should be evaluated when their kvpair is rendererd
        recursive && current !== 'children');
        return prev;
      }, {});
    }
  }

  return funcOrValue;
}

function findPathInDict(paths, mapper, element, schemaCode) {
  if (element) {
    element = "".concat(element, "-");
  } else {
    element = '';
  }

  paths = paths || [];

  if (!paths.length) {
    return undefined;
  }

  if (!mapper || !Object.getOwnPropertyNames(mapper).length) {
    return undefined;
  }

  var value = mapper["-".concat(element).concat(paths[0], "$").concat(schemaCode)];

  if (value !== undefined) {
    return value;
  }

  value = mapper["-".concat(element).concat(paths[0])];

  if (value !== undefined) {
    return value;
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = paths[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var path = _step.value;
      value = mapper["".concat(element).concat(path, "$").concat(schemaCode)];

      if (value !== undefined) {
        return value;
      }

      value = mapper["".concat(element).concat(path)];

      if (value !== undefined) {
        return value;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return undefined;
}

var SKIP_WRAPPER = '---skip-wrapper---';

var RendererMixin = {
  methods: {
    renderElement: function renderElement(collected, h, layout, code, options, renderChildren, classCode, extra) {
      if (collected[code] === undefined) {
        collected[code] = [];
      }

      if (classCode === undefined) {
        classCode = code;
      }

      if (extra === undefined) {
        extra = {};
      }

      var elDef = layout[code];
      var slot = findPathInDict(options.paths, this.$scopedSlots, code, this.currentSchemaCode);

      if (slot) {
        var _collected$code;

        var ret = slot(options);

        (_collected$code = collected[code]).push.apply(_collected$code, _toConsumableArray(ret));

        return ret;
      }

      var component = elDef.component;

      if (component === null) {
        return [];
      }

      if (component !== undefined && component !== SKIP_WRAPPER) {
        var _collected$code2;

        var _ret = [h(component, Object.assign({}, extra, {
          class: [].concat(_toConsumableArray(elDef.class || []), ["iqdr-".concat(classCode)], _toConsumableArray(options.paths.map(function (path) {
            return "iqdr-path-".concat(path.replace('/', '-'));
          }))),
          style: elDef.style,
          attrs: elDef.attrs,
          props: options
        }))];

        (_collected$code2 = collected[code]).push.apply(_collected$code2, _ret);

        return _ret;
      }

      var element = elDef.element;

      if (element === null) {
        return [];
      }

      if (element !== undefined && element !== SKIP_WRAPPER) {
        var _collected$code3;

        var _ret2 = [h(element, Object.assign({}, extra, {
          class: [].concat(_toConsumableArray(elDef.class || []), ["iqdr-".concat(classCode)], _toConsumableArray(options.paths.map(function (path) {
            return "iqdr-path-".concat(path.replace('/', '-'));
          }))),
          style: elDef.style,
          attrs: elDef.attrs,
          props: options
        }), renderChildren ? renderChildren(collected, h, layout, options) : [])];

        (_collected$code3 = collected[code]).push.apply(_collected$code3, _ret2);

        return _ret2;
      }

      return renderChildren ? renderChildren(collected, h, layout, options) : [];
    }
  }
};

var KVPairComponent = {
  props: {
    context: [Array, Object],
    data: Object,
    layout: [Object, String],
    paths: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    jsonPointer: {
      type: String,
      default: ''
    },
    layoutMergeOptions: {
      type: Object,
      default: function _default() {}
    },
    pathLayouts: {
      type: Object,
      default: function _default() {}
    },
    url: String,
    schema: {
      type: String,
      default: 'inline'
    },
    nestedChildren: Boolean,
    showEmpty: Boolean,
    labelTranslator: Function,
    layoutTranslator: Function,
    layoutPostProcessor: Function,
    dynamic: Boolean,
    extraProps: Object
  },
  mixins: [RendererMixin],
  name: 'DataRendererKVPair',
  render: function render(h) {
    if (this.layout === undefined) {
      return h('div');
    }

    var layout = this.currentLayout;

    if (layout === null) {
      return h('div');
    }

    var pathValues = this.pathValues;
    var values = this.values;
    var ret = [];
    var collected = {};
    var options = Object.assign({}, this.extraProps || {}, {
      context: this.context,
      layout: this.currentLayout,
      data: this.data,
      vue: this,
      paths: pathValues && pathValues.length ? pathValues[0].paths : this.paths,
      value: values.length === 1 ? values[0] : values,
      url: this.url,
      values: values,
      pathValues: pathValues,
      schema: this.currentSchemaCode,
      currentSchema: this.currentSchema,
      parentJSONPointer: this.jsonPointer
    });

    if (values.length || this.currentShowEmpty) {
      ret.push.apply(ret, _toConsumableArray(this.renderWrapper(collected, h, layout, options).flat()));
    }

    if (this.currentLayoutPostProcessor) {
      this.currentLayoutPostProcessor(collected, options);
    }

    if (ret.length === 1) {
      return ret[0];
    }

    return this.renderElement(collected, h, layout, 'multiple', options, function () {
      return ret;
    }); // return h('div', {
    //     class: ret.length === 0 ? 'iqdr-empty' : `iqdr-multiple-${ret.length}`
    // }, ret)
  },
  methods: {
    renderWrapper: function renderWrapper(collected, h, def, options) {
      return this.renderElement(collected, h, def, 'wrapper', options, this.renderWrapperChildren);
    },
    renderWrapperChildren: function renderWrapperChildren(collected, h, def, options) {
      var _this = this;

      var ret = [];
      var label = def.label.value || def.label.label;
      label = this.currentLabelTranslator ? this.currentLabelTranslator(label, options) : label;

      if (label || def.icon && def.icon.value) {
        ret.push.apply(ret, _toConsumableArray(this.renderElement(collected, h, def, 'label', Object.assign({}, options, {
          label: label
        }), function () {
          var rr = [];

          if (def.icon && def.icon.value) {
            rr.push.apply(rr, _toConsumableArray(_this.renderElement(collected, h, def, 'icon', Object.assign({}, options, {
              label: label
            }))));
          }

          if (label) {
            rr.push(label);
          }

          return rr;
        })));
      }

      if (this.currentChildrenDef && this.currentNestedChildren || !this.currentChildrenDef && (options.values.length > 0 || this.currentShowEmpty)) {
        ret.push.apply(ret, _toConsumableArray(this.renderElement(collected, h, def, 'value-wrapper', Object.assign({}, options), this.renderValues)));
      }

      if (!this.currentNestedChildren) {
        ret.push.apply(ret, _toConsumableArray(this.renderChildren(collected, h, def, options)));
      }

      return ret.flat();
    },
    renderValues: function renderValues(collected, h, def, options) {
      var _this2 = this;

      var ret = [];

      if (!this.currentChildrenDef) {
        ret.push.apply(ret, _toConsumableArray((options.pathValues || []).map(function (pathValue, idx) {
          var renderedValue = [];
          var value = pathValue.value;
          var valueDef = Object.assign({}, options.layout);

          if (Array.isArray(_this2.context) && valueDef.path === '*') {
            valueDef.path = idx.toString();
          }

          if (Array.isArray(value)) {
            var itemLayout = _this2.merge(_this2.currentLayout, _this2.currentLayout.array_item); // render the value as an array.


            renderedValue = _this2.renderKVPair(h, itemLayout, pathValue);
          } else {
            renderedValue = _this2.renderElement(collected, h, valueDef, 'value', Object.assign({}, options, {
              layout: valueDef,
              value: value,
              valueIndex: idx,
              paths: pathValue.paths,
              jsonPointer: pathValue.jsonPointer
            }), function () {
              return isString(value) ? value : JSON.stringify(value);
            });
          }

          if (def.link) {
            return _this2.renderElement(collected, h, valueDef, 'link-wrapper', Object.assign({}, options, {
              value: value,
              valueIndex: idx,
              paths: pathValue.paths
            }), function () {
              return renderedValue;
            }, 'link');
          }

          return renderedValue;
        })));
      }

      if (this.currentChildrenDef && this.currentNestedChildren) {
        ret.push.apply(ret, _toConsumableArray(this.renderChildren(collected, h, def, options)));
      }

      return ret.flat();
    },
    renderChildren: function renderChildren(collected, h, def, options) {
      var _this3 = this;

      if (!this.currentChildrenDef) {
        return [];
      }

      var ret = this.renderElement(collected, h, def, 'children-wrapper', options, function (collected, h, def, options) {
        if (collected.children === undefined) {
          collected.children = [];
        }

        return options.pathValues.map(function (pathValue) {
          var renderedChildren;

          if (Array.isArray(pathValue.value)) {
            // the value is an array, so render it recursively
            var itemLayout = _this3.merge(_this3.currentLayout, _this3.currentLayout.array_item);

            renderedChildren = _this3.renderKVPair(h, itemLayout, pathValue);
          } else {
            renderedChildren = _this3.currentChildrenDef.map(function (childDef) {
              var ret = _this3.renderKVPair(h, childDef, pathValue);

              collected.children.push(ret);
              return ret;
            });
          }

          if (Array.isArray(_this3.context)) {
            // rendering complex items of an array
            return _this3.renderElement(collected, h, def, 'children-arritm-wrapper', options, function () {
              return renderedChildren;
            });
          }

          return renderedChildren;
        }).flat();
      });
      return ret;
    },
    renderKVPair: function renderKVPair(h, layout, pathValue) {
      return h(KVPairComponent, {
        props: {
          context: isObject(pathValue.value) ? pathValue.value : this.context,
          data: this.data,
          layout: layout,
          paths: pathValue.paths,
          jsonPointer: pathValue.jsonPointer,
          layoutMergeOptions: this.layoutMergeOptions,
          pathLayouts: this.pathLayouts,
          url: this.url,
          schema: this.currentSchemaCode,
          nestedChildren: this.nestedChildren,
          showEmpty: this.showEmpty,
          labelTranslator: this.labelTranslator,
          dynamic: this.currentDynamic,
          layoutTranslator: this.layoutTranslator,
          layoutPostProcessor: this.layoutPostProcessor,
          extraProps: this.extraProps
        },
        scopedSlots: this.$scopedSlots,
        slots: this.slots
      });
    },
    applyFunctions: function applyFunctions$1(what, ifneeded) {
      var recursive = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var layout = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;

      if (ifneeded && !(what instanceof Function)) {
        return what;
      }

      var pathValues = this.pathValues;
      var values = this.values;
      return applyFunctions(what, {
        context: this.context,
        layout: layout || this.layout,
        data: this.data,
        vue: this,
        paths: pathValues && pathValues.length ? pathValues[0].paths : this.paths,
        value: values.length === 1 ? values[0] : values,
        url: this.url,
        values: values,
        pathValues: pathValues
      }, recursive, this.$oarepo.dataRenderer.singleTranslationLayoutValues, this.$oarepo.dataRenderer.untranslatedLayoutValues);
    },
    getWithDefault: function getWithDefault(propName) {
      var applyFunctions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var layout = this.currentLayout;

      if (layout === undefined) {
        return false;
      }

      var tnc = applyFunctions ? this.applyFunctions(layout[propName], true, true, layout) : layout[propName];

      if (tnc !== undefined) {
        return tnc;
      }

      tnc = applyFunctions ? this.applyFunctions(this[propName], true, true, layout) : this[propName];

      if (tnc !== undefined) {
        return tnc;
      }

      tnc = applyFunctions ? this.applyFunctions(this.currentSchema[propName], true, true, layout) : this.currentSchema[propName];

      if (tnc !== undefined) {
        return tnc;
      }

      return applyFunctions ? this.applyFunctions(this.$oarepo.dataRenderer[propName], true, true, layout) : this.$oarepo.dataRenderer[propName];
    },
    merge: function merge() {
      for (var _len = arguments.length, what = new Array(_len), _key = 0; _key < _len; _key++) {
        what[_key] = arguments[_key];
      }

      return ((this.layoutMergeOptions || {}).merge || deepmerge.all)(what, this.layoutMergeOptions);
    }
  },
  computed: {
    pathValues: function pathValues() {
      return evaluatePath(isString(this.layout) ? this.layout : this.layout.path, this.context, this.jsonPointer, this.paths, this.layout.key);
    },
    values: function values() {
      if (!this.pathValues) {
        return [];
      }

      return this.pathValues.map(function (x) {
        return x.value;
      });
    },
    currentSchemaCode: function currentSchemaCode() {
      return this.schema || 'inline';
    },
    currentSchema: function currentSchema() {
      return this.applyFunctions(this.$oarepo.dataRenderer.schemas[this.currentSchemaCode]);
    },
    currentLayout: function currentLayout() {
      var pathValues = this.pathValues;
      var def = this.applyFunctions(this.layout, true, false);

      if (isString(def)) {
        def = {
          path: def,
          label: {
            value: def
          }
        };
      }

      if (isString(def.label)) {
        def = Object.assign({}, def, {
          label: {
            value: def.label
          }
        });
      }

      var overridenPath;

      if (pathValues && pathValues.length) {
        overridenPath = pathValues[0].paths;
      } else {
        overridenPath = addPointerToPaths(this.paths, def.key, def.path);
      }

      var overridenLayout = findPathInDict(overridenPath, this.pathLayouts, null, this.currentSchemaCode);

      if (overridenLayout === null) {
        return null;
      }

      overridenLayout = this.applyFunctions(overridenLayout, true, false);
      var mergedLayout = this.merge(this.currentSchema, def, overridenLayout || {});
      var ret = this.applyFunctions(mergedLayout, false, true, mergedLayout);

      if (this.layoutTranslator) {
        return this.layoutTranslator(ret, {
          pathValues: this.pathValues,
          paths: pathValues && pathValues.length ? pathValues[0].paths : this.paths,
          schema: this.currentSchemaCode,
          vue: this,
          url: this.url,
          values: this.values
        });
      }

      return ret;
    },
    currentChildrenDef: function currentChildrenDef() {
      var def = this.currentLayout;

      if (!def) {
        return undefined;
      }

      if (def.children !== undefined) {
        return def.children;
      }

      if (!this.currentDynamic) {
        return undefined;
      }

      if (!this.pathValues) {
        return undefined;
      }

      var children = {};
      this.pathValues.forEach(function (x) {
        if (!isObject(x.value)) {
          return;
        }

        Object.keys(x.value).forEach(function (k) {
          children[k] = true;
        });
      });
      children = Object.keys(children);

      if (children.length) {
        return children.map(function (x) {
          return {
            path: x,
            label: x
          };
        });
      } else {
        return undefined;
      }
    },
    currentNestedChildren: function currentNestedChildren() {
      return this.getWithDefault('nestedChildren');
    },
    currentShowEmpty: function currentShowEmpty() {
      return this.getWithDefault('showEmpty');
    },
    currentLabelTranslator: function currentLabelTranslator() {
      return this.getWithDefault('labelTranslator', false);
    },
    currentDynamic: function currentDynamic() {
      return this.getWithDefault('dynamic');
    },
    currentLayoutPostProcessor: function currentLayoutPostProcessor() {
      return this.getWithDefault('layoutPostProcessor', false);
    }
  }
};

var DataRendererComponent = {
  name: 'data-renderer',
  props: {
    data: Object,
    layout: {
      type: [Array, Object]
    },
    url: String,
    root: Object,
    showEmpty: Boolean,
    nestedChildren: Boolean,
    schema: {
      type: String,
      default: 'inline'
    },
    labelTranslator: Function,
    dynamic: Boolean,
    pathLayouts: {
      type: [Function, Object]
    },
    layoutTranslator: Function,
    layoutPostProcessor: Function,
    layoutMergeOptions: Object,
    // to be used for deepmerge
    extraProps: Object // extra props passed to the children

  },
  computed: {
    currentLayoutMergeOptions: function currentLayoutMergeOptions() {
      return this.layoutMergeOptions || this.$oarepo.dataRenderer.layoutMergeOptions;
    },
    currentSchema: function currentSchema() {
      return this.$oarepo.dataRenderer.schemas[this.schema || 'inline'];
    }
  },
  render: function render(h) {
    var layout = this.layout;

    if (layout instanceof Function) {
      layout = layout({
        context: this.data,
        layout: layout,
        data: this.data,
        paths: [],
        value: this.data,
        values: [this.data],
        pathValues: [{
          paths: [],
          jsonPointer: undefined,
          value: this.data
        }]
      });
    }

    if (!Array.isArray(layout) && layout !== undefined) {
      layout = [layout];
    }

    return h(KVPairComponent, {
      props: {
        context: this.data,
        data: this.data,
        layout: Object.assign({}, ((this.currentLayoutMergeOptions || {}).merge || deepmerge.all)([this.$oarepo.dataRenderer.root, {
          wrapper: this.currentSchema.root
        } || {}, {
          wrapper: {
            class: ['iqdr-root', "iqdr-root-".concat(this.schema || 'inline')]
          }
        }, this.root || {}], this.currentLayoutMergeOptions), {
          children: layout,
          dynamic: this.dynamic || this.layout === undefined
        }),
        paths: [],
        jsonPointer: undefined,
        layoutMergeOptions: this.currentLayoutMergeOptions,
        pathLayouts: this.pathLayouts,
        url: this.url,
        schema: this.schema,
        nestedChildren: this.nestedChildren,
        showEmpty: this.showEmpty,
        labelTranslator: this.labelTranslator,
        dynamic: this.dynamic,
        layoutTranslator: this.layoutTranslator,
        layoutPostProcessor: this.layoutPostProcessor,
        extraProps: this.extraProps
      },
      scopedSlots: this.$scopedSlots,
      slots: this.slots
    });
  }
};

var index = {
  install: function install(Vue, options) {
    options = Object.assign({
      labelTranslator: function labelTranslator(label, options) {
        if (!label) {
          return label;
        }

        label = startCase(label);

        if (options.schema === 'inline' && label) {
          return "".concat(label, ": ");
        }

        return label;
      }
    }, options);
    Vue.component(options.dataRendererName || DataRendererComponent.name, DataRendererComponent);

    if (Vue.prototype.$oarepo === undefined) {
      Vue.prototype.$oarepo = {};
    }

    var icon = options.icon || {
      element: null,
      component: null
    };
    Vue.prototype.$oarepo.dataRenderer = Object.assign({}, options, {
      schemas: {
        inline: {
          wrapper: {
            element: 'div'
          },
          label: {
            element: 'label'
          },
          icon: icon,
          'value-wrapper': {
            element: 'div',
            style: {
              display: 'inline'
            }
          },
          value: {
            element: 'div',
            style: {
              display: 'inline'
            }
          },
          'children-wrapper': {
            element: 'div',
            style: {
              'margin-left': '30px'
            }
          },
          'link-wrapper': {
            element: 'router-link',
            attrs: {
              to: f(function (options) {
                return options.url;
              })
            }
          },
          multiple: {
            element: 'div',
            style: {
              display: 'inline-table'
            },
            class: [],
            attrs: {}
          },
          'children-arritm-wrapper': {
            element: 'div',
            component: SKIP_WRAPPER,
            style: {
              display: 'block'
            },
            class: [],
            attrs: {}
          },
          root: {
            element: 'div',
            class: '',
            style: '',
            attrs: ''
          },
          array_item: {
            path: '*',
            wrapper: {
              component: SKIP_WRAPPER,
              element: SKIP_WRAPPER
            },
            label: {
              component: SKIP_WRAPPER,
              element: SKIP_WRAPPER,
              value: null
            },
            icon: {
              component: SKIP_WRAPPER,
              element: SKIP_WRAPPER
            },
            'value-wrapper': {
              component: SKIP_WRAPPER,
              element: SKIP_WRAPPER
            },
            value: {
              element: 'div',
              style: {
                display: 'table-row'
              }
            },
            'children-wrapper': {
              component: SKIP_WRAPPER,
              element: SKIP_WRAPPER
            },
            'link-wrapper': {
              element: 'router-link',
              attrs: {
                to: f(function (options) {
                  return options.url;
                })
              }
            }
          }
        },
        block: {
          wrapper: {
            element: 'div'
          },
          label: {
            element: 'div',
            style: {
              'vertical-align': 'top'
            }
          },
          icon: icon,
          'value-wrapper': {
            element: 'div',
            style: {
              display: 'block'
            }
          },
          value: {
            element: 'div'
          },
          'children-wrapper': {
            element: 'div',
            style: {
              'margin-left': '30px'
            }
          },
          'link-wrapper': {
            element: 'router-link',
            attrs: {
              to: f(function (options) {
                return options.url;
              })
            }
          },
          'children-arritm-wrapper': {
            element: 'div',
            component: SKIP_WRAPPER,
            style: {
              display: 'block'
            },
            class: [],
            attrs: {}
          },
          multiple: {
            element: 'div',
            style: {
              display: 'inline-table'
            },
            class: [],
            attrs: {}
          },
          root: {
            element: 'div',
            class: '',
            style: '',
            attrs: ''
          },
          array_item: {
            path: '*',
            wrapper: {
              component: SKIP_WRAPPER,
              element: SKIP_WRAPPER
            },
            label: {
              component: SKIP_WRAPPER,
              element: SKIP_WRAPPER,
              value: null
            },
            icon: {
              component: SKIP_WRAPPER,
              element: SKIP_WRAPPER
            },
            'value-wrapper': {
              component: SKIP_WRAPPER,
              element: SKIP_WRAPPER
            },
            value: {
              element: 'div',
              style: {
                display: 'table-row'
              }
            },
            'children-wrapper': {
              component: SKIP_WRAPPER,
              element: SKIP_WRAPPER
            },
            'link-wrapper': {
              element: 'router-link',
              attrs: {
                to: f(function (options) {
                  return options.url;
                })
              }
            }
          }
        },
        flex: {
          wrapper: {
            element: 'div',
            class: ['row', 'q-col-gutter-sm']
          },
          label: {
            element: 'div',
            style: {
              'vertical-align': 'top'
            },
            class: ['col-3']
          },
          icon: icon,
          'value-wrapper': {
            element: 'div',
            style: {
              display: 'block'
            },
            class: ['col-9']
          },
          value: {
            element: 'div'
          },
          'children-wrapper': {
            element: 'div'
          },
          'link-wrapper': {
            element: 'router-link',
            attrs: {
              to: f(function (options) {
                return options.url;
              })
            }
          },
          'children-arritm-wrapper': {
            element: 'div',
            component: SKIP_WRAPPER,
            style: {
              display: 'block'
            },
            class: [],
            attrs: {}
          },
          multiple: {
            element: 'div',
            style: {
              display: 'inline-table'
            },
            class: [],
            attrs: {}
          },
          root: {
            element: 'div',
            class: '',
            style: '',
            attrs: ''
          },
          array_item: {
            path: '*',
            wrapper: {
              component: SKIP_WRAPPER,
              element: SKIP_WRAPPER
            },
            label: {
              component: SKIP_WRAPPER,
              element: SKIP_WRAPPER,
              value: null
            },
            icon: {
              component: SKIP_WRAPPER,
              element: SKIP_WRAPPER
            },
            'value-wrapper': {
              component: SKIP_WRAPPER,
              element: SKIP_WRAPPER
            },
            value: {
              element: 'div',
              style: {
                display: 'table-row'
              }
            },
            'children-wrapper': {
              component: SKIP_WRAPPER,
              element: SKIP_WRAPPER
            },
            'link-wrapper': {
              element: 'router-link',
              attrs: {
                to: f(function (options) {
                  return options.url;
                })
              }
            }
          }
        },
        table: {
          wrapper: {
            element: 'tr'
          },
          label: {
            element: 'td',
            style: {
              'vertical-align': 'top'
            }
          },
          icon: icon,
          'value-wrapper': {
            element: 'td'
          },
          value: {
            element: 'div'
          },
          'children-wrapper': {
            element: 'table',
            style: {
              'border-collapse': 'collapse'
            }
          },
          'link-wrapper': {
            element: 'router-link',
            attrs: {
              to: f(function (options) {
                return options.url;
              })
            }
          },
          'children-arritm-wrapper': {
            element: 'div',
            component: SKIP_WRAPPER,
            style: {
              display: 'block'
            },
            class: [],
            attrs: {}
          },
          multiple: {
            element: 'div',
            style: {
              display: 'inline-table'
            },
            class: [],
            attrs: {}
          },
          root: {
            element: 'table',
            class: '',
            style: {
              'border-collapse': 'collapse'
            },
            attrs: ''
          },
          array_item: {
            path: '*',
            wrapper: {
              component: SKIP_WRAPPER,
              element: SKIP_WRAPPER
            },
            label: {
              component: SKIP_WRAPPER,
              element: SKIP_WRAPPER,
              value: null
            },
            icon: {
              component: SKIP_WRAPPER,
              element: SKIP_WRAPPER
            },
            'value-wrapper': {
              component: SKIP_WRAPPER,
              element: SKIP_WRAPPER
            },
            value: {
              element: 'div',
              style: {
                display: 'block'
              }
            },
            'children-wrapper': {
              component: SKIP_WRAPPER,
              element: SKIP_WRAPPER
            },
            'link-wrapper': {
              element: 'router-link',
              attrs: {
                to: f(function (options) {
                  return options.url;
                })
              }
            }
          },
          layoutPostProcessor: function layoutPostProcessor(layout
          /*, options*/
          ) {
            if (!layout.label && layout['value-wrapper'] && layout['value-wrapper'].length === 1) {
              layout['value-wrapper'][0].data.attrs = Object.assign({
                colspan: 2
              }, layout['value-wrapper'][0].data.attrs || {});
            }
          },
          nestedChildren: true
        }
      },
      root: {
        wrapper: {
          element: 'div'
        },
        label: {
          element: null,
          component: null
        },
        'value-wrapper': {
          element: SKIP_WRAPPER,
          component: SKIP_WRAPPER
        },
        value: {
          element: null,
          component: null
        },
        'children-wrapper': {
          element: SKIP_WRAPPER,
          component: SKIP_WRAPPER
        }
      },
      layoutMergeOptions: {}
    });
  }
};

export default index;
export { DataRendererComponent, KVPairComponent, RendererMixin, SKIP_WRAPPER, f };
