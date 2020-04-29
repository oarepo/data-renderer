<template lang="pug">
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
    }, 'custom component');
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
    }, 'custom component');
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
    }, 'custom component');
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
        object: { creator: 'Mary Black', contact: { phone: '+420123123124', email: 'mary.black@gmail.com' } }
      },
      layout: {
        'children-wrapper': {
          element: 'div'
        },
        before: CustomBeforeComponent,
        after: CustomAfterComponent,
        children: [
          {
            prop: 'object',
            children: [
              {
                prop: 'creator',
                label: {
                  label: 'creator'
                },
                before: CustomComponent,
                after: CustomComponent
              },
              {
                prop: 'contact',
                label: {
                  label: 'contact'
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
