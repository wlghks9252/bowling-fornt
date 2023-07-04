<template>
    <div class="container mt-3">
        <ul>
            <li>
                <router-link to="/center">볼링장 목록</router-link>ㅣ
                <router-link to="/club">클럽 목록</router-link>ㅣ
                <router-link to="/capsule">캡슐이벤트 목록</router-link>
            </li>
        </ul>
      <h2>캡슐이벤트 등록</h2>
      <div class="mb-3 mt-3">
        <label for="centerName" class="form-label">진행 볼링장:</label>
        <select class="form-select" v-model="centerId">
            <option v-for="center in createCenterList" :value="center.centerId" v-bind:key="center.centerId">{{ center.centerName }}</option>
          </select>
      </div>
      <div class="mb-3 mt-3">
        <label for="clubName" class="form-label">시작날짜:</label>
        <input type="date" class="form-control" autocomplete="off" v-model="capsuleSdate"/>
      </div>
      <div class="mb-3 mt-3">
        <label for="clubPer" class="form-label">성공점수:</label>
        <input type="text" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');" class="form-control" placeholder="성공점수를 입력하세요." autocomplete="off" v-model="capsuleScore" required/>
      </div>
      <div class="d-flex">
        <div class="p-2 flex-fill d-grid">
          <button type="button" class="btn btn-primary" @click="addCapsule">생성</button>
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
  name: 'CapsuleCreate',
  data() {
    return {
      centerList: [],
      capsuleList: [],
      centerName:'',
      capsuleId: Number,
      centerId: '',
      capsuleSdate: new Date().toISOString().split('T')[0],
      capsuleScore: ''
    }
  },
  methods: {
    getCapsuleList() {
      axios
        .get('http://175.197.92.213:11000/capsule')
        .then((response) => {
          this.capsuleList = response.data;
        })
        .catch((error) => console.log(error));
    },
    getCenterList() {
      axios
        .get('http://175.197.92.213:11000/center')
        .then((response) => {
          this.centerList = response.data;
          
        })
        .catch((error) => console.log(error));
    },
    addCapsule() {
      
      axios
        .post('http://175.197.92.213:11000/capsule', {
          centerId: this.centerId,
          capsuleSdate: this.capsuleSdate,
          capsuleScore: this.capsuleScore
        })
        .then(() => {
          this.$router.push({
            name: 'CapsuleList'
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
    this.getCapsuleList();
  },
  computed: {
    createCenterList() {
      return this.centerList.filter(center => {
        const existingCapsule = this.capsuleList.find(capsule => capsule.centerId === center.centerId);
        return existingCapsule ? false : true;
      });
    }
  }
}
</script>

