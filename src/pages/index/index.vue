<template>
  <div class="index">
    <h1 class="today">{{today}}</h1>
    <router-link to="/region" tag="h2" class="local_title">{{city}}市-{{area}}区</router-link>
    <h3 class="weather_status">
      {{nowweatherStatus}}
      <span>{{nowWindDir}}</span>
      <span>{{nowWindSc}}级</span>
    </h3>
    <h4 class="now_tmp">{{nowTmp}}℃</h4>
  </div>
</template>

<script>
import card from "@/components/card";

export default {
  data() {
    return {
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
      nowweatherStatus: "",
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
        "星期六"
      ],
      swiperOption: {
        slidesPerView: 4
      }
    };
  },

  components: {
    card
  },

  methods: {
    /* bindViewTap () {
      
    }, */
    //未来天气
    handleForecastWeather() {
      let length = this.forecastWeather.length;
      for (let i = 0; i < length; i++) {
        this.highTemp.push(this.forecastWeather[i].tmp_max);
        this.lowTemp.push(this.forecastWeather[i].tmp_min);
      }
      this.calwidth(); //计算宽度,画布尺寸
      this.canvas(this.highTemp, "#fcc370", this.c);
      //this.canvas(this.highTemp, "#fcc370", this.c);
      this.canvas(this.lowTemp, "#137bcf", this.c);
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
        this.forecastWeather = res.data.HeWeather6[0].daily_forecast;
        this.handleForecastWeather();
        console.log(this.forecastWeather);
      });
    },
    //当前天气
    getNowWeather(area, city) {
      let url = `now?location=${area},${city}`;
      this.$axios.get(url).then(res => {
        this.nowweather = res.data.HeWeather6[0];
        console.log(this.nowweather)
        //this.handleNowWeather();
      });
    },
    //未来显示的星期
    calWeek(index) {
      let length = this.week.length; //7
      if (index > length - 1) {
        index = index - length;
      }
      return this.week[index];
    },
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
    }
  },

  created() {
    // 调用应用实例的方法获取全局数据
    this.getUserInfo();
  },
  mounted() {
   /*  this.getToday(); */
    //this.getNowWeather(this.area, this.city);
    /* this.getForecastWeather(this.area, this.city); */
  }
};
</script>

<style lang='scss'>

.today{
  margin-top: 20px;
}

.project_title {
  text-align: center;
  font-size: 36px;
  margin: 20px 0;
  color: #fff;
  text-transform: uppercase;
}
.tem_canvas {
  //width: 1312.5px;
  //height: 200px;
  position: absolute;
  //border:1px solid #000;
  top: 230px;
}
.weather_details {
  color: #333;
  h3,
  h4 {
    font-size: 26px;
    font-weight: normal;
    margin-top: 20px;
  }
  p {
    font-size: 20px;
    margin-top: 20px;
  }
  .night_status {
    //margin-top: 350px;
  }
  .day_status {
    margin-top: 40px;
  }
  .night_status {
    margin-bottom: 40px;
  }
  .empty {
    height: 300px;
    width: 100%;
    //border:1px solid #ff0000
  }
}
.cond_img {
  width: 60px;
  height: 60px;
  display: block;
  margin: 0 auto;
}
.forecast_title {
  font-size: 40px;
  text-align: center;
  margin: 60px;
}
.forecast_list {
  display: flex;
  background: rgba(255, 255, 255, 0.5);
  padding: 30px 0;
  position: relative;
}
.now_tmp {
  font-size: 60px;
  margin: 20px 0;
}
.update_time {
  font-size: 12px;
  font-weight: normal;
  display: block;
}
.index {
  color: #fff;
}
.local_title {
  text-align: center;
  font-size: 36px;
  margin: 40px 0;
  color: #fff;
  text-transform: uppercase;
  border-bottom: 1px solid;
  display: inline-block;
}
.weather_status {
  font-size: 30px;
  span {
    margin: 0 0 0 30px;
  }
}
</style>
