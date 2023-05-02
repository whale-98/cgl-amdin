<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <!--    面包屑-->
    <!--    <breadcrumb class="breadcrumb-container" />-->

    <div class="right-menu">
      <div class="headerIcon">
        <svg-icon icon-class="news" />
      </div>
      <div class="headerIcon">
        <svg-icon icon-class="email" />
      </div>
      <div class="headerIcon">
        <svg-icon icon-class="calendar" />
      </div>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img src="@/assets/logo.png" class="user-avatar">
          <div class="userInfo">
            <div class="userName">Admin</div>
            <div class="userRole">管理员</div>
          </div>
          <i class="el-icon-arrow-down" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item  @click.native="download">
            <i class="el-icon-download" />
            <span style="display:block;">下载</span>
          </el-dropdown-item>
          <!--<el-dropdown-item divided @click.native="logout">
            <i class="el-icon-arrow-down" />
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>-->
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import {achievementDownload, performanceDownload, titleChangeDownload } from '@/api/common'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    async download() {
      const searchData = this.$store.state.common.searchData
      let res
      if (this.$route.path === '/team/teamPerformance'){
        res = await achievementDownload({ start: searchData.统计时间[0], end: searchData.统计时间[1], key: 'ahushuai' })
      } else if (this.$route.path === '/consultant/consultantPerformance'){
        res = await performanceDownload({ start: searchData.统计时间[0], end: searchData.统计时间[1], key: 'ahushuai', title: searchData.职位.split(',') })
      } else if (this.$route.path === '/consultant/jobChange'){
        res = await titleChangeDownload({ start: searchData.统计时间[0], end: searchData.统计时间[1], key: 'ahushuai' })
      }
      if (res.data) {
        window.open('http://101.132.226.125/download/' + res.data)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 80px;
  overflow: hidden;
  position: relative;
  //box-shadow: 0 1px 4px rgba(0,21,41,.08);
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    display: flex;
    align-items: center;
    float: right;
    height: 100%;
    /*line-height: 50px;*/
    padding: 10px 0;

    &:focus {
      outline: none;
    }

    .headerIcon{
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 20px;
      height: 50px;
      width: 50px;
      background-color: rgba(94, 62, 208, 0.6);
      border-radius: 15px;
      cursor: pointer;
      .svg-icon{
        color: #fff;
        width: 28px;
        height: 28px;
      }
    }

    /*.right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }*/

    .avatar-container {
      display: flex;
      margin-right: 30px;
      padding: 0.5rem 0.6rem;
      box-shadow: 0px 4px 6px rgb(62 73 84 / 4%);
      border-radius: 0.938rem;
      background: rgba(94, 62, 208, 0.6);
      cursor: pointer;

      .avatar-wrapper {
        display: flex;
        align-items: center;
        /*margin-top: 5px;*/
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .userInfo {
          line-height: 22px;
          margin: 0 10px;
          .userName {
            font-size: 16px;
            color: #FFF;
          }
          .userRole {
            color: #FFFFFF99;
          }
        }

        .el-icon-arrow-down {
          color: #FFF;
          cursor: pointer;
          vertical-align: middle;
          /*position: absolute;
          right: -20px;
          top: 25px;*/
          font-size: 20px;
        }
      }
    }
  }
}
</style>
