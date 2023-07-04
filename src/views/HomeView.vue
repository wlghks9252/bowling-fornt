<template>
  <main>
    <div id="map">
      <select v-model="selectedRegion" @change="selectRegion" style="position:fixed; z-index:99; top:7%; left:3%;">
      <option disabled value="">지역을 선택하세요</option>
      <option v-for="region in regions" :key="region" :value="region">{{ region}}</option>
    </select>
    </div>
    
  </main>
  <article>
    <div class="search-container" >
      <div class="back-button" @click="goBack" style="position: relative;">
        <img v-if="!isSearched" src="@/assets/images/list.png" style="transform: translateY(-50%); width: 20px; cursor: pointer;" @click="goToList"/>
      </div>
      <input type="search" placeholder="검색어를 입력해주세요" style="margin-bottom:20px;" v-model="keyword" @keyup.enter="searchCenterName"/>
      <a href="#"><img src="@/assets/images/search-interface-symbol.png" style="width:24px; margin:-6px 0 0 3px;" @click="searchCenterName"/></a>
    </div>
    <div v-if="selectedCenter.centerName">
      <h3>1. 볼링장 정보</h3>
      <h5>{{ selectedCenter.centerName }}</h5>
      <ul class="info">
        <li>운영시간: {{ selectedCenter.startTime }} ~ {{ selectedCenter.endTime }}</li>
        <li>주소: {{ selectedCenter.centerAddress }}</li>
        <li>전화번호: {{ selectedCenter.centerTel }}</li>
        <li>가격: 회원가({{ selectedCenter.memPrice }}원), 일반 ({{ selectedCenter.norPrice }}원)</li>
        <li>캡슐 상품목록: 
          <span v-if="selectedGoodsList">           
            <span class="goodsname" v-for="(goods, index) in selectedGoodsList" :key="goods.goodsId">
              {{ goods.goodsName }}
              <span v-if="index !== selectedGoodsList.length - 1">,</span>
            </span>
          </span>
        </li>
        <li>캡슐 목표점수: {{ capsuleScore }}</li>
        <li>상주클럽: 
          <div v-if="selectedClubList.length">
            <table class="table mt-3">
              <thead class="table-dark">
                <tr>
                  <th>클럽명</th>
                  <th>인원</th>
                  <th>정기전 요일</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in selectedClubList" v-bind:key="row.clubId">
                  <td>{{ row.clubName }}</td>
                  <td>{{ row.clubPer }}</td>
                  <td>{{ row.clubDay }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </li>
      </ul>
      <h3>2. 방문자 리뷰</h3>
      <table class="table table-hover mt-3">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>리뷰 내용</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in paginatedList" :key="row.comNo" class="cursor-pointer" @click.stop="showCommentModal(row)">
            <td>{{ row.comId }}</td>
            <td>
              <span v-if="row.editing !== true">{{ row.comContent }}</span>
              <input v-else type="text" @click.stop v-model="comContent" @keyup.enter="updateComment(row)"/>
              <button v-if="row.editing == true" @click.stop="updateComment(row)">수정</button>
            </td>
          </tr>
        </tbody>
      </table>
      <nav v-if="commentList.length">
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
      <h3>3. 댓글 작성</h3>
      <div>
        <form @submit="addComment">
          <li>ID:<input class="commentInput" v-model="comId"/>PW:<input type="password" class="commentInput" v-model="comPw"/></li>
          <li>콘텐츠:</li>
          <textarea @keyup.enter="addComment" v-model="newContent"/>
          <span>
            <button type="submit" id="createCommentBtn">작성</button>
          </span>
        </form>
      </div>
    </div>
    <div v-if="isSearched">
      <table class="table table-hover mt-3">
        <thead class="table-dark">
          <tr>
            <th>상호명</th>
            <th>주소</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in paginatedList" v-bind:key="row.centerId" class="cursor-pointer" @click="goToCenterDetail(row)">
            <td>{{ row.centerName }}</td>
            <td>{{ row.centerAddress }}</td>
          </tr>
        </tbody>
      </table>
      <nav v-if="searchList.length">
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
    <div v-if="showPasswordModal" class="modal" tabindex="-1" role="dialog" style="display: block;">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">댓글 수정</h5>
            <button type="button" class="close" aria-label="Close" @click="closeModal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <input type="password" v-model="inputComPw" class="form-control" placeholder="Password" @keyup.enter="clickUpdate">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="showPasswordModal = false; clickUpdate()">수정</button>
            <button type="button" class="btn btn-primary" @click="showPasswordModal = false; clickDelete()">삭제</button>
          </div>
        </div>
      </div>
    </div>
  </article>

</template>

<script>
import axios from 'axios';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, transform } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Icon, Style } from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

