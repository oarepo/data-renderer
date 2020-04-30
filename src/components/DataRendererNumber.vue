<template lang="pug">
  data-renderer-number-component(:value="record.id" :layout="layout" :paths="paths" :schema="query.schema")
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
      record: { id: 1 },
      layout: {},
      paths: []
    }
  }
}
</script>
<style scoped lang="stylus">
</style>
