<template lang="pug">
  div
    data-renderer(:data="record" :layout="layout" :schema="query.schema")
</template>

<script>

const CustomBeforeComponent = {
  props: [],
  render(h) {
    // console.log('Custom component props', this.$props);
    // console.log('Custom component attrs', this.$attrs);
    return h('span', {
      attrs: {
        title: 'See console log for details'
      },
      class: 'text-red',
    }, 'This is a custom before component');
  }
}

const CustomAfterComponent = {
  props: [],
  render(h) {
    // console.log('Custom component props', this.$props);
    // console.log('Custom component attrs', this.$attrs);
    return h('span', {
      attrs: {
        title: 'See console log for details'
      },
      class: 'text-blue',
    }, 'This is a custom after component');
  }
}

export default {
  name: 'data-renderer-before-after-array-demo',
  props: {
    query: Object
  },
  data: function () {
    return {
      record: { array: [1, 2, 3] },
      layout: {
        before: CustomBeforeComponent,
        after: CustomAfterComponent
      }
    }
  }
}
</script>
<style scoped lang="stylus">
</style>
