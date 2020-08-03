# @oarepo/data-renderer

A library for providing simple (but configurable) UI for rendering JSON data.

<p align="center">
    <a href="https://travis-ci.org/oarepo/data-renderer" target="_blank">
        <img src="https://img.shields.io/travis/oarepo/data-renderer"
            alt="travis build stat"></a>
    <a href="https://www.npmjs.com/package/@oarepo/data-renderer" target="_blank">
        <img src="https://img.shields.io/npm/v/@oarepo/data-renderer"
            alt="npm version"></a>
</p>

<!-- toc -->

- [Demo](#demo)
- [Example](#example)
- [Installation](#installation)
- [What the component does](#what-the-component-does)
- [Usage](#usage)
  * [Data](#data)
  * [Layout](#layout)
  * [Rendering children](#rendering-children)
  * [Overriding parts of layout](#overriding-parts-of-layout)
    + [Path details](#path-details)
  * [Translating labels](#translating-labels)
  * [Dynamic layout](#dynamic-layout)
  * [Links](#links)
  * [Before and after data](#rendering-components-before-and-after-rendered-data)
  * [Based on value type](#rendering-custom-components-based-on-type-of-value)

<!-- tocstop -->

## Example

```vue
<template lang="pug">
    data-renderer(:data="data")
</template>
<script>
export default {
  data: function() {
    return {
      data: { 'title': 'Hello world' }
    }
  }
}
</script>
```

## Installation
```
yarn add @oarepo/data-renderer vue-uid
```

To register/configure the library, add a new boot file to quasar
(or main.js for vue-cli projects):

```javascript
import DataRenderer from '@oarepo/data-renderer'
import VueUid from 'vue-uid';

export default async ({ Vue, store, router }) => {
  Vue.use(VueUid);
  Vue.use(DataRenderer, {})
}
```

## What the component does

``DataRendererComponent`` component iterates the layout tree and converts layout
into a VueJS component. Without any settings, the created component tree will look like:

```pug
wrapper.wrapperClass(:style="wrapperStyle" ...wrapperAttrs)
  label.labelClass(:style="labelStyle" ...labelAttrs)
    | labelValue
  value.valueClass(:style="valueStyle" ...valueAttrs) {{ valueOnPath }}
  childrenWrapper.childrenWrapperClass(:style="childrenWrapperStyle" ...childrenWrapperAttrs)
    // children rendered in here
```

This tree is defined via the following layout:

```javascript
elementProperties = {
   element: null,
   class: {},           // element classes
   style: '',           // element style
   attrs: {},           // element attrs
   visible: true        // set to false to not render the element, just its content
}

layout = {
   wrapper: {
       ...elementProperties,
       element: 'div',
   },
   label: {
       ...elementProperties,
       element: 'label',
       label: 'Label to be shown',
   },
   value: {
       ...elementProperties,
       element: 'div',
   },
   'children-wrapper': {
       ...elementProperties,
       element: 'div',
   },
   'array-wrapper': {
       ...elementProperties,
       element: 'div',
   },
   prop: '',                // json path pointing to the displayed value inside record metadata
   showEmpty: false,        // if true, the element will be rendered even if there is no value
   children: []             // layout of children of this node
}
```

Every property can be a function ``func({context, layout, data, vue, paths, ...})`` where context
points to the actual parts of the data that is being rendered. To use property as a function, wrap it inside ``f``:

```javascript
export default {
  layout: {
    prop: 'thumbnail',
    value: {
      component: 'img',
      attrs: {
        src: f(({ value }) => { return value }),
        width: '16'
      }
    }
  }
}
```

## Usage

To apply this layout, add to template:

```vue
<template lang="pug">
data-renderer(:layout="layout" :data="data"
              schema="block|inline|table|<object with default definition>")
</template>
```

### Data

``data`` passed to data renderer must be an object. To render data consisting of an array of objects, data renderer can be wrapped with an element using v-for directive. Example:

```vue
<template lang="pug">
div(v-for="item in array")
  data-renderer(:data="item")
</template>
```

### Layout

The ``layout`` element might contain the layout as shown above, or shortcut can be used:

```javascript
export default {
  layout: {
    title: {
      label: {
        value: 'Title label'
      }
    },
    location: {
      children: [ ... ]
    }
  }
}
```

### Rendering children

Array and object children can be defined in ``layout``. The array or object itself is placed inside ``children`` in ``layout`` 
and may contain another array of ``children``. See the examples below.

Object layout definition may look like this:
```javascript
export default {
  data: {
    object: {}
  },
  layout: {
    showEmpty: true,
    'children-wrapper': {
      element: 'div'
    },
    children: [
      {
        prop: 'location',
        label: {
          label: 'Location label'
        },
        children: [
          {
            prop: 'street',
            label: {
              label: 'Street'
            }
          },
          {
            prop: 'number',
            label: {
              label: 'Number'
            }
          },
          {
            prop: 'zipcode',
            label: {
              label: 'Zipcode'
            }
          }]
      }]
  }
}
```

Layout of an array contains the item property with definition of layout for array items:
```javascript
export default {
  data: {
    object: {}
  },
  layout: {
    showEmpty: true,
    'array-wrapper': {
      element: 'div'
    },
    children: [
      {
        prop: 'Contact',
        label: {
          label: 'List of contacts'
        },
        item: {
          label: {
            label: 'Phone number'
        }
      }
    }]
  }
}

```

If the item of an array is a complex value, then the ``item`` property in ``layout`` must contain ``children``. Example:
```javascript
export default {
  data: {
      object: {}
    },
  layout: {
    showEmpty: true,
    'array-wrapper': {
      element: 'div'
    },
    children: [
      {
        prop: 'Contact',
        label: {
          label: 'List of contacts'
        },
        item: {
          children: [
            {
              prop: 'phone',
              label: {
                label: 'Phone number'
              }
            }
          ]
        }
      }]
  }
}
```

### Overriding parts of layout

It might be useful to be able to override the layout for selected paths.
To do this, pass ``:path-layouts`` property.

The value of the property is:

 * object with keys (same as slot names but without the 'element' prefix)
   and value for the layout of the corresponding object at the given path

```javascript
export default {
  data: {
    object: {
      a: 'red text'
    }
  },
  pathLayouts: {
    a: {
      value: {
        class: ['text-red']
      }
    }
  }
}
```

#### Path details

As stated above, the path is composed based on the jsonpath of rendered data. The set of paths
for each rendered node is constructed as follows:

```javascript
export default {
  layout: {
    prop: "location",
    children: [
      { prop: 'street' },
      { prop: 'number' },
      { prop: 'zipcode' }
    ]
  }
}
```

The path for the root is ``['location']``. The path for ``street`` is ``['location-street', 'street']``, 
i.e. for each of the parent paths, ``'-street'`` is appended to the path and an extra ``street``.

### Translating labels

A function can be registered to create/translate labels. Set either a global labelTranslator when the module is
initialized or a ``:labelTranslator`` prop containing function with the following layout:

``func({label, context, layout, data, vue, paths, schema})``

and returning the translated label or null if the label should not appear. The default implementation adds ':'
after the label for ``inline`` schema.

Using the same logic, boolean values can be translated with ``:booleanTranslator``.

### Dynamic layout

If there is no layout specified for the object, it is created dynamically from the data passed to data-renderer.

### Links

To render the value as a link, define ``<a></a>`` html tag and href attribute in pathLayouts.

```javascript
export default {
  a: {
    value: {
      element: 'a',
      attrs: {
        href: f(({url}) => { return url })
      }
    }
  }
}
```

### Using slots before and after rendered value

Components for primitive values contain a ``before`` and ``after`` slot which can be used to render custom code before and after rendered value. Example:
```vue
<template lang="pug">
  data-renderer(:layout="layout" :data="data")
    template(v-slot:before)
      div a
    template(v-slot:after)
      div b
</template>
```

### Rendering components before and after rendered data

To render custom component before or after rendered data, register component in layout, e.g.: ``before: CustomComponent``, ``after: CustomComponent``

### Rendering custom components based on type of value

Custom components can be used based instead of default ones, when passed to ``:renderer-components`` property. Example:

```vue
<template lang="pug">
  data-renderer(:layout="layout" :data="data" renderer-components="rendererComponents")
</template>
```
```javascript
export default {
  data: {
    a: 'string value',
    b: 1,
    c: 'string value',
    d: true
   },
  rendererComponents:{
    string: CustomComponent
  }
}
```
