<template lang="pug">
  div
    data-renderer-number-component(:value="record.a" :layout="layout" :paths="paths" :schema="query.schema")
</template>

<script>
import DataRendererNumberComponent from '../../library/components/primitive/NumberComponent'
export default {
  name: 'data-renderer-number-demo',
  components: { DataRendererNumberComponent },
  props: {
    query: Object
  },
  data: function () {
    return {
      record: { a: 111 },
      layout: {},
      paths: []
    }
  }
}
</script>
<style scoped lang="stylus">
</style>
