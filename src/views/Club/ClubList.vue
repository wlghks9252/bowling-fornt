<template>
    <div class="container mt-3">
      <li>
        <router-link to="/center">볼링장 목록</router-link>ㅣ
        <router-link to="/club">클럽 목록</router-link>ㅣ
        <router-link to="/capsule">캡슐이벤트 목록</router-link>
      </li>
      <div class="btn-group">
        <span><router-link to="/club/create" class="btn btn-primary">클럽 추가</router-link></span>
        <span style="margin-left: 10px;"><button class="btn btn-primary" @click="deleteClub">삭제</button></span>
      </div>
      <table class="table table-hover mt-3">
        <thead class="table-dark">
          <tr>
            <th></th>
            <th>소속 볼링장</th>
            <th>클럽 명</th>
            <th>클럽 인원</th>
            <th>정기전 요일</th>
          </tr>
        </thead>
        <tbody>
          <tr class="cursor-pointer" v-for="row in paginatedClubList" v-bind:key="row.clubId" @click="goToClubDetail(row)">
            <td>
              <input type="checkbox" v-model="row.isSelected" @click.stop/>
            </td>
            <td>{{ row.centerName }}</td>
            <td>{{ row.clubName }}</td>
            <td>{{ row.clubPer }} 명</td>
            <td>{{ row.clubDay }}</td>
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
    name: 'ClubList',
    data() {
      return {
        clubList: [],
        currentPage: 1,
        itemsPerPage: 5,
      }
    },
    computed: {
      totalPages() {
        return Math.ceil(this.clubList.length / this.itemsPerPage);
      },
      paginatedClubList() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.clubList.slice(start, end);
      },
    },
    methods: {
      getClubList() {
        axios
          .get('http://175.197.92.213:11000/club')
          .then((response) => {
            this.clubList = response.data;
            console.log(this.clubList);
          })
          .catch((error) => console.log(error));
      },
      goToClubDetail(row) {
        this.$router.push({ 
          name: 'ClubDetail',
          params: {
            clubId: row.clubId
          }
        })
      },
      deleteClub() {
        const selectedRows = this.clubList.filter((row) => row.isSelected);
        const selectedClubIds = selectedRows.map((row) => row.clubId);
        if (selectedClubIds.length) {
          axios
          .delete('http://175.197.92.213:11000/club', { data: selectedClubIds })
          .then(() => {
            this.clubList = this.clubList.filter((row) => !row.isSelected);
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
      this.getClubList();
    }
    
  }
  </script>
  
