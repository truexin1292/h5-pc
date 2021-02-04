<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    function Rem (doc, win) {
      const docEl = doc.documentElement
      const resizeEvt = 'orientationchange' in win ? 'orientationchange' : 'resize'
      const recalc = function () {
        let clientWidth = docEl.clientWidth
        const clientHeight = docEl.clientHeight
        if (!clientWidth) return
        if (clientWidth >= 750) {
          clientWidth = 750
          doc.body.style.width = `${750}px`
        } else {
          doc.body.style.width = `${clientWidth}px`
        }
        doc.body.style.height = `${clientHeight}px`
        docEl.style.fontSize = `${100 * (clientWidth / 750)}px`
        docEl.dataset.percent = 100 * (clientWidth / 750)
      }
      recalc()
      doc.documentElement.classList.add(`iosx${win.devicePixelRatio}`)
      if (!doc.addEventListener) return
      win.addEventListener(resizeEvt, recalc, false)
    }
    Rem(document, window)
  }
}
</script>

<style>
  #app {
    height: 100vh;
    width: 100vw;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
