<template>
  <div class="login-wrapper">
    <div class="main">
      <div class="logo-wrapper">
        <img :src="logoImg"/>
      </div>
      <van-form>
        <van-field
          v-model="userName"
          label="用户名"
          placeholder="请填写用户名"
        />
        <van-field
          v-model="password"
          type="password"
          label="密码"
          placeholder="请填写密码"
        />
        <div style="margin: 16px;">
          <van-button block type="info" @click="login">登录</van-button>
          <van-button block type="default" class="reg-btn">注册</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>

import { loginApi } from '@/api/h5'
import logoImg from './images/logo.png'
import md5 from 'js-md5'

export default {
  name: 'login',
  data () {
    return {
      logoImg,
      userName: '',
      password: ''
    }
  },
  methods: {
    async login () {
      const res = await loginApi({
        userName: this.userName,
        password: md5(this.password)
      })
      if (res && res.result === 0 && res.data) {
        this.$router.push({
          path: '/'
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .login-wrapper {
    width: 100%;
    height: 100%;
    background: #fff;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;

    .logo-wrapper {
      margin: 0 auto .25rem;
      width: 74px;

      img {
        width: 100%;
      }
    }

    input {
      background: #fff !important;
    }

    .main {
      width: 90vw;
    }

    .reg-btn {
      margin-top: .3rem;
    }
  }
</style>
