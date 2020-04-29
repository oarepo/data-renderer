<template lang="pug">
  data-renderer(:data="record" :schema="query.schema" :renderer-components="rendererComponents")
</template>

<script>
  const CustomComponent = {
    props: {
      value: String
    },
    render(h) {
      return h('span', {
        attrs: {
          title: 'Custom string component'
        },
        class: ['text-blue']
      }, this.value);
    }
  }

export default {
  name: 'data-renderer-custom-string-component-demo',
  props: {
    query: Object
  },
  data: function () {
    return {
      record: {
        id: 1,
        phone: '+420123123124',
        email: 'mary.black@gmail.com',
        published: true
      },
      rendererComponents: {
        string: { component: CustomComponent }
      }
    }
  }
}
</script>
<style scoped lang="stylus">
</style>
