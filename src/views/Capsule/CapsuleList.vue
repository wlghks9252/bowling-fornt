<template>
    <div class="container mt-3">
      <li>
        <router-link to="/center">볼링장 목록</router-link>ㅣ
        <router-link to="/club">클럽 목록</router-link>ㅣ
        <router-link to="/capsule">캡슐이벤트 목록</router-link>
      </li>
      <div class="btn-group">
        <span><router-link to="/capsule/create" class="btn btn-primary">캡슐이벤트 추가</router-link></span>
        <span style="margin-left: 10px;"><button class="btn btn-primary" @click="deleteCapsule">삭제</button></span>
      </div>
      <table class="table table-hover mt-3">
        <thead class="table-dark">
          <tr>
            <th></th>
            <th>진행 볼링장</th>
            <th>성공점수</th>
            <th>시작 날짜</th>
            <th>상품목록</th>
            <th>상품 추가</th>
          </tr>
        </thead>
        <tbody>
          <tr class="cursor-pointer" v-for="row in paginatedCapsuleList" v-bind:key="row.capsuleId" @click="goToCapsuleDetail(row)">
            <td>
              <input type="checkbox" v-model="row.isSelected" @click.stop/>
            </td>
            <td>{{ row.centerName }}</td>
            <td>{{ row.capsuleScore }}</td>
            <td>{{ row.capsuleSdate }}</td>
            <td>
              <ul>
                <span class="arrow-icon" @click.stop="showGoodsListModal(row)">
                  <img src="@/assets/images/list.png" style="width:25px; height:25px;"/>
                </span>
              </ul>
            </td>
            <td @click.stop><input type="goods" v-model="row.goodsName" @keyup.enter="addGoods(row)"/><button @click="addGoods(row)">추가하기</button></td>
          </tr>
        </tbody>
      </table>
      
      <!-- goods modal -->
      <div class="modal" :class="{ 'd-block': showModal }" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Goods List</h5>
              <button type="button" class="btn" @click="hideGoodsListModal">
                <span>&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <ul>
                <li v-for="goods in selectedGoodsList" :key="goods.goodsId">
                  {{ goods.goodsName }}
                  <button class="btn btn-primary" @click="deleteGoods(goods)" id="deleteGoodsBtn">X</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <nav>
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="changePage(1)">처음</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="changePage(currentPage - 1)">이전</button>
          </li>
          <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
            <button class="page-link" @click="changePage(page)">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="changePage(currentPage + 1)">다음</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="changePage(totalPages)">마지막</button>
          </li>
        </ul>
      </nav>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
  name: 'CapsuleList',
  data() {
    return {
      capsuleList: [],
      goodsList: [],
      showModal: false,
      selectedGoodsList: [],
      centerId: '',
      currentPage: 1,
      itemsPerPage: 5,
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.capsuleList.length / this.itemsPerPage);
    },
    paginatedCapsuleList() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.capsuleList.slice(start, end);
    },
  },
  methods: {
    
    getCapsuleList() {
      axios
        .get('http://175.197.92.213:11000/capsule')
        .then(response => {
          this.capsuleList = response.data;
        })
        .catch(error => console.log(error));
    },
    getGoodsList() {
      axios
        .get('http://175.197.92.213:11000/goods')
        .then(response => {
          this.goodsList = response.data;
        })
        .catch(error => console.log(error));
    },
    showGoodsListModal(row) {
      this.getGoodsList();
      this.showModal = true;
      this.selectedGoodsList = this.goodsList.filter((goods) => goods.capsuleId === row.capsuleId);      
    },
    hideGoodsListModal() {
      this.showModal = false;
    },
    addGoods(row) {
      console.log(row.capsuleId);
      axios
        .post('http://175.197.92.213:11000/goods', {
          capsuleId: row.capsuleId,
          goodsName: row.goodsName
        })
        .then(() => {
          row.goodsName = '';
          this.getGoodsList();
          console.log('Goods added successfully');
        })
        .catch(error => {
          console.log('Error adding goods:', error);
        }); 
    },
    goToCapsuleDetail(row) {
      this.$router.push({ 
        name: 'CapsuleDetail',
        params: {
          capsuleId: row.capsuleId
        }
      })
    },
    deleteCapsule() {
        const selectedRows = this.capsuleList.filter((row) => row.isSelected);
        const selectedCapsuleIds = selectedRows.map((row) => row.capsuleId);
        if(selectedRows.length) {
          axios
          .delete('http://175.197.92.213:11000/capsule', { data: selectedCapsuleIds })
          .then(() => {
            this.capsuleList = this.capsuleList.filter((row) => !row.isSelected);
          })
          .catch((error) => {
            console.error('Deletion error:', error);
          });
        } else {
          alert('삭제할 항목을 선택해주세요.')
        }
      },
      deleteGoods(goods) {
        axios
          .delete(`http://175.197.92.213:11000/goods/${goods.goodsId}`)
          .then((response) => {
            console.log(response.data);
            this.selectedGoodsList = this.selectedGoodsList.filter((item) => item.goodsId !== goods.goodsId);
          })
          .catch((error) => {
            console.error('Deletion error:', error);
          });
      },
      changePage(page) {
        if (page >= 1 && page <= this.totalPages) {
          this.currentPage = page;
        }
      },
  },
  created() {
    this.getCapsuleList();
    this.getGoodsList();
  }
}

  </script>
