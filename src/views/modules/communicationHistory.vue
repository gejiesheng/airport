<template>
  <div v-if="show" class="CommunicationHistory" @mouseup="stopScroll()">
    <div class="labels">
      <div :class="{ label: true, active: activeTag === 0 }" @click="handleClick(0)">
        <img :src="communicationImg" />
        <span>通信中</span>
      </div>
      <div :class="{ label: true, historyCls:true, active: activeTag === 1 }" @click="handleClick(1)">
        <img :src="historyImg" />
        <span>历史通信</span>
      </div>
    </div>
    <div v-if="activeTag === 0" class="contents">
      <ul ref="communicationList" id="container">
        <template v-if="activeTag === 0">
          <li v-for="(item, index) in data" :key="index" :class="{ active1: index === colorIndex }">
            <div class="location" :style="{ color: colors[index] }">{{ item.location }}</div>
            <div class="message">
              <div class="message-list" v-for="(message, index) in item.messages" :key="message.id"
                :class="message.active ? 'redbg' : ''">
                <div class="time">{{ message.time }}</div>
                <div class="content">{{ message.content }}</div>
              </div>
            </div>
          </li>
          <div class="left-btn" @mousedown="startScroll(-1)">
            <img v-if="scroll.Left === 0" src="../../assets/向左1.png">
            <img v-if="scroll.Left === 1" src="../../assets/向左2.png">
          </div>
          <div class="right-btn" @mousedown="startScroll(1)">
            <img v-if="scroll.Right === 0" src="../../assets/向右1.png">
            <img v-if="scroll.Right === 1" src="../../assets/向右2.png">
          </div>
        </template>
      </ul>
    </div>
    <div v-if="activeTag === 1" class="contents">
      <ul style="scrollbar-width: none;">
        <li v-for="(item, index) in historyData" :key="index">
          <div class="location" :style="{ color: colors[index] }">{{ item.flightNo }}</div>
          <div class="message">
            <div class="message-list" v-for="(message, index) in item.communicationLogs" :key="message.id"
            :class="message.active ? 'redbg' : ''">
              <div class="time">{{ message.happenTime }}</div>
              <div class="content">{{ message.message }}</div>
            </div>
          </div>
        </li>
      </ul>
      <Pagination :total="total" v-model:page-size="query.pageSize" v-model="query.pageNum" @turn="turn"/>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import communication from '@/assets/communication.png'
import activeCommunication from '@/assets/active-communication.png'
import history from '@/assets/history.png'
import activeHistory from '@/assets/active-history.png'
import Pagination from '/modules/Pagination'

const props = defineProps({
  show: {
    type: Boolean,
    default: true
  },
  data: {
    type: Array,
    default: []
  },
  colors:{
    type:Array,
    default:() =>[]
  },
  colorIndex:{
    type:Number,
    default:-1
  },
  historyCommunication:{
    type:Array,
    default:() =>[]
  }
})
const query = reactive({
  pageSize: 5,
  pageNum: 1
})
const historyData = ref([])
watch(
  () => props.historyCommunication,
  (newVal) => {
    historyData.value = newVal.slice(0, 5);
  },
  { immediate: true }
);
const total = computed(() => props.historyCommunication.length)
const turn = () => {
  historyData.value = props.historyCommunication.slice(0+query.pageSize*(query.pageNum-1), 5+query.pageSize*(query.pageNum-1))
}

const activeTag = ref(0)
const isScroll = ref(true)
const communicationImg = ref(activeCommunication) 
const historyImg = ref(history) 
const handleClick = (index) => {
  console.log(index)
  activeTag.value = index
  if (activeTag.value){
    communicationImg.value = communication
    historyImg.value = activeHistory
    isScroll.value = false
  }else{
    communicationImg.value = activeCommunication
    historyImg.value = history
    isScroll.value = true
  }
}

const scroll = ref({
  Left: 0,
  Right: 0
})
const communicationList = ref(null)
let scrollInterval = null

const startScroll = (direction) => {
  if (direction === -1) { // 向左
    scroll.value.Left = 1
    scroll.value.Right = 0
  } else { // 向右
    scroll.value.Left = 0
    scroll.value.Right = 1
  }
  scrollInterval = setInterval(() => {
    communicationList.value.scrollLeft += 10 * direction
  }, 10) // 每100毫秒滚动200像素
}

