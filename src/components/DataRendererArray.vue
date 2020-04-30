<template lang="pug">
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
        keywords: ['first keyword', 'second keyword']
      },
      layout: {}
    }
  }
}
</script>
<style scoped lang="stylus">
</style>
