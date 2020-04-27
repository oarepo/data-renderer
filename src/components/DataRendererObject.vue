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
          creator: 'Mary Black',
          phone: '+420123123123',
          email: null
        }
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
              }]
          }]
      }
    }
  }
}
</script>
<style scoped lang="stylus">
</style>
