<template lang="pug">
  data-renderer(:data="record" :layout="layout" :schema="query.schema")
</template>

<script>
export default {
  name: 'data-renderer-complex-data-demo',
  props: {
    query: Object
  },
  data: function () {
    return {
      record: {
        object: [
          { creator: 'Mary Black' },
          {
            contact: [
              { phone: '+420123123123' },
              { email: ['mary.black@gmail.com'] },
              { phone: '+420123123123' },
              { email: ['mary.black@gmail.com'] }]
          }]
      },
      layout: {}
    }
  }
}
</script>
<style scoped lang="stylus">
</style>
