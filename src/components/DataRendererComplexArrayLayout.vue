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
        contact: [{ phone: '+420123123124' }, { phone: '+420123123125' }]
      },
      layout: {
        showEmpty: true,
        'array-wrapper': {
          element: 'div'
        },
        children: [
          {
            prop: 'contact',
            label: {
              label: 'listOfContacts'
            },
            item: {
              children: [
                {
                  prop: 'phone',
                  label: {
                    label: 'phoneNumber'
                  }}]
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
