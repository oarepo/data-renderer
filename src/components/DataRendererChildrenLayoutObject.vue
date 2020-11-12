<template lang="pug">
  data-renderer(:data="record" :layout="layout" :schema="query.schema")
</template>

<script>

export default {
  name: 'data-renderer-children-layout-object-demo',
  props: {
    query: Object
  },
  data: function () {
    return {
      record: {
        object: {
        }
      },
      layout: {
        children: [
          {
            prop: 'object',
            label: {
              label: 'object'
            },
            showEmpty: true,
            children: [{prop: 'Mary'},{prop: 'John'},{prop: 'Joe'}],
            childrenLayout: {
              children: [
                {
                  prop: 'phone'
                },
                {
                  prop: 'email'
                },
                {
                  prop: 'address'
                }]
            }
          }]
      }
    }
  }
}
</script>
<style scoped lang="stylus">
</style>
