<template>
  <div class="search">
    <div class="page__bd">
      <div class="weui-search-bar weui-search-bar_focusing">
        <div class="weui-search-bar__form">
          <div class="weui-search-bar__box">
            <icon class="weui-icon-search_in-box" type="search" size="14"></icon>
            <input
              type="text"
              class="weui-search-bar__input"
              placeholder="搜索"
              v-model="inputVal"
              :focus="inputShowed"
              @change="inputTyping"
            >
            <div class="weui-icon-clear" v-if="inputVal.length > 0" @click="clearInput">
              <icon type="clear" size="14" @click="clearInput"></icon>
            </div>
          </div>
          <label class="weui-search-bar__label" v-if="!inputShowed" @click="showInput">
            <icon class="weui-icon-search" type="search" size="14"></icon>
            <div class="weui-search-bar__text">搜索</div>
          </label>
        </div>
        <div class="weui-search-bar__cancel-btn" v-if="inputShowed" @click="hideInput">取消</div>
      </div>
      <div class="weui-cells searchbar-result" v-if="suggestionList">
        <block v-for="(item,index) in suggestionList" :key="index">
          <navigator url class="weui-cell" hover-class="weui-cell_active" >
            <div class="weui-cell__bd">
              <div @click="choosedRegion(item.location,item.parent_city,item.admin_area)">{{item.location}}</div>
            </div>
          </navigator>
        </block> 
      </div>
    </div>
  </div>
</template>

<script>
import "@/wxss/weui.wxss";

// Use Vuex

export default {
  data() {
    return {
        inputShowed: false,
        inputVal: "",
        suggestionList:false
    };
  },
  methods: {
    showInput() {
      this.inputShowed = true
    },
    hideInput: function() {
      this.inputVal = ''
      this.inputShowed = false
      this.suggestionList = false
    },
    clearInput() {
      this.inputVal = ''
      this.suggestionList = false
    },
    inputChanged(){
        console.log(this.inputVal)
        this.querySearch(this.inputVal)
    },
    //focus
    inputTyping: function(e) {
      console.log('tp')
      this.inputShowed = true
      this.querySearch(this.inputVal)
    },
    cancelSearch() {
      this.searchRegionVal = "";
    },
    //选定地区,跳转
    choosedRegion(areaName,cityName,adminName){
      if(areaName == cityName){
        wx.navigateTo({
          url: `/pages/index/main?areaName=${areaName}&cityName=${adminName}`
        })
      }else{
        wx.navigateTo({
          url: `/pages/index/main?areaName=${areaName}&cityName=${cityName}`
        })
      } 
    },
    querySearch(queryString) {
      this.getSuggestion(queryString).then(res => {
        console.log(res);
        this.suggestionList = res
        //cb(res);
      });
    },
    createFilter(queryString) {
      return suggestion => {
        return suggestion.name;
      };
    },
    getSuggestion(queryString) {
      let region = "全国";
      let url = `https://search.heweather.net/find?`;
      let key = "e82fb3f88fdf41898b945fda077cffbc";
      let location = queryString;
      let keywords = queryString;
      url += `location=${queryString}`;
      return new Promise((resolve, reject) => {
        this.$axios.get(url).then(res => {
          resolve(res.HeWeather6[0].basic);
        });
      });
    },
  }
};
</script>

<style>
.search{
    color: #333;
    font-size: 20rpx;
}
.weui-search-bar__input{
  text-align: left;
}
.weui-cells{
  margin-top: 0 !important;
}

</style>
