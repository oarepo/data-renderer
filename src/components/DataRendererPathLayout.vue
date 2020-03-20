<template lang="pug">
  div
    data-renderer(:data="record" :layout="layout" :schema="query.schema" :path-layouts="pathLayouts")
</template>

<script>
export default {
  name: 'data-renderer-path-layout-demo',
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
      layout: { showEmpty: true },
      pathLayouts: {
        object: {
          label: {
            label: 'label'
          }
        },
        a: {
          label: {
            label: 'AAAA',
            class: ['text-red']
          },
          value: {
            class: ['text-red']
          }
        },
        b: {
          label: {
            label: 'BBBB',
            class: ['text-blue']
          },
          value: {
            class: ['text-blue']
          }
        }
      }
    }
  }
}
</script>
<style scoped lang="stylus">
</style>
