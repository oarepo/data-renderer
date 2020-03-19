<template lang="pug">
  div
    data-renderer-boolean-component(:data="record.a" :layout="layout" :paths="paths" :schema="query.schema")
</template>

<script>
import DataRendererBooleanComponent from '../../library/components/primitive/BooleanComponent'
export default {
  name: 'data-renderer-boolean-demo',
  components: { DataRendererBooleanComponent },
  props: {
    query: Object
  },
  data: function () {
    return {
      record: { a: true },
      layout: {},
      paths: []
    }
  }
}
</script>
<style scoped lang="stylus">
</style>
