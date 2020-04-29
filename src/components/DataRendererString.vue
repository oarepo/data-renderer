<template lang="pug">
  data-renderer-string-component(:value="record.phone" :layout="layout" :paths="paths" :schema="query.schema")
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
      record: { phone: '+420123123123' },
      layout: {
        children: [{
          prop: 'phone',
          label: {
            label: 'phone'
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
