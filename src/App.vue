<template>
    <header>
      <router-link to="/">
        <div @click="isAdminOff">
          <h1>볼링 원정대</h1>
        </div>
      </router-link>
      <ul>
        <li>
          <div @click="isAdminOn">
            <button class="adminModeBtn" @click="loginCheck">관리자모드</button>
          </div>
        </li>
      </ul>
    </header>
    <router-view/>
  </template>
  
  <script>
  export default {
    data() {
      return {
        id: localStorage.getItem('id'),
        pw: localStorage.getItem('pw'),
        isAdmin: localStorage.getItem('isAdmin')
      }
    },
    methods: {
      isAdminOn() {
        //this.isAdmin = true
        localStorage.setItem('isAdmin', 'true')
      },
      isAdminOff() {
        //this.isAdmin = false
        localStorage.setItem('isAdmin', 'false')
      },
      loginCheck() {
        if (this.id == 'admin' && this.pw == 'gaia3d') {
            this.$router.push({
                name: 'CenterList'
            })        
        } else {
            this.$router.push({
                name: 'AdminLogin'
            })
        }
      }
    }
  }
  </script>
  <style>
    @import "@/assets/css/basic.css";
    @import "@/assets/css/bootstrap-5.2.3-dist/css/bootstrap.min.css";
  </style>

