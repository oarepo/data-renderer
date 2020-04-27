<template lang="pug">
  div
    data-renderer(:data="record" :layout="layout" :schema="query.schema")
</template>

<script>
export default {
  name: 'data-renderer-object-layout-demo',
  props: {
    query: Object
  },
  data: function () {
    return {
      record: {
        object: {}
      },
      layout: {
        showEmpty: true,
        'children-wrapper': {
          element: 'div'
        },
        children: [
          {
            prop: 'object',
            label: {
              label: 'object'
            },
            children: [
              {
                prop: 'creator',
                label: {
                  label: 'creator'
                }
              },
              {
                prop: 'phone',
                label: {
                  label: 'phone'
                }
              },
              {
                prop: 'email',
                label: {
                  label: 'email'
                }
              }]
          }]
      }
    }
  }
}
</script>
<style scoped lang="stylus">
</style>
