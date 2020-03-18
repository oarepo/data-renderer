<template lang="pug">
  div
    data-renderer(:data="record" :layout="layout" :schema="query.schema")
</template>

<script>

export default {
  name: 'data-renderer-object-demo',
  props: {
    query: Object
  },
  data: function () {
    return {
      record: {
        object: {
          a: '1',
          b: null
        }
      },
      layout: {
        showEmpty: true,
        childrenWrapper: {
          element: 'div'
        },
        children: [
          {
            prop: 'object',
            label: {
              label: 'Object label'
            },
            children: [
              {
                prop: 'a',
                label: {
                  label: 'AAA'
                }
              },
              {
                prop: 'b',
                label: {
                  label: 'BBB'
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
