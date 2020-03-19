<template lang="pug">
  div
    data-renderer(:data="record" :layout="layout" :schema="query.schema")
</template>

<script>

export default {
  name: 'data-renderer-array-demo',
  props: {
    query: Object
  },
  data: function () {
    return {
      record: {
        array: [1, 2, 3]
      },
      layout: {}
    }
  }
}
</script>
<style scoped lang="stylus">
</style>
