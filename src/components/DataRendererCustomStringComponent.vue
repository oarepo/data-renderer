<template lang="pug">
  div
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
        a: 'aaa',
        b: 1,
        c: 'bbb',
        d: true
      },
      rendererComponents: {
        string: CustomComponent
      }
    }
  }
}
</script>
<style scoped lang="stylus">
</style>
