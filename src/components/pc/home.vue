<template>
  <div class="pc">
    home - page
    <el-button type="primary" @click="logout">登出</el-button>
  </div>
</template>

<script>
import { getMenuList, logoutApi } from '@/api'

export default {
  name: 'Home',
  data () {
    return {
      msg: ''
    }
  },
  created () {
    this.getMenu()
  },
  methods: {
    async getMenu () {
      const res = await getMenuList({})
      if (res.result === 0) {
        this.data = res.data || {}
      }
    },
    async logout () {
      const res = await logoutApi({})
      if (res.result === 0) {
        this.data = res.data || {}
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
