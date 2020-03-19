# @oarepo/data-renderer

A library for providing simple (but configurable) UI for rendering JSON data

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
  * [Overriding parts of layout](#overriding-parts-of-layout)
    + [Path details](#path-details)
  * [Translating labels](#translating-labels)
  * [Dynamic layout](#dynamic-layout)
  * [Links](#links)
  * [Custom components](#rendering-custom-components-before-and-after-values)

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
            data: { 'title': 'Hello world'}
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

``DataRendererComponent`` is a component that iterates a layout tree and converts the layout
into Vuejs component. Without any settings, the created component tree will look like:

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
       value: 'Label to be shown',
   },
   value: {
       ...elementProperties,
       element: 'div',      
   },
   childrenWrapper: {
       ...elementProperties,
       element: 'div',      
   },
   prop: '',                // json path pointing to the displayed value inside record metadata
   showEmpty: false,        // if true, the element will be rendered even if there is no value 
   children: []             // layout of children of this node
}
```

Every property can be a function ``func({context, layout, data, vue, paths, ...})`` where context
points to the actual parts of data being rendered. To use the function, wrap it inside ``f``:

```vue
import { f } from '@oarepo/data-renderer'

{
    prop: 'thumbnail',
    value: {
        component: 'img',
        attrs: {
            src: f(({value}) => {
                return value
            }),
            width: '16'
        }
    }
}
```

## Usage

To apply this layout, add to template:

```pug
data-renderer(:layout="layout" :data="data"
              schema="block|inline|table|<object with default definition>")
```

Names of slots are in the form ``<element>-<path>``. 

``path`` 

is json path to the element (without array indices) with '/' replaced by '-'. For example, for path
``authors[0]/firstName``, the path would be ``authors-firstName``.   

``element`` 

Element is one of ``wrapper``, ``label``, 
``value``, ``childrenWrapper``. 
All these slots are provided with ``{context, layout, data, paths}``.
 ``value`` element is given the current value (and will be called multiple times for each value).

When slots are matched, the best matching slot is used. For example, jsonpath ``people[0]/firstName``
and element ``wrapper`` the resolution will try the following slots:
 * ``-wrapper-people-firstName``
 * ``wrapper-people-firstName``
 * ``wrapper-firstName``
 
 The difference between the first two is that the first one matches only ``people/firstName`` in the root
 of data, the second one would match any path ending with ``people/firstName``.


### Overriding parts of layout

It might be useful to be able to override the layout for selected paths. 
To do this, pass ``:pathLayouts`` property.

The value of the property is:

 * object with keys (same as slot names but without the 'element' prefix) 
   and value for the layout of the object at the given path

```javascript
data = {
        object: {
          a: 'red text'
        }
      };
pathLayouts = {
  a: {
    value: {
      class: ['text-red']
    }
  }
}
```

#### Path details

As stated above, the path is given by a jsonpath of the data being rendered. The set of paths 
for each rendered node is constructed as follows:

```javascript
layout = {
    prop: "location",
    children: [
        {prop: 'street'}, 
        {prop: 'number'}, 
        {prop: 'zipcode'}
    ]
}
```

The path for the root is ``['location']``. The path for ``street`` is ``['location-street', 'street']`` 
- i.e. for each of the parent paths, ``'-street'`` is appended to the path and an extra ``street``.

would result to ``['loc1-street', 'street']`` paths for ``street``. 

### Translating labels

A function can be registered to create/translate labels. Set either a global labelTranslator when the module is
initialized or a ``:labelTranslator`` prop containing function with the following layout:

``func({label, context, layout, data, vue, paths, schema})``

and returning the translated label or null if the label should not appear. The default implementation adds ':'
after the label for ``inline`` schema. 

Using the same logic, boolean values can be translated with ``:booleanTranslator``

### Dynamic layout

If there is no layout for the object, it is created dynamically from the data passed to data-renderer.

### Links

To render the value as a link, define ``a`` html tag and href attribute in pathLayouts.

```vue
a: {
          value: {
            element: 'a',
            attrs: {
              href: 'url'
              })
            }
          }
        }
```

### Rendering custom components before and after values

To render custom component before or after rendered data, register component in layout, e.g.: ``before: CustomComponent``, ``after: CustomComponent``
