<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    let deviceWidth = 0
    setHtmlFontSize()

    if (window.addEventListener) {
      window.addEventListener('resize', function () {
        setHtmlFontSize()
      }, false)
    }

    function setHtmlFontSize () {
      deviceWidth = document.documentElement.clientWidth > 1914 ? 1914 : document.documentElement.clientWidth
      document.getElementsByTagName('html')[0].style.cssText = 'font-size:' + deviceWidth / 19.14 + 'px !important'
    }
  }
}
</script>

<style>
  body {
    margin: 0;
    padding: 0;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
