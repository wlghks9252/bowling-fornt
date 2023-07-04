<template>
  <div class="vh-100 d-flex justify-content-center align-items-center">
    <div class="col-md-4 p-5 shadow-sm border rounded-3">
      <h2 class="text-center mb-4 text-primary">관리자 로그인</h2>
      <form @submit.prevent="login"> <!-- @submit.prevent을 추가 -->
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">ID</label>
          <input class="form-control border border-primary" v-model="id" id="exampleInputEmail1" aria-describedby="emailHelp">
        </div>
        <div class="mb-3">
          <label for="exampleInputPassword1" class="form-label">Password</label>
          <input type="password" class="form-control border border-primary" v-model="password" id="exampleInputPassword1">
        </div>
        <div class="d-grid">
          <button class="btn text-primary fw-bold" type="submit">Login</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: '',
      password: '',
      isLogIn: false
    };
  },
  methods: {
    login() {
      if (this.id === 'admin' && this.password === 'gaia3d') {
        this.isLogIn = true;
        localStorage.setItem('id', this.id);
        localStorage.setItem('pw', this.password);
        localStorage.setItem('isAdmin', true);
        this.$router.push({
          name: 'CenterList',
        });
      } else {
        alert('ID/PW가 틀렸습니다.');
      }
    }
  }
};
</script>

