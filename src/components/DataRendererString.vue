<template lang="pug">
  div
    data-renderer-string-component(:value="record.a" :layout="layout" :paths="paths" :schema="query.schema")
</template>

<script>
import DataRendererStringComponent from '../../library/components/primitive/StringComponent'

export default {
  name: 'data-renderer-string-demo',
  components: {
    DataRendererStringComponent
  },
  props: {
    query: Object
  },
  data: function () {
    return {
      record: { a: 'aaa' },
      layout: {
        children: [{
          prop: 'a',
          label: {
            label: 'AAA'
          }
        }]
      },
      paths: []
    }
  }
}
</script>
<style scoped lang="stylus">
</style>
