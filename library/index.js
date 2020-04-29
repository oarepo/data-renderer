import DataRendererComponent from './components/DataRendererComponent'
import {createDynamicArrayLayout, createDynamicObjectLayout, createDynamicObjectPropLayout} from './dynamiclayouts'
import startCase from 'lodash.startcase'
import {f} from './layoututils'
import StringComponent from "./components/primitive/StringComponent";
import NumberComponent from "./components/primitive/NumberComponent";
import BooleanComponent from "./components/primitive/BooleanComponent";
import UndefinedComponent from "./components/primitive/UndefinedComponent";
import ArrayComponent from "./components/ArrayComponent";
import ObjectComponent from "./components/ObjectComponent";

export default {
  install (Vue, options) {
    options = {
      ...options,
      showEmpty: false
    }

    Vue.component(options.dataRendererName || DataRendererComponent.name, DataRendererComponent)

    if (Vue.prototype.$oarepo === undefined) {
      Vue.prototype.$oarepo = {}
    }

    Vue.prototype.$oarepo.dataRenderer = {
      layouts: {
        inline: {
          'children-wrapper': {
            element: 'div',
            style: { 'padding-left': '5px', 'display': 'inline-block' },
            value: {
              element: 'div',
              style: { display: 'inline' }
            }
          },
          linkWrapper: {
            element: 'router-link',
            attrs: {
              to: f((options) => options.url)
            }
          },
          'array-wrapper': {
            element: 'div',
            style: { 'display': 'inline-table' },
            class: [],
            attrs: {}
          },
          wrapper: {
            element: 'div'
          },
          label: {
            element: 'label',
            style: { 'vertical-align': 'top', 'color': 'gray' }
          },
          value: {
            element: 'div',
            style: { 'display': 'inline' }
          },
          labelTranslator: (label, /*extra*/) => `${startCase(label)}: `,
          showEmpty: false
        },
        block: {
          'children-wrapper': {
            element: 'div',
            style: { 'padding-left': '10px', 'margin-top': '5px'  }
          },
          'array-wrapper': {
            element: 'div',
            style: { 'display': 'block' },
            class: [],
            attrs: {}
          },
          wrapper: {
            element: 'div'
          },
          label: {
            element: 'label',
            style: { 'vertical-align': 'top', 'color': 'gray' }
          },
          value: {
            element: 'div'
          },
          labelTranslator: (label, /*extra*/) => startCase(label),
          showEmpty: false
        },
        table: {
          'children-wrapper': {
            element: 'table',
            style: { 'vertical-align': 'top', 'padding-left': '5px'}
          },
          'array-wrapper': {
            element: 'td',
            style: { 'vertical-align': 'top', 'text-align': 'left'},
            attrs: {}
          },
          wrapper: {
            element: 'tr',
            style: { 'vertical-align': 'top' }
          },
          label: {
            element: 'td',
            style: { 'word-wrap': 'break-word', 'vertical-align': 'top', 'text-align': 'left', 'color': 'gray' }
          },
          value: {
            element: 'td',
            style: { 'padding-left': '5px' }
          },
          labelTranslator: (label, /*extra*/) => startCase(label),
          showEmpty: false
        },
        flex: {
          'children-wrapper': {
            element: 'div'
          },
          'array-wrapper': {
            element: 'div',
            style: { 'display': 'block' },
            class: [],
            attrs: {}
          },
          wrapper: {
            element: 'div',
            class: ['row', 'q-col-gutter-sm']
          },
          label: {
            element: 'label',
            style: { 'vertical-align': 'top' },
            class: ['col-auto']
          },
          value: {
            element: 'div',
            style: { 'display': 'block' },
            class: ['col-auto']
          },
          labelTranslator: (label, /*extra*/) => startCase(label),
          showEmpty: false
        }
      },
      layoutMergeOptions: {},
      rendererComponents: {
        string: { component: StringComponent },
        number: { component: NumberComponent },
        boolean: { component: BooleanComponent },
        undefined: { component: UndefinedComponent },
        array: { component: ArrayComponent },
        object: { component: ObjectComponent }
      },
      createDynamicObjectLayout,
      createDynamicArrayLayout,
      createDynamicObjectPropLayout,
      ...options
    }
  }
}

export {
  DataRendererComponent,
  StringComponent,
  NumberComponent,
  BooleanComponent,
  UndefinedComponent,
  ArrayComponent,
  ObjectComponent,
  f
}
