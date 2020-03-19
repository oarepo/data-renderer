<template lang="pug">
  div
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
        tree: {
          a: {
            b: {
              c: {
                d: {
                  e: 1,
                  f: 2
                },
                g: {
                  h: 1,
                  i: 2
                }
              }
            }
          }
        }
      },
      layout: {}
    }
  }
}
</script>
<style scoped lang="stylus">
</style>
