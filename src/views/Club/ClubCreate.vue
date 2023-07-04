<template>
    <div class="container mt-3">
        <ul>
            <li>
                <router-link to="/center">볼링장 목록</router-link>ㅣ
                <router-link to="/club">클럽 목록</router-link>ㅣ
                <router-link to="/capsule">캡슐이벤트 목록</router-link>
            </li>
        </ul>
      <h2>클럽 등록</h2>
      <form>
        <div class="mb-3 mt-3">
          <label for="centerName" class="form-label">소속볼링장:</label>
          <select class="form-select" v-model="centerId">
              <option v-for="center in centerList" :value="center.centerId" v-bind:key="center.centerId">{{ center.centerName }}</option>
            </select>
        </div>
        <div class="mb-3 mt-3">
          <label for="clubName" class="form-label">클럽명:</label>
          <input type="text" class="form-control" placeholder="클럽명을 입력하세요." autocomplete="off" v-model="clubName" required/>
        </div>
        <div class="mb-3 mt-3">
          <label for="clubPer" class="form-label">클럽인원:</label>
          <input type="text" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');" class="form-control" placeholder="클럽인원을 입력하세요." autocomplete="off" v-model="clubPer" required/>
        </div>
        <div class="mb-3">
          <label for="clubDay" class="form-label">정기전 요일:</label>
          <select class="form-select" v-model="clubDay">
            <option v-for="day in dayList" :value="day" :key="day">{{ day }}</option>
          </select>    
        </div>
      </form>
      <div class="d-flex">
        <div class="p-2 flex-fill d-grid">
          <button type="button" class="btn btn-primary" @click="addClub">생성</button>
        </div>
        <div class="p-2 flex-fill d-grid">
          <router-link to="/club" class="btn btn-primary">취소</router-link>
        </div>
      </div>
    </div>
  </template>
<script>
import axios from 'axios'

export default {
  name: 'ClubCreate',
  data() {
    return {
      centerList: [],
      centerId: '',
      clubName: '',
      clubPer: '',
      clubDay: '',
      dayList: ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일']
    }
  },
  methods: {
    getCenterList() {
      axios
        .get('http://175.197.92.213:11000/center')
        .then((response) => {
          this.centerList = response.data;
          console.log(this.centerList);
        })
        .catch((error) => console.log(error));
    },
    addClub() {
      const centerIdInt = parseInt(this.centerId);
      const clubPerInt = parseInt(this.clubPer);
      console.log(this.centerId)
      axios
        .post('http://175.197.92.213:11000/club', {
          centerId: centerIdInt,
          clubName: this.clubName,
          clubPer: clubPerInt,
          clubDay: this.clubDay
        })
        .then((response) => {
          console.log('add success' + response)
          this.$router.push({
            name: 'ClubList'
          });
        })
        .catch((error) => {
          alert('빈 칸을 모두 입력해주세요.')
          console.log(error)
        });
        
    }
  },
  created() {
    this.getCenterList();
    console.log(this)
  }
}
</script>
  
