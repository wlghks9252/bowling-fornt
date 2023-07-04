<template>
    <div class="container mt-3">
      <ul>
          <li>
              <router-link to="/center">볼링장 목록</router-link>ㅣ
              <router-link to="/club">클럽 목록</router-link>ㅣ
              <router-link to="/capsule">캡슐이벤트 목록</router-link>
          </li>
      </ul>
      <h2>캡슐이벤트 수정</h2>
      <div class="mb-3 mt-3">
        <label for="centerName" class="form-label">진행 볼링장:</label>
        <select class="form-select" v-model="centerName" disabled>
            <option :value="this.centerName">{{ centerName }}</option>
        </select>
      </div>
      <div class="mb-3 mt-3">
        <label for="capsuleSdate" class="form-label">시작날짜:</label>
        <input type="date" class="form-control" autocomplete="off" v-model="capsuleSdate"/>
      </div>
      <div class="mb-3 mt-3">
        <label for="capsuleScore" class="form-label">성공점수:</label>
        <input type="text" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');" class="form-control" placeholder="성공점수를 입력하세요." autocomplete="off" v-model="capsuleScore" />
      </div>
      <div class="d-flex">
        <div class="p-2 flex-fill d-grid">
          <button type="button" class="btn btn-primary" @click="updateCapsule">수정</button>
        </div>
        <div class="p-2 flex-fill d-grid">
          <router-link to="/capsule" class="btn btn-primary">취소</router-link>
        </div>
      </div>
    </div>
</template>
<script>
import axios from 'axios'

export default {
  name: 'CapsuleDetail',
  created() {
    this.capsuleId = this.$route.params.capsuleId
    this.getSelectedCapsule()
  },
  data() {
    return {
      centerName:'',
      capsuleId: Number,
      centerId: '',
      capsuleSdate: '',
      capsuleScore: ''
    }
  },
  methods: {    
    getSelectedCapsule() {
      axios
        .get(`http://175.197.92.213:11000/capsule/${this.capsuleId}`)
        .then((response) => {
          this.centerId = response.data.centerId
          this.centerName = response.data.centerName
          this.capsuleSdate = response.data.capsuleSdate
          this.capsuleScore = response.data.capsuleScore
          console.log(this.centerId)
        })
    },
    updateCapsule() {
      
      axios
        .put('http://175.197.92.213:11000/capsule', {
          capsuleId: this.capsuleId,
          centerId: this.centerId,
          capsuleSdate: this.capsuleSdate,
          capsuleScore: this.capsuleScore
        })
        .then((response) => {
          console.log('add success' + response)
          this.$router.push({
            name: 'CapsuleList'
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
