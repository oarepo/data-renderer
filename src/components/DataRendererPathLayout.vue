<template lang="pug">
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
          creator: 'Mary Black',
          phone: null
        }
      },
      layout: { showEmpty: true },
      pathLayouts: {
        object: {
          label: {
            label: 'object'
          }
        },
        creator: {
          label: {
            label: 'creator',
            class: ['text-red']
          },
          value: {
            class: ['text-red']
          }
        },
        phone: {
          label: {
            label: 'phone',
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
