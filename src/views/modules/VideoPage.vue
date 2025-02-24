<template>
  <div class="view" id="_view" v-if="props.show">
    <video v-for="(url, index) in props.urlList" :key="'v' + index" :id="'v' + index" :url="url.url"></video>
  </div>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: true
  },
  info: {
    type: String,
    default: '视频'
  },
  urlList: {
    type: Array,
    default: [
      { url: '', id: 1 },
      { url: '', id: 2 },
      { url: '', id: 3 },
      { url: '', id: 4 }
    ]
  },
  index: {
    type: Number,
    default: 0
  },
});
</script>

<style lang="scss" scoped>
.view {
  display: flex;
  flex-wrap: wrap;
  width: 99%;
  height: 13%;
  gap: 5px; // 设置视频窗口之间的间距
  margin-top: 10px;
}

video {
  border: solid 0.5px #111010;
  background-color: rgb(255, 255, 255);
  width: 24%;
  height: 100%;
}
</style>
