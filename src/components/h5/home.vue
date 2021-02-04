<template>
  <div class="home">
    home - h5 -page
  </div>
</template>

<script>
import {accountInfoApi} from '@/api/h5'
export default {
  name: 'Home',
  data () {
    return {
      msg: ''
    }
  },
  created () {
    this.getInfo()
  },
  methods: {
    async getInfo () {
      const res = await accountInfoApi({})
      if (res.result === 0) {
        this.data = res.data || {}
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .home {
    font-size: .16rem;
  }
</style>
