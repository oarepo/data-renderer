# invenio-quasar

A library for providing simple (but configurable) UI for ``@oarepo/invenio-api-vuex``

<!-- toc -->

- [Demo](#demo)
- [Installation](#installation)
- [What the component does](#what-the-component-does)
- [Usage](#usage)
  * [Overriding elements with slots](#overriding-elements-with-slots)
  * [Overriding elements with custom components](#overriding-elements-with-custom-components)
  * [Translating labels](#translating-labels)
  * [Dynamic definition](#dynamic-definition)

<!-- tocstop -->

## Demo

See the demo running at [http://mesemus.no-ip.org/demo-invenio-quasar](http://mesemus.no-ip.org/demo-invenio-quasar)

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

``DataRendererComponent`` is a component that iterates a tree of definitions and converts the definition
into Vuejs component. Without any settings, the created component tree will look like:

```pug
wrapper.wrapperClass(:style="wrapperStyle" ...wrapperAttrs)
    label.labelClass(:style="labelStyle" ...labelAttrs)
    valueWrapper.valueWrapperClass(:style="valueWrapperStyle" ...valueWrapperAttrs)
        value.valueClass(:style="valueStyle" ...valueAttrs) {{ valueOnPath }}
        value.valueClass(:style="valueStyle" ...valueAttrs) {{ valueOnPath }}
    childWrapper.childWrapperClass(:style="childWrapperStyle" ...childWrapperAttrs)
        // children rendered in here
```

This tree is defined via the following definition:

```javascript

elementProperties = {
   class: {},           // element classes
   style: '',           // element style
   attrs: {},           // element attrs
   visible: true        // set to false to not render the element, just its content        
}

definition = {
   wrapper: {
       element: 'div',      
       ...elementProperties
   },
   label: {
       element: 'label',
       value: 'Label to be shown',
       ...elementProperties
   },
   valueWrapper: {
       element: 'div',      
       ...elementProperties
   },
   value: {
       element: 'div',      
       ...elementProperties
   },
   childrenWrapper: {
       element: 'div',      
       ...elementProperties
   },
   path: '',                // json path pointing to the displayed value inside record metadata
   link: '',                // if true, <router-link> will be rendered around the value
   showEmpty: false,        // if true, the element will be rendered even if there is no value 
   nestedChildren: false,   // if true, children are nested inside the valueWrapper element
   children: []             // any children definitions of this node
}
```

Every property can be a function ``func({context, definition, data, vue, paths})`` where context
points to the actual parts of data being rendered

## Usage

To apply this definition, add to template:

```pug
data-renderer(:definition="definition" :data="data" :url="url for a router-link" 
              schema="block|inline|table|<object with default definition>"
              :debug="true")
```

### Overriding elements with slots

Each part of the definition can be overridden with a template:

```pug
data-renderer(:definition="definition" :data="data" :url="url for a" :debug="true")
    template(v-slot:value-thumbnail="{context, definition, data, paths, value}")
        <img :src="value">
```

Names of slots are in the form ``<element>-<path>``. 

``path`` 

is json path to the element (without array indices) with '/' replaced by '-'. For example, for path
``authors[0]/firstName``, the path would be ``authors-firstName``.   

``element`` 

Element is one of ``wrapper``, ``label``, ``value-wrapper``, 
``value``, ``values``, ``children-wrapper``. 
All these slots are provided with ``{context, definition, data, paths}``.
In addition, ``value-wrapper`` and ``values`` are given the array of ``values``.
 ``value`` is given the current value (and will be called multiple times for each value).

When slots are matched, the best matching slot is used. For example, jsonpath ``people[0]/firstName``
and element ``wrapper`` the resolution will try the following slots:
 * ``-wrapper-people-firstName``
 * ``wrapper-people-firstName``
 * ``wrapper-firstName``
 
 The difference between the first two is that the first one matches only ``people/firstName`` in the root
 of data, the second one would match any path ending with ``people/firstName``.

### Overriding elements with custom components

Alternatively the elements can be overridden with custom components. Each component receives the same props
as those above for templates. To pass the components, supply ``data-renderer`` with ``components`` property.
The value of the property is either:

 * object with keys (same as slot names) and value the Component to be rendered
 * function taking ``({context, definition, data, paths, element})`` (element is 
   ``wrapper``, ``label``, ``value-wrapper``, ``value``, ``values``, ``children-wrapper``) 
   and returning 
   - vue Component
   - ``null`` if the element should not be rendered at all
   - ``undefined`` to use default rendering of the element 
   
Custom component can take the rendered content of the element it is replacing as its
default slot. To use this functionality, annotate the component with takesChildren set 
to true:

```vue
<template>
<div>
   <slot></slot>
</div>
</template>
<script>
export default {
  // normal component goes here
  // ...
  takesChildren: true
}
</script>
```

### Translating labels

A function can be registered to create/translate labels. Set either a global labelTranslator when the module is
initialized or a ``:labelTranslator`` prop containing function with the following definition:

``func({label, context, definition, data, vue, paths, schema})``

and returning the translated label or null if the label should not appear. The default implementation adds ':'
after the label for ``inline`` schema. 

### Dynamic definition

There might be cases when the definition of the object is not known in advance and
the data (or a subtree of data) should be rendered as they are. In these cases
the definition can be created "on-the-fly".

To use this feature, either do not pass ``definition`` at all or pass the known
part of the definition and annotate the elements to be rendered dynamically
as ``dynamic: true`` (or use the global ``dynamicDefinition`` option or prop).

It might be useful to have the whole definition or parts dynamic but provide
custom definition for selected paths. To do this, pass ``:pathDefinitions``
property.

The value of the property is either:

 * object with keys (same as slot names but without the 'element' prefix) 
   and value the definition of the object at the given path
 * function taking ``({context, definition, data, paths})``  
   and returning 
   - the definition
   - ``null`` if the element should not be rendered at all
   - ``undefined`` to use dynamic rendering on the element
