<template>
  <div class="index">
    <!-- <img src="/static/icons/100.png" alt=""> -->
    <h1 class="today">{{today}}</h1>
    <router-link to="/region" tag="h2" class="local_title"></router-link>
    <navigator url="/pages/region/main" hover-class="navigator-hover">{{city}}-{{area}}</navigator>
    <h3 class="weather_status">
      {{nowweatherStatus}}
      <span>{{nowWindDir}}</span>
      <span>{{nowWindSc}}级</span>
    </h3>
    <h4 class="now_tmp">{{nowTmp}}℃</h4>
    <!-- <canvas-swiper/> -->
    <swiper
      :indicator-dots="indicatorDots"
      :autoplay="autoplay"
      :interval="interval"
      :duration="duration"
      :display-multiple-items="4"
      class="banner-swiper"
    >
      <swiper-item
        class="weather_details"
        v-for="(item,index) in forecastWeather"
        :key="index"
        ref="slider"
      >
        <!-- <img :src="item" class="slide-image" width="355" height="150"> -->
        <h3 class="day" v-if="index === 0">今天</h3>
        <h3 class="day" v-if="index !== 0">{{week[index+day]}}</h3>
        <!-- <h3 class="day" v-if="index !== 0">{{'index'+day}}</h3> -->
        <h4 class="date">{{item.date}}</h4>
        <p class="day_status">{{item.cond_txt_d}}</p>
        <img :src="'/static/icons/'+item.cond_code_d +'.png'" alt class="cond_img">
        <p class="empty"></p>
        <img :src="'/static/icons/'+ item.cond_code_d +'.png'" alt class="cond_img">
        <p class="night_status">{{item.cond_txt_n}}</p>
        <p class="wind_dir">{{item.wind_dir}}</p>
        <p class="wind_sc">{{item.wind_sc}}级</p>
        <p class="air_qlty">良</p>
      </swiper-item>
      <canvas
        canvas-id="canvas"
        ref="canvas"
        class="tem_canvas"
        :style="{width:canvasWidth+'px',height:canvasHeight+'px'}"
      ></canvas>
    </swiper>
  </div>
</template>

