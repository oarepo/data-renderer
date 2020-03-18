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

const CustomComponent = {
  props: [],
  render(h) {
    // console.log('Custom component props', this.$props);
    // console.log('Custom component attrs', this.$attrs);
    return h('span', {
      attrs: {
        title: 'See console log for details'
      },
      class: 'text-green',
    }, 'This is another custom component');
  }
}

export default {
  name: 'data-renderer-before-after-object-demo',
  props: {
    query: Object
  },
  data: function () {
    return {
      record: {
        object: { a: { a: 'one', b: 'two' }, b: { a: 'one', b: 'two' } }
      },
      layout: {
        childrenWrapper: {
          element: 'div'
        },
        before: CustomBeforeComponent,
        after: CustomAfterComponent,
        children: [
          {
            prop: 'object',
            children: [
              {
                prop: 'a',
                label: {
                  label: 'firstObject'
                },
                before: CustomComponent,
                after: CustomComponent
              },
              {
                prop: 'b',
                label: {
                  label: 'secondObject'
                },
                before: CustomComponent,
                after: CustomComponent
              }
            ]
          }
        ]
      }
    }
  }
}
</script>
<style scoped lang="stylus">
</style>
