<template lang="pug">
q-page.q-ma-lg

  .q-gutter-sm.fixed-top-right.z-max.q-pt-xs.q-pr-lg.text-white
    span Display schema:
    q-radio(v-model="query.schema" val="inline" label="inline" color="yellow")
    q-radio(v-model="query.schema" val="block" label="block" color="yellow")
    q-radio(v-model="query.schema" val="table" label="table" color="yellow")
    q-radio(v-model="query.schema" val="flex" label="flex" color="yellow")

  h6 Render primitive values
  .row.q-col-gutter-sm
    .div.col-4
      .q-card.full-height
        q-card-section
          .text-weight-medium Render string value
          q-separator.q-mb-md.q-mt-sm
          data-renderer-string-demo(:query="query")

    .div.col-4
      .q-card.full-height
        q-card-section
          .text-weight-medium Render number value
          q-separator.q-mb-md.q-mt-sm
          data-renderer-number-demo(:query="query")

    .div.col-4
      .q-card.full-height
        q-card-section
          .text-weight-medium Render boolean value
          q-separator.q-mb-md.q-mt-sm
          data-renderer-boolean-demo(:query="query")

  h6 Render objects
  .row.q-col-gutter-sm
    .div.col-4
      .q-card.full-height
        q-card-section
          .text-weight-medium Render object
          q-separator.q-mb-md.q-mt-sm
          data-renderer-object-demo(:query="query")

    .div.col-4
      .q-card.full-height
        q-card-section
          .text-weight-medium Render tree
          q-separator.q-mb-md.q-mt-sm
          data-renderer-complex-data-demo(:query="query")

    .div.col-4
      .q-card.full-height
        q-card-section
          .text-weight-medium Render image element based on value
          q-separator.q-mb-md.q-mt-sm
          data-renderer-custom-value-demo(:query="query")

  h6 Render arrays
  .row.q-col-gutter-sm
    .div.col-4
      .q-card.full-height
        q-card-section
          .text-weight-medium Render array
          q-separator.q-mb-md.q-mt-sm
          data-renderer-array-demo(:query="query")

  h6 Render data based on layout
  .row.q-col-gutter-sm
    .div.col-4
      .q-card.full-height
        q-card-section
          .text-weight-medium Render simple array with layout
          q-separator.q-mb-md.q-mt-sm
          data-renderer-simple-array-layout-demo(:query="query")

    .div.col-4
      .q-card.full-height
        q-card-section
          .text-weight-medium Render complex array with layout
          q-separator.q-mb-md.q-mt-sm
          data-renderer-complex-array-layout-demo(:query="query")

    .div.col-4
      .q-card.full-height
        q-card-section
          .text-weight-medium Render object with layout
          q-separator.q-mb-md.q-mt-sm
          data-renderer-object-layout-demo(:query="query")

  h6 Render with extra options
  .row.q-col-gutter-sm
    .div.col-4
      .q-card.full-height
        q-card-section
          .text-weight-medium Render array with components before and after rendered data
          q-separator.q-mb-md.q-mt-sm
          data-renderer-before-after-array-demo(:query="query")

    .div.col-4
      .q-card.full-height
        q-card-section
          .text-weight-medium Render complex array with components before and after rendered data
          q-separator.q-mb-md.q-mt-sm
          data-renderer-before-after-complex-array-demo(:query="query")

    .div.col-4
      .q-card.full-height
        q-card-section
          .text-weight-medium Render object with components before and after rendered data
          q-separator.q-mb-md.q-mt-sm
          data-renderer-before-after-object-demo(:query="query")

    .div.col-4
      .q-card.full-height
        q-card-section
          .text-weight-medium Render link
          q-separator.q-mb-md.q-mt-sm
          data-renderer-link-demo(:query="query")

    .div.col-4
      .q-card.full-height
        q-card-section
          .text-weight-medium Render data with path layout
          q-separator.q-mb-md.q-mt-sm
          data-renderer-path-layout-demo(:query="query")

</template>

<script>
import DataRendererStringDemo from './DataRendererString'
import DataRendererNumberDemo from './DataRendererNumber'
import DataRendererBooleanDemo from './DataRendererBoolean'
import DataRendererArrayDemo from './DataRendererArray'
import DataRendererObjectDemo from './DataRendererObject'
import DataRendererComplexDataDemo from './DataRendererComplexData'
import DataRendererSimpleArrayLayoutDemo from './DataRendererSimpleArrayLayout'
import DataRendererComplexArrayLayoutDemo from './DataRendererComplexArrayLayout'
import DataRendererObjectLayoutDemo from './DataRendererObjectLayout'
import DataRendererBeforeAfterObjectDemo from './DataRendererBeforeAfterObject'
import DataRendererCustomValueDemo from './DataRendererCustomValue'
import DataRendererBeforeAfterArrayDemo from './DataRendererBeforeAfterArray'
import DataRendererBeforeAfterComplexArrayDemo from './DataRendererBeforeAfterComplexArray'
import DataRendererLinkDemo from './DataRendererLink'
import DataRendererPathLayoutDemo from './DataRendererPathLayout'

export default {
  components: {
    DataRendererPathLayoutDemo,
    DataRendererLinkDemo,
    DataRendererBeforeAfterComplexArrayDemo,
    DataRendererBeforeAfterArrayDemo,
    DataRendererBeforeAfterObjectDemo,
    DataRendererObjectLayoutDemo,
    DataRendererComplexArrayLayoutDemo,
    DataRendererSimpleArrayLayoutDemo,
    DataRendererComplexDataDemo,
    DataRendererObjectDemo,
    DataRendererArrayDemo,
    DataRendererBooleanDemo,
    DataRendererNumberDemo,
    DataRendererStringDemo,
    DataRendererCustomValueDemo
  },
  props: {
    query: Object
  }
}
</script>