<script>
// import card from "@/components/card";
/* import canvasSwiper from "@/components/swiper/swiper"; */
export default {
  data() {
    return {
      //indicatorDots: true,
      autoplay: false,
      interval: 5000,
      duration: 500,
      weekName2: 2,
      canvasWidth: "400",
      canvasHeight: "200",
      clientWidth: "",
      c: "", //画布实例
      diff: "", //温差
      HEIGHT: "", //画布高度
      ONE_HEIGHT: "", //每一度的高度,等于总高度除以温差
      WIDTH: "", //每一天的间隔
      RADIUS: 2, //点的半径
      PADDING: "", //间隔,等于宽度的一半
      max: "",
      today: "", //当天
      city: "上海", //本地市
      area: "宝山", //本地区
      day: "", //当天星期几的索引
      nowweather: [], //当前天气信息
      forecastWeather: [], //未来7天信息
      nowweatherStatus: "1",
      nowWindDir: "", //风向
      nowWindSc: "", //风力
      nowTmp: "", //温度
      updateTime: "", //更新时间
      highTemp: [],
      lowTemp: [],
      week: [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
        "星期日"
      ]
    };
  },

  /*   components: {
    canvasSwiper
  }, */
  computed: {
    weeks() {
      return function(index) {
        let length = this.week.length; //7
        if (index > length - 1) {
          index = index - length;
        }
        return this.week[index];
      };
    }
  },
  methods: {
    //天气状况图片
    condImg(code) {
      //return require(`@/assets/icons/${code}.png`);
    },
    //温度折线图
    canvas(arr, color, c) {
      let max = this.max;
      //console.log(max);
      /* c.beginPath(); */
      /*       c.moveTo(10,10)
      c.arc(100, 75, 50, 0, 2 * Math.PI)
      c.fill()
      c.draw() */
      //画点
      arr.forEach((item, index) => {
        c.moveTo(
          this.WIDTH * index + this.PADDING, //每天的起始点加上一半的宽度
          (max - item + 2) * this.ONE_HEIGHT //高度取反,加上整个画布的高度,为了低温在下,高温在上
        );
        if (!this.flag) {
          //第一次,文字在上
          c.fillStyle = "#333";
          c.fillText(
            item + "℃",
            this.WIDTH * index + this.PADDING - 6, //-6px是为了文字居中
            //-item * this.ONE_HEIGHT + this.HEIGHT - this.PADDING / 3
            (max - item + 2) * this.ONE_HEIGHT - this.PADDING / 6
          );
        } else {
          //之后文字在下
          c.fillStyle = "#333";
          c.fillText(
            item + "℃",
            this.WIDTH * index + this.PADDING - 6,
            //-item * this.ONE_HEIGHT + this.HEIGHT + this.PADDING / 2 //控制文字在上或者在下
            (max - item + 2) * this.ONE_HEIGHT + this.PADDING / 3
          );
        }
        c.arc(
          this.WIDTH * index + this.PADDING,
          (max - item + 2) * this.ONE_HEIGHT,
          this.RADIUS,
          0,
          2 * Math.PI,
          true
        );
      });
      c.fillStyle = color;

      c.fill();
      //划线
      arr.forEach((item, index) => {
        c.moveTo(
          this.WIDTH * index + this.PADDING,
          (max - item + 2) * this.ONE_HEIGHT
        );
        if (index == arr.length - 1) {
          return false;
        }
        c.lineTo(
          this.WIDTH * (index + 1) + this.PADDING,
          (max - arr[index + 1] + 2) * this.ONE_HEIGHT
        );
      });
      c.strokeStyle = color;
      c.stroke();

      /* if(!this.flag){
        c.draw()
      }
      else{
        c.draw(true)
      } */

      this.flag = true;
    },
    //未来天气
    handleForecastWeather() {
      let length = this.forecastWeather.length;
      for (let i = 0; i < length; i++) {
        this.highTemp.push(this.forecastWeather[i].tmp_max);
        this.lowTemp.push(this.forecastWeather[i].tmp_min);
      }
      this.calwidth(); //计算宽度,画布尺寸
      this.canvas(this.highTemp, "#ff0000", this.c);
      //this.canvas(this.highTemp, "#fcc370", this.c);
      this.canvas(this.lowTemp, "#137bcf", this.c);
      this.c.draw(true);
    },
    //当前天气
    handleNowWeather() {
      if (this.nowweather.length != 0) {
        let nowweather = this.nowweather;
        this.nowweatherStatus = nowweather.now.cond_txt;
        this.nowWindDir = nowweather.now.wind_dir;
        this.nowWindSc = nowweather.now.wind_sc;
        this.nowTmp = nowweather.now.tmp;
        this.updateTime = nowweather.update.loc;
      }
    },
    //未来7天天气
    getForecastWeather(area, city) {
      let url = `forecast?location=${area},${city}`;
      this.$axios.get(url).then(res => {
        this.forecastWeather = res.HeWeather6[0].daily_forecast;
        this.handleForecastWeather();
      });
    },
    //当前天气
    getNowWeather(area, city) {
      let url = `now?location=${area},${city}`;
      this.$axios.get(url).then(res => {
        this.nowweather = res.HeWeather6[0];
        this.handleNowWeather();
      });
    },
    //未来显示的星期
    /* calWeek(index) {
      let length = this.week.length; //7
      if (index > length - 1) {
        index = index - length;
      }
      return this.week[index];
    }, */
    getToday() {
      let now = new Date();
      let year = now.getFullYear();
      let month = this.checkTen(now.getMonth() + 1);
      let date = this.checkTen(now.getDate());
      this.day = now.getDay();
      let day = this.week[now.getDay()];
      this.today = `${year}-${month}-${date} ${day}`;
    },
    checkTen(num) {
      if (num > 10) {
        return num;
      } else {
        return "0" + num;
      }
    },
    //计算宽度
    calwidth() {
      // let clientWidth = document.body.offsetWidth;
      let clientWidth = this.clientWidth;
      //let canvas = document.getElementById("canvas");
      const canvas = wx.createCanvasContext("canvas", this);
      let prop = clientWidth / 750; //比例
      let height = 300 * prop;
      let width = clientWidth / 4; //,每天的宽度
      this.WIDTH = width;
      this.HEIGHT = height; // 2 + 16 / prop; //向下偏移的高度,因为坐标与数学坐标是反的
      this.PADDING = width / 2;
      //canvas.setAttribute("width", width * 7);
      this.canvasWidth = width * 7;
      this.canvasHeight = height;
      //canvas.setAttribute("height", height);
      let max = this.bubble(this.highTemp).max;
      let min = this.bubble(this.lowTemp).min;
      this.max = max;
      this.diff = max - min; //最高和最低温度差
      this.ONE_HEIGHT = height / (this.diff + 4);
      this.c = canvas;
    },
    //冒泡排序
    bubble(arr) {
      let brr = arr.slice(); //数组拷贝.因为数组是引用类型,简单赋值只是一个指针
      let instance;
      for (let i = 0; i < brr.length; i++) {
        for (let j = 0; j < brr.length - i; j++) {
          if (parseInt(brr[j]) > parseInt(brr[j + 1])) {
            instance = brr[j];
            brr[j] = brr[j + 1];
            brr[j + 1] = instance;
          }
        }
      }
      return {
        max: brr[arr.length - 1],
        min: brr[0]
      };
    },
    getUserInfo() {
      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: res => {
              this.userInfo = res.userInfo;
            }
          });
        }
      });
    },
    clickHandle(msg, ev) {
      console.log("clickHandle:", msg, ev);
    },
    //获取设备信息
    getSystemInfo() {
      wx.getSystemInfo({
        success: res => {
          this.clientWidth = res.windowWidth;
        }
      });
    },
    getRegionWeather(){
      /* wx.getCurrentPages({
        success: res =>{
          console.log(res)
        }
      }) */
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      let options = currentPage.options
      if(options.areaName){
        this.area = options.areaName
        this.city = options.cityName
      }else{
        this.area = '宝山'
        this.city = '上海'
      }
      console.log(pages)
      console.log(options)
    }
  },

  created() {
    // 调用应用实例的方法获取全局数据
    this.getUserInfo();
  },
  mounted() {
    this.getSystemInfo();
    this.getToday();
    this.getRegionWeather()
    this.getNowWeather(this.area, this.city);
    this.getForecastWeather(this.area, this.city);
  }
};
</script>

