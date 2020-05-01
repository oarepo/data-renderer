<template lang="pug">
  data-renderer(:data="record" :pathLayouts="pathLayouts" :schema="query.schema")
</template>

<script>

import {f} from "../../library";

export default {
  name: 'data-renderer-link-demo',
  props: {
    query: Object
  },
  data: function () {
    return {
      url: '/link-test',
      record: {
        object: {
          link: 'https://cis-login.vscht.cz/static/web/logo_small.png'
        }
      },
      pathLayouts: {
        link: {
          value: {
            element: 'a',
            attrs: {
              href: f(({value}) => {
                return value
              })
            },
            style: {
              'padding-left': '5px'
            }
          }
        }
      }
    }
  }
}
</script>
<style scoped lang="stylus">
</style>
