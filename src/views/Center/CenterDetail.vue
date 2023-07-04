<template>
    <div class="container mt-3">
        <ul>
            <li>
                <router-link to="/center">볼링장 목록</router-link>ㅣ
                <router-link to="/club">클럽 목록</router-link>ㅣ
                <router-link to="/capsule">캡슐이벤트 목록</router-link>
            </li>
        </ul>
      <h2>볼링장 수정</h2>
      <div class="mb-3 mt-3">
        <label for="centerName" class="form-label">볼링장 명:</label>
        <input type="text" class="form-control" placeholder="볼링장명을 입력하세요." autocomplete="off" v-model="centerName" required/>
      </div>
      <div class="mb-3 mt-3">
          <label for="centerAddress" class="form-label">주소</label>
          <input type="text" class="form-control" placeholder="주소를 입력하세요." autocomplete="off" v-model="centerAddress" disabled required />
          <button class="btn btn-primary" @click="openPostCode">검색</button>
      </div>
      <div class="mb-3 mt-3">
        <label for="startTime" class="form-label">운영시간:</label>
        <div class="d-flex align-items-center">
          <input type="time" class="form-control me-2" autocomplete="off" v-model="startTime" required/>
          <span>~</span>
          <input type="time" class="form-control ms-2" autocomplete="off" v-model="endTime" required/>
        </div>
      </div>
      <div class="mb-3 mt-3">
        <label for="centerTel" class="form-label">전화번호: (- 없이 입력)</label>
        <input type="text" oninput="this.value = this.value.replace(/\D/g, '')" class="form-control" placeholder="전화번호를 입력하세요." autocomplete="off" v-model="centerTel" required />
      </div>
      <div class="mb-3 mt-3">
        <label for="norPrice" class="form-label">일반가: </label>
        <div class="input-group">
          <input type="text" class="form-control" placeholder="일반가를 입력하세요." autocomplete="off" v-model="norPrice" required/>
          <span class="input-group-text">원</span>
        </div>
      </div>
      <div class="mb-3">
        <label for="memPrice" class="form-label">회원가:</label>
        <div class="input-group">
          <input type="text" class="form-control" placeholder="회원가를 입력하세요." autocomplete="off" v-model="memPrice" required/>
          <span class="input-group-text">원</span>
        </div>
      </div>
      <div class="d-flex">
        <div class="p-2 flex-fill d-grid">
          <button type="button" class="btn btn-primary" @click="updateCenter">수정</button>
        </div>
        <div class="p-2 flex-fill d-grid">
          <router-link to="/center" class="btn btn-primary">취소</router-link>
        </div>
      </div>
    </div>
  </template>
<script>
import axios from 'axios'

export default {
  name: 'CenterDetail',
  created() {
    console.log(this.$route)
    this.centerId = this.$route.params.centerId;
    this.getSelectedCenter()
  },
  data() {
    return {
      centerName : '',
      startTime : '',
      endTime : '',
      centerAddress : '',
      centerTel : '',
      centerLat : '',
      centerLon : '',
      norPrice : '',
      memPrice : '',
    }
  },
  methods: {    
    getCoordinates(address) {
      const apiUrl = 'https://dapi.kakao.com/v2/local/search/address.json';
      const apiKey = 'e2bd71c27bbfd93fc2ec6f61fcca1176';
      axios
        .get(apiUrl, {
          params: {
            query: address,
          },
          headers: {
            Authorization: `KakaoAK ${apiKey}`,
          },
        })
        .then((response) => {
          const documents = response.data.documents;
          if (documents.length > 0) {
            const location = documents[0].address;
            this.centerLat = location.y;
            this.centerLon = location.x;
          }
        })
        .catch((error) => console.log(error));
    },
    getSelectedCenter() {
      axios
        .get(`http://175.197.92.213:11000/center/${this.centerId}`)
        .then((response) => {
          console.log(response.data),
          this.centerName = response.data.centerName;
          this.startTime = response.data.startTime;
          this.endTime = response.data.endTime;
          this.centerAddress = response.data.centerAddress;
          this.centerTel = response.data.centerTel;
          this.centerLat = response.data.centerLat;
          this.centerLon = response.data.centerLon;
          this.norPrice = response.data.norPrice;
          this.memPrice = response.data.memPrice;
        });
    },
    openPostCode() {
        new window.daum.Postcode({
            oncomplete: (data) => {
                this.centerAddress = data.roadAddress;
                this.getCoordinates(data.roadAddress);
            },
        }).open();
    },
    updateCenter() {
      if (this.centerName.trim() === '' || this.centerAddress.trim() === '') {
        alert('빈 칸을 모두 입력해주세요.');
        return;
      }
      axios
        .put('http://175.197.92.213:11000/center', {
          centerId: this.centerId,
          centerName: this.centerName,
          startTime: this.startTime,
          endTime : this.endTime,
          centerAddress : this.centerAddress,
          centerTel : this.centerTel,
          centerLat : this.centerLat,
          centerLon : this.centerLon,
          norPrice: this.norPrice,
          memPrice : this.memPrice
        })
        .then((response) => {
          console.log('add success' + response)
          this.$router.push({
            name: 'CenterList'
          });
        })
        .catch((error) => {
          alert('빈 칸을 모두 입력해주세요.')
          console.log(error)
        });    
    }
  }
  
}
</script>