export default {
  name: 'HomeView',
  data() {
    return {
      centerList: [],
      searchList: [],
      selectedCenter: {},
      map: null,
      capsuleList: [],
      goodsList: [],
      commentList: [],
      showModal: false,
      selectedClubList: [],
      selectedGoodsList: [],
      centerId: '',
      keyword: '',
      isSearched: true,
      comId: '',
      comPw: '',
      comContent: '',
      selectedComPw: '',
      comNo: '',
      currentPage: 1,
      itemsPerPage: 5,
      showPasswordModal: false,
      editing:false,
      newContent: '',
      inputComPw: '',
      regions : ['전체', '서울', '경기', '인천','충북','충남', '강원', '전북', '전남','경북','경남'],
      selectedRegion: '',
      capsuleScore:'',
      listPerRegion: [],
      isRowClick: false
    };
  },
  computed: {
    totalPages() {
      if (this.isSearched) {
        return Math.ceil(this.searchList.length / this.itemsPerPage); 
      } else {
        return Math.ceil(this.commentList.length / this.itemsPerPage);
      }
    },
    paginatedList() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      if (this.isSearched) {
        return this.searchList.slice(start, end);
      } else {
        return this.commentList.slice(start, end);
      } 
    },   
  },
  methods: {
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    changeClubPage(page) {
      if (page >= 1 && page <= this.clubTotalPages) {
        this.currentPage = page;
      }
    },
    initMap() {
      this.map = new Map({
        target: 'map',
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: fromLonLat([126.886321, 37.4809610]),
          zoom: 10,
        }),
      });

      const markerSource = new VectorSource();
      const markerLayer = new VectorLayer({
        source: markerSource,
      });
      this.searchList.forEach((center) => {
        const centerCoordinates = fromLonLat([center.centerLon, center.centerLat])
        const markerFeature = new Feature({
          geometry: new Point(centerCoordinates),
        });
        const markerStyle = new Style({
          image: new Icon({
            src: require('@/assets/images/marker.png'),
            anchor: [0.5, 1],
            scale: 0.1,
          }),
        });
        markerFeature.setStyle(markerStyle);
        markerSource.addFeature(markerFeature);
      });
      
      this.map.addLayer(markerLayer);
      this.getSelectedCenterData();
      this.fitMapToMarkers();
    },
    updateMarkers() {
      const markerSource = this.map.getLayers().getArray()[1].getSource();
      markerSource.clear();

      this.searchList.forEach((center) => {
        const centerCoordinates = fromLonLat([center.centerLon, center.centerLat]);
        const markerFeature = new Feature({
          geometry: new Point(centerCoordinates),
        });
        const markerStyle = new Style({
          image: new Icon({
            src: require('@/assets/images/marker.png'),
            anchor: [0.5, 1],
            scale: 0.1,
          }),
        });
        markerFeature.setId(center.centerId);

        markerFeature.setStyle(markerStyle);
        markerSource.addFeature(markerFeature);
      });
      
      if (this.searchList.length === 1) {
        const centerCoordinates = fromLonLat([this.searchList[0].centerLon, this.searchList[0].centerLat]);
        const zoomLevel = 14;
        const duration = 1000;
        this.map.getView().animate({ center: centerCoordinates, zoom: zoomLevel, duration });
      } else if (this.searchList.length > 1) {
        this.fitMapToMarkers();
      }
    },
    fitMapToMarkers() {
      const markerSource = this.map.getLayers().getArray()[1].getSource();
      const extent = markerSource.getExtent();
      this.map.getView().fit(extent, { padding: [100, 100, 100, 100], zoom: 16, duration: 1000 });
    },
    getSelectedCenterData() {
      let previousFeature = null; 
      
      this.map.on('click', (event) => {
        try {
          
          this.map.forEachFeatureAtPixel(event.pixel, (feature) => {
            
            const coordinates = feature.getGeometry().getCoordinates();
            const clickedCoordinates = transform(coordinates, 'EPSG:3857', 'EPSG:4326');

            const clickedLat = Number(clickedCoordinates[1]).toFixed(13);
            const clickedLon = Number(clickedCoordinates[0]).toFixed(12);

            const clickedCenter = this.searchList.find((center) => {
              return center.centerLat == clickedLat && center.centerLon == clickedLon;
            });
            

            if(this.isRowClick) {
              const markerSource = this.map.getLayers().getArray()[1].getSource();
              const features = markerSource.getFeatures();
              const selectedFeature = features.find((feature) => {
                return this.selectedCenter.centerId == feature.getId();
              })
              console.log('getId',selectedFeature.getId());
              selectedFeature.getStyle().getImage().setScale(0.1)
            }
            if (clickedCenter) {
              this.selectedCenter = clickedCenter;
            }

            const markerStyle = feature.getStyle();
            const markerImage = markerStyle.getImage();
            const newScale = 0.2; 
            markerImage.setScale(newScale);

            if (previousFeature && previousFeature !== feature && this.selectedCenter) {
              const previousMarkerStyle = previousFeature.getStyle();
              const previousMarkerImage = previousMarkerStyle.getImage();
              const originalScale = 0.1; 
              previousMarkerImage.setScale(originalScale);
            } 

            previousFeature = feature;

            this.map.getView().animate({
              center: coordinates,
              zoom: 14,
              duration: 500,
            });

            this.getSelectedGoodsList();
            this.getSelectedClubList();
            this.getSelectedCommentList();
            this.isSearched = false;
          });
        } catch (error) {
          console.error(error);
        }
      });
    },
    getCenterList() {
      axios
        .get('http://175.197.92.213:11000/center')
        .then((response) => {
          this.centerList = response.data;
          this.searchList = this.centerList;
          this.initMap();
          this.selectRegion();

        })
        .catch((error) => {
          console.log(error);
        });
    },
    getSelectedGoodsList() {
      axios
        .get(`http://175.197.92.213:11000/goods/by${this.selectedCenter.centerId}`)
        .then((response) => {
          this.selectedGoodsList = response.data;
          this.capsuleScore = this.selectedGoodsList[0].capsuleScore;
          console.log('굿즈',this.selectedGoodsList)
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getSelectedClubList() {
      axios
        .get(`http://175.197.92.213:11000/club/by${this.selectedCenter.centerId}`)
        .then((response) => {
          this.selectedClubList = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getSelectedCommentList() {
      axios
        .get(`http://175.197.92.213:11000/comment/${this.selectedCenter.centerId}`)
        .then((response) => {
          this.commentList = response.data;
          console.log(this.commentList)
        })
        .catch((error) => {
          console.log(error);
        })
    },
    searchCenterName() {
      this.selectedCenter = '';
      const trimmedKeyword = this.keyword.replace(/\s+/g, '');

      if (!trimmedKeyword) {
        this.searchList = this.listPerRegion
      } else {
        this.searchList = this.listPerRegion.filter((center) => {
          const centerNameWithoutSpaces = center.centerName.replace(/\s+/g, '');
          return centerNameWithoutSpaces.includes(trimmedKeyword);
        });
        console.log('test',this.searchList)
      }

      this.isSearched = true;
      this.updateMarkers();
    },
    goToCenterDetail(row) {
      this.isRowClick = true;
      if(this.isRowClick) {
        this.selectedCenter = row
        const centerCoordinates = fromLonLat([row.centerLon, row.centerLat]);
        this.map.getView().animate({ 
          center: centerCoordinates, 
          zoom: 14, 
          duration: 500 
        });      
        
        this.isSearched = false;
        this.getSelectedGoodsList();
        this.getSelectedClubList();
        this.getSelectedCommentList();
        const markerSource = this.map.getLayers().getArray()[1].getSource();
        const features = markerSource.getFeatures();
        const selectedFeature = features.find((feature) => {
          return row.centerId == feature.getId();
        })
        console.log('selectedFeature',selectedFeature)
        const markerStyle = selectedFeature.getStyle();
        const markerImage = markerStyle.getImage();


        markerImage.setScale(0.2);
        selectedFeature.setStyle(markerStyle);
      }
      
    },
    addComment(e) {
      axios
        .post('http://175.197.92.213:11000/comment', {
          centerId: this.selectedCenter.centerId,
          comId: this.comId,
          comPw: this.comPw,
          comContent: this.newContent
        })
        .then(() => {
          console.log('성공')
          this.getSelectedCommentList()
        })
        .catch((error) => {
          console.log(error);
        })
      this.comId = ''
      this.comPw = ''
      this.newContent = ''
      e.preventDefault();
    },
    updateComment(row) {
      console.log('엔터누를때',row);
      console.log('입력한내용',this.newContent);
      axios
        .put('http://175.197.92.213:11000/comment',{
            comNo: row.comNo,
            comId: row.comId,
            comPw: row.comPw,
            comContent: this.comContent,
            centerId: row.centerId
        })
        .then(() => {
          console.log('성공')
          this.getSelectedCommentList()
        })
        .catch((error) => {
          console.log(error)
          console.log('axios실패!')
        })
      
    },
    showCommentModal(row) {
      this.showPasswordModal = true;
      this.selectedComPw = row.comPw
      this.comNo = row.comNo
    },
    clickUpdate() {
      if(this.inputComPw == this.selectedComPw) {
        const selectedComment = this.commentList.find((comment) => {
              return comment.comNo == this.comNo 
        });
        this.comContent = selectedComment.comContent
        selectedComment.editing = true
        this.showPasswordModal = false
      } else {
        alert('비밀번호가 틀렸습니다.')
      }
      this.inputComPw = ''
    },
    clickDelete() {
      if(this.inputComPw == this.selectedComPw) {
        axios
          .delete(`http://175.197.92.213:11000/comment/${this.comNo}`)
          .then(() => {
            this.getSelectedCommentList()
          })
          .catch((error) => {
            console.log('삭제실패')
            console.log(error)
          })
      }else {
        alert('비밀번호가 틀렸습니다.')
      }
      this.inputComPw = ''
    },
    closeModal() {
      this.showPasswordModal = false;
      this.inputComPw = ''
    },
    selectRegion() {
      this.selectedCenter = '';

      if(this.selectedRegion === '전체' || !this.selectedRegion) {
        this.listPerRegion = this.centerList
        console.log(this.searchList);
      
      } else {
        this.listPerRegion = this.centerList.filter((center) => {
            return center.centerAddress.includes(this.selectedRegion);
        });      
        console.log('listPerRegion',this.listPerRegion)
      }
      this.isSearched = true;
      this.searchList = this.listPerRegion;
      this.searchCenterName();
      this.updateMarkers();
    },
    goToList() {
      this.isSearched = true;
      this.searchCenterName();
    }
  },
  created() {
    this.getCenterList();
    console.log(this.selectedRegion);
  },
};
</script>


