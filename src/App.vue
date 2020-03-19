<template lang="pug">
  q-layout(view='lHh Lpr lFf')
    q-header.glossy(elevated='')
      q-toolbar
        q-toolbar-title
          | @oarepo/data-renderer
    q-page-container
      router-view
</template>

<script>

export default {
  name: 'app'
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
