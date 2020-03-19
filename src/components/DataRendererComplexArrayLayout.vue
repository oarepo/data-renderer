<template lang="pug">
  data-renderer(:data="record" :layout="layout" :schema="query.schema")
</template>

<script>
export default {
  name: 'data-renderer-complex-array-layout-demo',
  props: {
    query: Object
  },
  data: function () {
    return {
      record: {
        array: [{ a: 1 }, { b: 2 }, { c: 3 }]
      },
      layout: {
        showEmpty: true,
        arrayWrapper: {
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