<style lang='scss'>
.banner-swiper {
  width: 750rpx;
  height: 800rpx;
  background: rgba(255, 255, 255, 0.5);
}
.today {
  margin-top: 20rpx;
}

.project_title {
  text-align: center;
  font-size: 36rpx;
  margin: 20rpx 0;
  color: #fff;
  text-transform: uppercase;
}
.tem_canvas {
  //width: 1312.5rpx;
  //height: 200rpx;
  position: absolute;
  //border:1rpx solid #000;
  top: 230rpx;
}
.weather_details {
  color: #333;
  h3,
  h4 {
    font-size: 26rpx;
    font-weight: normal;
    margin-top: 20rpx;
  }
  p {
    font-size: 20rpx;
    margin-top: 20rpx;
  }
  .night_status {
    //margin-top: 350rpx;
  }
  .day_status {
    margin-top: 40rpx;
  }
  .night_status {
    margin-bottom: 40rpx;
  }
  .empty {
    height: 300rpx;
    width: 100%;
    //border:1rpx solid #ff0000
  }
}
.cond_img {
  width: 60rpx;
  height: 60rpx;
  display: block;
  margin: 0 auto;
}
.forecast_title {
  font-size: 40rpx;
  text-align: center;
  margin: 60rpx;
}
.forecast_list {
  display: flex;
  background: rgba(255, 255, 255, 0.5);
  padding: 30rpx 0;
  position: relative;
}
.now_tmp {
  font-size: 60rpx;
  margin: 20rpx 0;
}
.update_time {
  font-size: 12rpx;
  font-weight: normal;
  display: block;
}
.index {
  color: #fff;
}
.local_title {
  text-align: center;
  font-size: 36rpx;
  margin: 40rpx 0;
  color: #fff;
  text-transform: uppercase;
  border-bottom: 1rpx solid;
  display: inline-block;
}
.weather_status {
  font-size: 30rpx;
  span {
    margin: 0 0 0 30rpx;
  }
}
</style>
