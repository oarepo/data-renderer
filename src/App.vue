<template lang="pug">
q-layout(view='lHh Lpr lFf')
  q-header.glossy(elevated='')
    q-toolbar
      q-toolbar-title
        | @oarepo/data-renderer
  q-page-container
    data-renderer-page
</template>

<script>

import DataRendererPage from './components/DataRendererPage'

export default {
  name: 'app',
  components: {
      'data-renderer-page': DataRendererPage
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
