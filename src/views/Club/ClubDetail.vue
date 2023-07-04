<template>
    <div class="container mt-3">
        <ul>
            <li>
                <router-link to="/center">볼링장 목록</router-link>ㅣ
                <router-link to="/club">클럽 목록</router-link>ㅣ
                <router-link to="/capsule">캡슐이벤트 목록</router-link>
            </li>
        </ul>
      <h2>클럽 수정</h2>
      <form>
        <div class="mb-3 mt-3">
          <label for="centerName" class="form-label">소속볼링장:</label>
          <select class="form-select" v-model="centerName" disabled>
              <option :value="this.centerName">{{ centerName }}</option>
          </select>
        </div>
        <div class="mb-3 mt-3">
          <label for="clubName" class="form-label">클럽명:</label>
          <input type="text" class="form-control" placeholder="클럽명을 입력하세요." autocomplete="off" v-model="clubName"/>
        </div>
        <div class="mb-3 mt-3">
          <label for="clubPer" class="form-label">클럽인원:</label>
          <input type="text" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');" class="form-control" placeholder="클럽인원을 입력하세요." autocomplete="off" v-model="clubPer" />
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
          <button type="button" class="btn btn-primary" @click="updateClub">수정</button>
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
  name: 'ClubDetail',
  created() {
    this.clubId = this.$route.params.clubId
    this.getSelectedClub()
  },
  data() {
    return {
      centerName:'',
      clubId: Number,
      centerId: '',
      clubName: '',
      clubPer: '',
      clubDay: '',
      dayList: ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일']

    }
  },
  methods: {    
    getSelectedClub() {
      axios
        .get(`http://175.197.92.213:11000/club/${this.clubId}`)
        .then((response) => {
          console.log(response.data[0])
          this.centerId = response.data.centerId
          this.centerName = response.data.centerName
          this.clubName = response.data.clubName
          this.clubPer = response.data.clubPer
          this.clubDay = response.data.clubDay
        })
    },
    updateClub() {
      if (this.clubName.trim() === '' || this.clubDay.trim() === '') {
        alert('빈 칸을 모두 입력해주세요.');
        return;
      }
      console.log(this.centerId)
      axios
        .put('http://175.197.92.213:11000/club', {
          clubId: this.clubId,
          centerId: this.centerId,
          clubName: this.clubName,
          clubPer: this.clubPer,
          clubDay: this.clubDay
        })
        .then((response) => {
          console.log('add success' + response)
          this.$router.push({
            name: 'ClubList'
          })
        })
        .catch((error) => {
          console.log(error)
          alert('빈 칸을 모두 입력해주세요.')
        })
    }
  }
  
}
</script>

