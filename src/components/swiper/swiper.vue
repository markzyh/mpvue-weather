<template>
  <swiper
    :indicator-dots="indicatorDots"
    :autoplay="autoplay"
    :interval="interval"
    :duration="duration"
    class="banner-swiper"
  >
    <block v-for="(item,index) in imgUrls" :key="index">
      <swiper-item>
        <img :src="item" class="slide-image" width="355" height="150">
      </swiper-item>
    </block>
  </swiper>
</template>
<script>
export default {
  props: ["imgUrls"],
  data() {
    return {
      indicatorDots: true,
      autoplay: false,
      interval: 5000,
      duration: 500
    };
  },
  mounted() {}
};
</script>

<style lang="scss">
.banner-swiper {
  width: 750rpx;
  img {
    width: 100%;
  }
}
</style>