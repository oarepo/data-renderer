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
        object: {}
      },
      layout: { showEmpty: true },
      pathLayouts: {
        object: {
          label: {
            label: 'object label'
          },
          children: [
            {
              prop: 'creator', label: {
                label: 'creator label',
                class: ['text-red']
              }
            }
          ],
          showEmpty: true
        }
      }
    }
  }
}
</script>
<style scoped lang="stylus">
</style>
