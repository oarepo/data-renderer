<template lang="pug">
  data-renderer(:data="record" :layout="layout" :schema="query.schema")
</template>

<script>
import {f} from '../../library'

export default {
  name: 'data-renderer-custom-value-demo',
  props: {
    query: Object
  },
  data: function () {
    return {
      record: {
        object: {
          firstImage: 'https://cis-login.vscht.cz/static/web/logo_small.png',
          secondImage: 'https://cdn.quasar.dev/img/mountains.jpg',
          thirdImage: 'https://cdn.quasar.dev/img/parallax2.jpg'
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
              label: 'Object'
            },
            children: [
              {
                prop: 'firstImage',
                label: {
                  label: 'firstImage'
                },
                value: {
                  element: 'img',
                  attrs: {
                    src: f(({value}) => {
                      return value
                    }),
                    width: '32'
                  },
                  class: ['q-ml-md']
                }
              },
              {
                prop: 'secondImage',
                label: {
                  label: 'secondImage'
                },
                value: {
                  element: 'img',
                  attrs: {
                    src: f(({value}) => {
                      return value
                    }),
                    width: '32'
                  },
                  class: ['q-ml-md']
                }
              },
              {
                prop: 'thirdImage',
                label: {
                  label: 'thirdImage'
                },
                value: {
                  element: 'img',
                  attrs: {
                    src: f(({value}) => {
                      return value
                    }),
                    width: '32'
                  },
                  class: ['q-ml-md']
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
