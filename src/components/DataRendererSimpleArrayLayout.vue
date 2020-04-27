<template lang="pug">
  data-renderer(:data="record" :layout="layout" :schema="query.schema")
</template>

<script>
export default {
  name: 'data-renderer-simple-array-layout-demo',
  props: {
    query: Object
  },
  data: function () {
    return {
      record: {},
      layout: {
        showEmpty: true,
        'array-wrapper': {
          element: 'div'
        },
        children: [
          {
            prop: 'array',
            label: {
              label: 'Array label'
            },
            item: {
              label: {
                label: 'Item label'
              }
            }
          }
        ]
      }
    }
  }
}
</script>
<style scoped lang="stylus">
</style>
