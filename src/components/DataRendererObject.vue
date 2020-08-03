<template lang="pug">
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
        children: [
          {
            prop: 'object',
            label: {
              label: 'object'
            },
            showEmpty: true,
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
                prop: 'email'
              }]
          }]
      }
    }
  }
}
</script>
<style scoped lang="stylus">
</style>
