<template>
  <div class="login">
    <div class="login-panel">
      <div class="left-panel">
        <p class="left-title">新零售智能管理平台</p>
        <img src="./images/left-img.png" class="left-img"/>
      </div>
      <el-row class="right-panel">
        <div class="form-panel">
          <p class="form-title">欢迎登录</p>
          <div class="form">
            <el-input v-model.trim="ruleForm.username" ref="username" placeholder="账号" class="m-30"/>
            <el-input type="password" v-model.trim="ruleForm.password" placeholder="密码" class="m-30"/>
            <div class="valid-code-item">
              <el-input class="input-60" v-model.trim="ruleForm.verifyCode" @keyup.native.enter="login"
                        placeholder="验证码"/>
              <img class="verify-code" :src="verifyCodeImg"/>
              <span @click="getVerifyCodeImg" class="code-btn">换一张</span>
            </div>
            <el-button type="primary" @click="login">
              登录
            </el-button>
            <p class="forget-password">
              <span class="forget-btn">忘记密码?</span>
            </p>
          </div>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
import { loginApi, isApproveApi, getValidCode, loginWaWaWuApi } from '@/api'
import md5 from 'js-md5'

export default {
  name: 'login',
  data () {
    return {
      ruleForm: {
        username: '',
        password: '',
        verifyCode: ''
      },
      verifyCodeImg: ''
    }
  },
  mounted () {
    this.getVerifyCodeImg()
    this.$nextTick(() => {
      this.$refs.username.focus()
    })
  },
  methods: {
    login () {
      const { username, password, verifyCode } = this.ruleForm
      if (!username) {
        this.$message.error('请输入账号')
        return
      }
      if (!password) {
        this.$message.error('请输入密码')
        return
      }
      if (!verifyCode) {
        this.$message.error('请输入验证码')
        return
      }
      const reqData = {
        username,
        password: md5(password),
        verifyCode
      }
      loginWaWaWuApi(reqData).then(_ => {
        loginApi(reqData).then(_ => {
          isApproveApi().then((res) => {
            localStorage.setItem('isApprover', res.data ? 'yes' : 'no')
            localStorage.setItem('username', username)
            this.$router.replace('/')
          })
        }).catch(_ => {
          this.getVerifyCodeImg()
          this.ruleForm.verifyCode = ''
        })
      }).catch(_ => {
        this.getVerifyCodeImg()
        this.ruleForm.verifyCode = ''
      })
    },
    getVerifyCodeImg () {
      this.verifyCodeImg = getValidCode()
    }
  }
}
</script>

<style scoped lang="less">
  .login {
    background-image: url("./images/login-bg.png");
    background-color: #3b92e9;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    height: 100vh;
    width: 100vw;

    display: flex;
    justify-content: center;
    align-items: center;

    .login-panel {
      width: 14rem;
      height: 9rem;
      display: flex;
      justify-content: center;
      align-items: center;

      .left-panel {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        width: 8rem;

        .left-title {
          font-size: .68rem;
          color: #fff;
          font-weight: 100;
          margin-bottom: .5rem;
        }

        .left-img {
          width: 5.6rem;
          margin-left: .35rem;
        }
      }

      .right-panel {
        width: 6rem;
        height: 7rem;
        background: #fff;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;

        .form-panel {
          padding: 0 .6rem 0 .6rem;;
          background: #fff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          .form-title {
            width: 100%;
            text-align: left;
            font-size: .42rem;
            color: #9395A9;
            margin-bottom: .7rem;
          }

          .m-30 {
            margin-bottom: .65rem;
          }

          /deep/ .el-input__inner {
            height: .6rem;
            line-height: .6rem;
            border: none;
            border-radius: .05rem;
            background: #F6F6F6;
            font-size: .2rem;
          }

          .valid-code-item {
            height: .6rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: .6rem;

            .input-60 {
              width: 3rem;
            }

            .code-btn {
              font-size: .2rem;
              color: #9395A9;
              cursor: pointer;
            }
          }

          .el-button {
            width: 100%;
            height: .6rem;
            background: #1890FF;
            border: 1px solid #1890FF;
            box-shadow: 0 3px 10px 0 rgba(31, 103, 251, 0.3);
            border-radius: .05rem;
            font-size: .28rem;
            padding: 0;
            margin-bottom: .17rem;
          }

          .forget-password {
            margin-top: .2rem;
            text-align: right;

            .forget-btn {
              font-size: .2rem;
              color: #286FFF;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
</style>