const stopScroll = () => {
  clearInterval(scrollInterval)
  scroll.value.Left = 0
  scroll.value.Right = 0
}
//报警触发
const checkAlarm = (index) =>{
  const message = document.getElementsByClassName('message');
  const messageChildern = message[index]
  messageChildern.scrollIntoView({
    behavior: 'smooth',  // 平滑滚动
    block: 'center',   // 垂直方向上滚动到最近的边缘
  });
}
// 自动随更新消息实现滚动
const automaticScrolling = () =>{
  if(isScroll.value){
    const container = document.getElementById('container');
    const message = document.getElementsByClassName('message');
    const children = container?.children;
    const messageChildern = message[props.colorIndex]
    messageChildern.scrollTo({
      top: messageChildern.scrollHeight,
      behavior: "smooth",
    });
    const targetElement = children[props.colorIndex];
    targetElement.scrollIntoView({
      behavior: 'smooth',  // 平滑滚动
      block: 'nearest',   // 垂直方向上滚动到最近的边缘
      inline: 'center'   // 水平方向上滚动到中心位置
    });
    console.log(children.length, 'children.length', children);
  }
}

defineExpose({
  automaticScrolling,
  checkAlarm
})
</script>
<style lang="scss" scoped>
.CommunicationHistory {
  display: flex;
  width: 100%;
  height: 32%;
  flex-direction: row;
  justify-content: flex-start;
}

.labels {
  display: flex;
  width: 35px;
  flex-direction: column;

  .label {
    display: flex;
    height: 45%;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    padding: 5px 10px;
    color: #082655;
    background-color: rgb(60, 94, 139);
    border-radius: 10px 5px 5px 10px;
    font: bold 20px Arial;
    cursor: pointer;
    img{
      width: 140%;
      height: 17%;
    }
  }
  .historyCls{
    height: 55%;
  }
}

.contents {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: rgb(4, 43, 96);

  ul {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    margin: 5px;
    padding-left: 0;
    overflow-x: scroll;

    li {
      display: flex;
      flex-direction: column;
      flex: 0 0 21%;
      height: 100%;
      background-image: url('../../assets/blueblock.png');
      background-size: 100% 100%;
      margin-right: 5px;
      .location {
        display: flex;
        width: 100%;
        height: 45px;
        justify-content: space-around;
        font: bold 20px Arial;
        font-size: clamp(16px, 1vw,20px);
        margin-top: 5px;
      }

      .message {
        display: flex;
        flex-direction: column;
        width: 100%;
        // margin-top: 10px;
        flex: 1;
        overflow-y: scroll;
          scrollbar-width: none;
        .message-list {
          display: flex;
          width: 98%;
          margin-left: 1%;
          flex-direction: column;
          justify-content: space-around;
          padding: 4% 0px 4% 3.5%;
          font-size: clamp(10px, 0.8vw,13px);
          color: #ffffff;
          
        }
        .redbg{
          background: #FE5E08;
        }
        .message-list:not(:last-child) {
          width: 98%;
          margin-left: 1%;
          border-bottom: #00479D 1px solid;
        }
      }
    }
    // active用过了，所以改成active1
    .active1{
      background-image: url('../../assets/greenblock.png');
      background-size: 100% 100%;
    }
   

    .left-btn {
      position: absolute;
      bottom: 0px;
      cursor: pointer;

      img {
        width: 13px;
        height: 13px;
      }
    }

    .right-btn {
      position: absolute;
      bottom: 0px;
      right: 0.3vw;
      cursor: pointer;

      img {
        width: 13px;
        height: 13px;
      }
    }
  }
}

/* 设置滚动条的宽度 */
ul::-webkit-scrollbar {
  height: 10px;
}

ul::-webkit-scrollbar-button {
  display: flex;
}

/* 设置滚动条轨道的背景 */
ul::-webkit-scrollbar-track {
  background-image: url('../../assets/stationBg.png');
  /* 使用背景图片 */
  background-size: cover;
  /* 确保背景图适应容器 */
  background-position: center;
  /* 背景居中 */
}

/* 设置滚动条滑块的样式 */
ul::-webkit-scrollbar-thumb {
  background-image: url('../../assets/stationFg.png');
  /* 使用滑块图片 */
  background-size: cover;
  /* 确保滑块图像适应 */
  border-radius: 10px;
  /* 滑块圆角 */
  cursor: pointer;
  /* 鼠标悬停时显示指针 */
}

.active {
  border-radius: 10px 0 0 10px !important;
  background-color: rgb(4, 43, 96) !important;
  color: #21BCA4 !important;
  cursor: default !important;
}
</style>