<template lang="pug">
  div
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
          a: 'https://cis-login.vscht.cz/static/web/logo_small.png'
        }
      },
      pathLayouts: {
        a: {
          value: {
            element: 'a',
            attrs: {
              href: f(({value}) => {
                return value
              })
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
