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
  * [Element vs. Component](#element-vs-component)
  * [Overriding elements with slots](#overriding-elements-with-slots)
  * [Overriding parts of layout](#overriding-parts-of-layout)
    + [Path details](#path-details)
  * [Translating labels](#translating-labels)
  * [Dynamic layout](#dynamic-layout)
  * [Links](#links)
  * [Passing extra properties to custom components](#passing-extra-properties-to-custom-components)

<!-- tocstop -->

## Demo

See the demo running at [http://mesemus.no-ip.org/demo-data-renderer](http://mesemus.no-ip.org/demo-data-renderer)

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
      icon.iconClass(:style="iconStyle" ...iconAttrs)
      | labelValue
    valueWrapper.valueWrapperClass(:style="valueWrapperStyle" ...valueWrapperAttrs)
        value.valueClass(:style="valueStyle" ...valueAttrs) {{ valueOnPath }}
        value.valueClass(:style="valueStyle" ...valueAttrs) {{ valueOnPath }}
    childWrapper.childWrapperClass(:style="childWrapperStyle" ...childWrapperAttrs)
        // children rendered in here
```

This tree is defined via the following layout:

```javascript

elementProperties = {
   element: null,
   component: null,
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
   icon: {
       ...elementProperties,
       element: null,
       component: null, // should be provided in library initialization
       value: 'icon value',
   },
   valueWrapper: {
       ...elementProperties,
       element: 'div',      
   },
   value: {
       ...elementProperties,
       element: 'div',      
   },
   childrenWrapper: {
       ...elementProperties,
       element: 'div',      
   },
   path: '',                // json path pointing to the displayed value inside record metadata
   link: undefined,         // if true, <router-link> will be rendered around the value
   showEmpty: false,        // if true, the element will be rendered even if there is no value 
   nestedChildren: false,   // if true, children are nested inside the valueWrapper element
   children: []             // layout of children of this node
}
```

Every property can be a function ``func({context, layout, data, vue, paths, ...})`` where context
points to the actual parts of data being rendered

## Usage

To apply this layout, add to template:

```pug
data-renderer(:layout="layout" :data="data" :url="url for a router-link" 
              schema="block|inline|table|<object with default definition>")
```

### Element vs. Component

The ``elementProperties`` contains two ways for choosing components to be rendered: 
``element`` or ``component``.
They work the same way, the difference is in passing generated content into the default slot.

``element`` - children are passed into the default slot (and in case of HTML elements, such as ``div``, 
              rendered into the page)   

``component`` - VNodes for children are not rendered nor passed into the default slot.

For example, if you need to display an image instead of value, use ``component``.
To render empty html tags (``br``, ``q-separator``, etc.) use ``component`` as well.

### Overriding elements with slots

Each part of the layout can be overridden with a template:

```pug
data-renderer(:layout="layout" :data="data" :url="url for a")
    template(v-slot:value-thumbnail="{context, layout, data, paths, value}")
        <img :src="value">
```

Names of slots are in the form ``<element>-<path>``. 

``path`` 

is json path to the element (without array indices) with '/' replaced by '-'. For example, for path
``authors[0]/firstName``, the path would be ``authors-firstName``.   

``element`` 

Element is one of ``wrapper``, ``label``, ``value-wrapper``, 
``value``, ``values``, ``children-wrapper``. 
All these slots are provided with ``{context, layout, data, paths}``.
In addition, ``value-wrapper`` and ``values`` elements are given the array of ``values``.
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

The value of the property is either:

 * object with keys (same as slot names but without the 'element' prefix) 
   and value the layout of the object at the given path
 * function taking ``({context, layout, data, paths})``  
   and returning 
   - the layout
   - ``null`` if the element should not be rendered at all
   - ``undefined`` to use dynamic rendering on the element

#### Path details

As stated above, the path is given by a jsonpath of the data being rendered. The set of paths 
for each rendered node is constructed as follows:

```javascript
layout = {
    path: "location",
    children: [
        'street', 'number', 'zipcode'
    ]
}
```

The path for the root is ``['location']``. The path for ``street`` is ``['location-street', 'street']`` 
- i.e. for each of the parent paths, ``'-street'`` is appended to the path and an extra ``street``.

Sometimes it might be useful to override the path. An example might be if we want to render
the same json value twice, each time with a different presentation. To be able to apply ``pathLayouts``,
specify an extra property ``key`` to replace the path. So:

```javascript
layout = {
    path: "location",
    key: "loc1",
    children: [
        'street', 'number', 'zipcode'
    ]
}
```

would result to ``['loc1-street', 'street']`` paths for ``street``. 

### Translating labels

A function can be registered to create/translate labels. Set either a global labelTranslator when the module is
initialized or a ``:labelTranslator`` prop containing function with the following layout:

``func({label, context, layout, data, vue, paths, schema})``

and returning the translated label or null if the label should not appear. The default implementation adds ':'
after the label for ``inline`` schema. 

### Dynamic layout

There might be cases when the layout of the object is not known in advance and
the data (or a subtree of data) should be rendered as they are. In these cases
the layout can be created "on-the-fly".

To use this feature, either do not pass ``layout`` at all or pass the known
part of the layout and annotate the elements to be rendered dynamically
as ``dynamic: true`` (or use the global ``dynamic`` option or prop).

### Links

To render the value as a link, set the ``link`` property of the layout. 
Allowed values:

  * ``true`` - render a router-link with ``to`` pointing to the passed ``:url`` prop
  * ``elementProperties`` without ``element`` and ``component``. ``router-link`` will be 
    generated as above and passed any extra classes/style/attrs.
  * ``elementProperties`` with either ``element`` or ``component``. 
    Element/component without any default attributes will be generated. It is your responsibility
    to add whatever ``attrs`` you need. Note that if you use ``component``, the rendered value would 
    not get passed into the component, so in most cases ``element`` should be used.

### Passing extra properties to custom components

To pass extra properties to custom components, use the ``extraProps`` object:

```pug
data-renderer(:data="data" :extraProps="{test: 'abc'}")
```

The extra properties are passed destructured, so your component would use a property
called 'test', not 'extraProps.test'.
