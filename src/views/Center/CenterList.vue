<template>
    <div class="container mt-3">
      <li>
        <router-link to="/center">볼링장 목록</router-link>ㅣ
        <router-link to="/club">클럽 목록</router-link>ㅣ
        <router-link to="/capsule">캡슐이벤트 목록</router-link>
      </li>
      <div class="btn-group">
        <span><router-link to="/center/create" class="btn btn-primary">볼링장 추가</router-link></span>
        <span style="margin-left: 10px;"><button class="btn btn-primary" @click="deleteCenter">삭제</button></span>
      </div>
      <table class="table table-hover mt-3">
        <thead class="table-dark">
          <tr>
            <th></th>
            <th>볼링장명</th>
            <th>주소</th>
            <th>운영시간</th>
          </tr>
        </thead>
        <tbody>
          <tr class="cursor-pointer" v-for="row in paginatedCenterList" v-bind:key="row.centerId" @click="goToCenterDetail(row)">
            <td>
              <input type="checkbox" v-model="row.isSelected" @click.stop/>
            </td>
            <td>{{ row.centerName }}</td>
            <td>{{ row.centerAddress }}</td>
            <td>{{ row.startTime }} ~ {{ row.endTime }}</td>
          </tr>
        </tbody>
      </table>
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
    name: 'CenterList',
    data() {
      return {
        centerList: [],
        isLogin: true,
        currentPage: 1,
        itemsPerPage: 5,
      }
    },
    computed: {
      totalPages() {
        console.log('렝스',this.centerList.length , '페이지당건수', this.itemsPerPage)
        return Math.ceil(this.centerList.length / this.itemsPerPage);
      },
      paginatedCenterList() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.centerList.slice(start, end);
      },
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
      goToCenterDetail(row) {
        this.$router.push({ 
          name: 'CenterDetail',
          params: {
            centerId: row.centerId
          }
        })
      },
      deleteCenter() {
        const selectedRows = this.centerList.filter((row) => row.isSelected);
        const selectedCenterIds = selectedRows.map((row) => row.centerId);
        if (selectedCenterIds.length > 0) {
          axios
            .delete('http://175.197.92.213:11000/center', { data: selectedCenterIds })
            .then(() => {
              this.centerList = this.centerList.filter((row) => !row.isSelected);
            })
            .catch((error) => {
              console.error('Deletion error:', error);
            });
        } else {
          alert('삭제할 항목을 선택해주세요.')
        } 
      },
      changePage(page) {
        if (page >= 1 && page <= this.totalPages) {
          this.currentPage = page;
        }
      },
    },
    created() {
      this.getCenterList();
    }
  }
  </script>

  
