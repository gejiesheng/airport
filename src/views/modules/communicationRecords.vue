<template>
  <div class="container" v-if="show">
    <div class="title1">
      <h1>通信记录</h1>
      <div class="form">
        <input type="radio" id="all" value="all" v-model="selectedOption" name="communicationType"
          @change="change(0)" />
        <label for="all">全部</label>
        <input type="radio" id="aircraft" value="aircraft" v-model="selectedOption" name="communicationType"
          @change="change(1)" />
        <label for="aircraft">机组</label>
        <input type="radio" id="field" value="field" v-model="selectedOption" name="communicationType"
          @change="change(3)" />
        <label for="field">塔台</label>
      </div>
    </div>
    <div class="content">
      <ul id="scoll-content">
        <template v-for="item in data" :key="item.id">
          <li v-if="selectItem.includes(item.falg)">
            <div class="location0" v-if="item.status === 0  ">
              <p :class="`location${item.role}`">{{ deelRole(item.role) }}</p>
              <p class="massage"><span :style="`color: ${colors[item.cindex]};`">{{ item.firstPart }}</span><span
                  v-if="item.firstPart">，</span>{{ item.secondPart }}</p>
            </div>
            <div v-else class="time">
              {{ item.time }}
            </div>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const props = defineProps({
  show: {
    type: Boolean,
    default: true
  },
  data: {
    type: Array,
    default: []
  },
  colors: {
    type: Array,
    default: () => []
  },
  colorIndex: {
    type: Number,
    default: -1
  }
})
const selectedOption = ref('all')
const selectItem = ref([1,2,3])
const change = (e) =>{
  if(e === 0){
    selectItem.value = [1,2,3]
  }else{
    selectItem.value = [e]
    
  }
}
const deelRole = computed(() =>{
  return (num) =>{
    if(num === 1){
      return '机组'
    }else if( num === 2){
      return '场务'
    } else if (num === 3) {
      return '塔台'
    }
  }
})
const sommothScoll =() =>{
  const container = document.getElementById("scoll-content");
  container.scrollTo({
    top: container.scrollHeight,
    behavior: "smooth",
  });
  console.log('eeee', container, container.scrollHeight);
  
}
defineExpose({
  sommothScoll
})
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 86%;
  padding-left: 10px;
  padding-top: 10px;
}

.container .title1 {
  display: flex;
  width: 100%;
  height: 5%;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  background-color: rgb(5, 56, 122);

  /* border: rgb(9, 31, 143) solid 1px; */
  h1 {
    font-size: clamp(10px, 1.9vw,24px);
    font-weight: bold;
    width: 40%;
    color: rgb(84, 187, 231);
    padding-left: 2%;
  }

  .form {
    display: flex;
    width: 60%;
    height: 100%;
    align-items: center;
    justify-content: center;
    background: linear-gradient(to right, rgb(21, 117, 177), rgb(4, 57, 125));

    input[type="radio"] {
      margin: 8% 1% 8% 8%;
      cursor: pointer;
      appearance: none;
      /* 去除默认样式 */
      width: 0.85vw;
      height: 0.85vw;
      border: 2px solid white;
      /* 设置边框颜色 */
      border-radius: 50%;
      background-color: rgb(21, 117, 177);
      /* 设置背景颜色 */
      position: relative;
      /* 确保伪元素可以相对于单选按钮定位 */
    }

    input[type="radio"]:checked::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 6px;
      /* 点的大小 */
      height: 6px;
      background-color: white;
      /* 点的颜色 */
      border-radius: 50%;
      transform: translate(-50%, -50%);
      /* 将点居中 */
    }

    label {
      font-size: clamp(10px, 0.85vw,16px);
      color: white;
      margin-bottom: 3px;
      cursor: pointer;
    }
  }
}

.container .content {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 90%;

  /* border: 1px solid rgb(9, 31, 143);
  border-radius: 5px; */
  ul {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding-left: 0;
    margin-top: 0;
    margin-bottom: 0;
    overflow: scroll;
    scrollbar-width: none;

    /* 隐藏Firefox中的滚动条 */
    li {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      height: 10%;
      border: 1px solid rgb(9, 31, 143);
      border-radius: 5px;
      margin-bottom: 5px;

      .location0 {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100%;
        font-size: clamp(10px, 0.8vw,13px);
        background-color: rgb(6, 44, 94);
        color: rgb(255, 255, 255);

        .location1 {
          display: flex;
          width: 20px;
          height: 100%;
          text-align: center;
          align-items: center;
          margin: 0;
          background-color: rgb(21, 117, 177);

        }

        .location2 {
          display: flex;
          width: 20px;
          height: 100%;
          text-align: center;
          align-items: center;
          margin: 0;
          
          background-color: #00959d;
            color: #fff;
        }
        .location3 {
          display: flex;
          width: 20px;
          height: 100%;
          text-align: center;
          align-items: center;
          margin: 0;
          background-color: yellow;
            color: black;
        }
        .massage {
          display: flex;
          width: 90%;
          padding-left: 15px;
          font-size: clamp(12px, 0.85vw,16px);
          color: rgb(255, 255, 255);
        }
      }

      .time {
        display: flex;
        width: 100%;
        height: 40px;
        padding-left: 25%;
        text-align: center;
        align-items: center;
        font-size: clamp(12px, 0.85vw,16px);
        color: rgb(255, 255, 255);
        background-color: rgb(9, 66, 145);
      }
    }
  }
}
</style>
