import DataRendererComponent from './components/DataRendererComponent'
import {createDynamicArrayLayout, createDynamicObjectLayout} from './dynamiclayouts'
import startCase from 'lodash.startcase'
import {f} from './layoututils'
import StringComponent from "./components/primitive/StringComponent";
import NumberComponent from "./components/primitive/NumberComponent";
import BooleanComponent from "./components/primitive/BooleanComponent";
import UndefinedComponent from "./components/primitive/UndefinedComponent";
import ArrayComponent from "./components/ArrayComponent";
import ObjectComponent from "./components/ObjectComponent";

export default {
  install(Vue, options) {
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
            element: 'div'
          },
          'array-wrapper': {
            element: 'div'
          },
          wrapper: {
            element: 'div'
          },
          label: {
            element: 'label'
          },
          value: {
            element: 'div'
          },
          labelTranslator: (label, /*extra*/) => `${startCase(label)}: `,
          showEmpty: false
        },
        block: {
          'children-wrapper': {
            element: 'div'
          },
          'array-wrapper': {
            element: 'div'
          },
          wrapper: {
            element: 'div'
          },
          label: {
            element: 'label'
          },
          value: {
            element: 'div'
          },
          labelTranslator: (label, /*extra*/) => startCase(label),
          showEmpty: false
        },
        table: {
          'children-wrapper': {
            element: 'table'
          },
          'array-wrapper': {
            element: 'table'
          },
          wrapper: {
            element: 'tr'
          },
          label: {
            element: 'td'
          },
          value: {
            element: 'td'
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
          },
          wrapper: {
            element: 'div',
            class: ['row']
          },
          label: {
            element: 'label',
            class: ['col-auto']
          },
          value: {
            element: 'div',
            class: ['col-auto']
          },
          labelTranslator: (label, /*extra*/) => startCase(label),
          showEmpty: false
        }
      },
      layoutMergeOptions: {},
      rendererComponents: {
        string: {component: StringComponent},
        number: {component: NumberComponent},
        boolean: {component: BooleanComponent},
        undefined: {component: UndefinedComponent},
        array: {component: ArrayComponent},
        object: {component: ObjectComponent}
      },
      createDynamicObjectLayout,
      createDynamicArrayLayout,
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
