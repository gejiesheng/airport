<template>
  <div class="all">
    <div class="left">
      <div class="title">
        <h1>防跑道侵入系统</h1>
        <p>{{ currentTime }}</p>
      </div>
      <communicationRecords ref="Records" :show="communicationRecordShow" :data="data" :colors="colors"
        :colorIndex="colorIndex"></communicationRecords>
    </div>
    <div class="right">
      <div class="buttom">
        <label>灯光</label>
        <Switch :disabled="isDisabled" active-value="1" inactive-value="0" v-model="runwayStatus.runwayLightStatus"
          @change="updateStatus(runwayStatus.runwayLightStatus, 4)"
          style="--theme-color:#fdfaad; --inactive-color:#1c73b4; --active-text: '点亮';--active-text-color:black;--slider-active-color:orange; --inactive-text: '关闭';" />
        <label>跑道状态</label>
        <Switch :disabled="isDisabled" active-value="1" inactive-value="0" v-model="runwayStatus.airportRunwayStatus"
          @change="updateStatus(runwayStatus.airportRunwayStatus, 1)"
          style="--theme-color:#cb9624; --inactive-color:#1c73b4; --active-text: '占用';--slider-active-color:white;  --inactive-text: '空闲';" />
        <label>联络道H</label>
        <Switch :disabled="isDisabled" active-value="1" inactive-value="0" v-model="runwayStatus.taxiwayHStatus"
          @change="updateStatus(runwayStatus.taxiwayHStatus, 2)"
          style="--theme-color:#cb9624; --inactive-color:#1c73b4; --active-text: '占用';--slider-active-color:white; --inactive-text: '空闲';" />
        <label>联络道F</label>
        <Switch :disabled="isDisabled" active-value="1" inactive-value="0" v-model="runwayStatus.taxiwayFStatus"
          @change="updateStatus(runwayStatus.taxiwayFStatus, 3)"
          style="--theme-color:#cb9624; --inactive-color:#1c73b4; --active-text: '占用';--slider-active-color:white; --inactive-text: '空闲';" />
        <span class="tag">占用判断</span>
        <div @click="updateStatus('0', 5)" :class="{ identify: true, active: runwayStatus.isOccupyJudge === '0' }">系统识别
        </div>
        <div @click="updateStatus('1', 5)" :class="{ identify: true, active: runwayStatus.isOccupyJudge === '1' }">人为控制
        </div>
        <el-dropdown trigger="click">
          <span class="el-dropdown-link" aria-expanded="false">
            <img src="../assets/setOption.png" alt="" />
            <el-icon class="el-icon--right">
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-button @click="importFlight()">航班号导入</el-button>
              <el-dialog v-model="dialogFormVisible" title="航班号导入" width="500" center>
                <el-form :model="form" style="margin-right: 50px;">
                  <el-form-item label="航班号" :label-width="formLabelWidth">
                    <el-input v-model="form.flightNo" autocomplete="off" />
                  </el-form-item>
                  <el-form-item label="发生时间" :label-width="formLabelWidth">
                    <el-date-picker v-model="form.happenTime" type="datetime" placeholder="选择日期时间"
                      style="width: 100%;" />
                  </el-form-item>
                  <el-form-item label="指令" :label-width="formLabelWidth">
                    <el-input v-model="form.instruction" autocomplete="off" />
                  </el-form-item>
                  <el-form-item label="通讯角色" :label-width="formLabelWidth">
                    <select v-model="form.role" placeholder="请选择"
                      style="width: 100%;height: 30px;border: 1px solid #dcdfe6;border-radius: 4px;">
                      <option label="航空器" value="1" />
                      <option label="场务" value="2" />
                      <option label="塔台管制员" value="3" />
                    </select>
                  </el-form-item>
                </el-form>
                <template #footer>
                  <div class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="dialogFormVisible = false">
                      提交
                    </el-button>
                  </div>
                </template>
              </el-dialog>
              <el-button v-if="!videoShow" @click="changevideoShow()">监控视频显示</el-button>
              <el-button v-if="videoShow" @click="changevideoShow()">监控视频隐藏</el-button>
              <el-button v-if="communicationRecordShow" @click="changecommunicationRecordShow()">通信记录隐藏</el-button>
              <el-button v-if="!communicationRecordShow" @click="changecommunicationRecordShow()">通信记录显示</el-button>
              <el-button @click="systemLog()">系统日志</el-button>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <VideoPage :show="videoShow" :urlList="videoList"></VideoPage>
      <div :class={mapLarger:mapLarger,videoLarger:videoLarger,playGround:true}>
        <img class="map" src="../assets/map.png">
        <div class="light">
          <img v-if="runwayStatus.runwayLightStatus === '1'" src="../assets/lightOpen.png">
          <img v-if="runwayStatus.runwayLightStatus === '0'" src="../assets/lightClose.png">
        </div>
        <div class="runRoad">
          <img v-if="runwayStatus.airportRunwayStatus === '0'" src="../assets/runrodeFree.png">
          <img v-if="runwayStatus.airportRunwayStatus === '1'" src="../assets/runrodeSet.png">
        </div>
        <div class="roadH">
          <img v-if="runwayStatus.taxiwayHStatus === '1'" src="../assets/rodehFree.png">
          <img v-if="runwayStatus.taxiwayHStatus === '0'" src="../assets/rodehSet.png">
        </div>
        <div class="roadF">
          <img v-if="runwayStatus.taxiwayFStatus === '0'" src="../assets/rodefFree.png">
          <img v-if="runwayStatus.taxiwayFStatus === '1'" src="../assets/rodefSet.png">
        </div>
        <div class="car">
          <img src="@/assets/car.png" />
        </div>
        <div class="person">
          <img src="@/assets/person.png" />
        </div>
        <div class="hardstand">
          <img src="@/assets/vertical-air.png" />
          <span class="air-type">蔚蓝2521</span>
        </div>
        <div class="hardstand Wait-area">
          <img src="@/assets/vertical-air.png" />
          <span class="air-type">南方6466</span>
        </div>
        <div class="hardstand track">
          <img src="@/assets/horizontal-air.png" />
          <span class="air-type">9413</span>
        </div>
      </div>

      <communicationHistory :show="communicationRecordShow" :data="historyData"
        :historyCommunication="historyCommunication" :colors="colors" :colorIndex="colorIndex" ref="historyRef">
      </communicationHistory>
    </div>
    <div class="alarmImg">
      <img src="@/assets/alarm.png" class="blink-image" />
    </div>
    <div v-if="alarmFalg"  :class="{ alarmText: true, bottomalarmText: videoLarger }">
      <div class="title">
        <img src="@/assets/alarm-light.png" />
        <span>{{ deelAlarmType(alarmData.alarmType) }}</span>
      </div>
      <div class="alarm-tip">{{ alarmData.message }}</div>
      <div class="alarm-time">{{ dayjs(alarmData.happenTime).format('YYYY-MM-DD HH:mm:ss') }}</div>
      <div class="aralm-comfire" @click="alarmComfire">报警确认</div>
    </div>
  </div>

</template>

<script setup>
import { ref, shallowRef, onMounted, nextTick, onBeforeUnmount } from 'vue'
import dayjs from 'dayjs'
import VideoPage from './modules/VideoPage.vue'
import communicationRecords from './modules/communicationRecords.vue'
import communicationHistory from './modules/communicationHistory.vue'
// import topPop from '@/assets/top-pop.png'
// import bottomPop from '@/assets/bottom-pop.png'
import { ElMessage, ElNotification } from 'element-plus'
import { getlistHistory, receiveCommunication, getrunwayStatus, getvideoUrl, updaterunwayStatus, importcreateTable } from '../api/tool/gen'
import { Bottom } from '@element-plus/icons-vue'
import { computed } from 'vue'

const videoList = ref([
  { url: "", id: 1 },
  { url: "", id: 2 },
  { url: "", id: 3 },
  { url: "", id: 4 },
])
//定义一个定时器，默认60s之内没有收到websocket的文本信息就要增加一个时间标识
const timeMark = ref(null)
// 设置一个标识，来标识需要增加一个时间项
const status = ref(0)
const alarmFalg = ref(false) //报警标识
const alarmData = ref({}) //报警数据
const currentTime = ref('') // 定义一个 ref 来存储当前时间
const dialogFormVisible = ref(false) //存储弹窗状态
const formLabelWidth = '140px'
const Records = ref(null)
const historyRef = ref(null)
const form = reactive({
  flightNo: '', // 航班号
  happenTime: '', // 发生时间
  id: '', // id
  instruction: '', // 指令
  isEnd: 0, // 是否结束 0 未结束 1 结束
  location: '', // 位置
  message: '', // 通信内容
  role: 0 //	通信角色:1-航空器;2-场务;3-塔台管制员;
})
const communicationRecordShow = ref(true) //存储通信记录显示状态
const videoShow = ref(true) //存储视频显示状态
const mapLarger = ref(false) //存储地图放大
const videoLarger = ref(false)
const changecommunicationRecordShow = () => {
  communicationRecordShow.value = !communicationRecordShow.value
  //在这里修改地图尺寸
  mapLarger.value = !mapLarger.value
}
const changevideoShow = () => {
  videoShow.value = !videoShow.value
  videoLarger.value = !videoLarger.value
}
console.log(dayjs(1739504030000).format('YYYY-MM-DD HH:mm:ss'),'dayjs().format()')
//左边通信记录的数据
const data = ref([]) 
//处理下边通信中和通信历史的数据
const historyData = ref([]) // 定义一个 shallowRef 来存储通信历史数据
const historyCommunication = ref([])
//航空器颜色
const colors = ['	#FFFFCC', '#FFCCFF', '#00FF00', '#FFFF00', '#00FFFF', '#FFA500', '#FFC0CB', '#ADD8E6', '#CCFFCC', '#FFCCFF']
const colorIndex = ref(0) //航空器颜色选取小标
const listHistoryData = shallowRef([]),
  runwayStatus = shallowRef({
    airportRunwayStatus: '0',	// 机场跑道状态:0-空闲;1-占用;	string	
    isOccupyJudge: '0',	// 是否开启占用判断:0-否;1-是;	string	
    runwayLightStatus: '0',	// 跑道灯光状态:0-关闭;1-开启;	string	
    taxiwayFStatus: '0',	// 联络道F状态:0-空闲;1-占用;	string	
    taxiwayHStatus: '0',	// 联络道H状态:0-空闲;1-占用;	string
  }),
  videoUrl = shallowRef([])
function updateTime() {
  const now = new Date().toLocaleString('zh-CN').split('/') // 获取当前时间
  currentTime.value = `${now[0]}年${now[1]}月${now[2].split(' ')[0]}日 ${now[2].split(' ')[1]}` // 更新 ref
}
const isDisabled = ref(false)
const img = ref(null)
const importFlight = () => {
  dialogFormVisible.value = true
}
const deelAlarmType = computed(() =>{
  return (data) =>{
    if(data === 1){
      return '指令冲突报警'
    }else if (data === 2){
      return '拌线检测报警'
    }
  }
})
const updateStatus = (async (Status, Type) => {
  let message = '';
  switch (Type) {
    case 1:
      message = Status === '0' ? '机场跑道空闲' : '机场跑道占用';
      break;
    case 2:
      message = Status === '0' ? '联络道H空闲' : '联络道H占用';
      break;
    case 3:
      message = Status === '0' ? '联络道F空闲' : '联络道F占用';
      break;
    case 4:
      message = Status === '0' ? '跑道灯光关闭' : '跑道灯光开启';
      break;
    case 5:
      runwayStatus.value.isOccupyJudge = Status;
      isDisabled.value = Status === '0';
      message = Status === '0' ? '切换系统识别成功，控制按钮禁用' : '切换人为控制成功，控制按钮启用';
      break;
  }
  const data = {
    status: Status,
    type: Type
  }
  await updaterunwayStatus(data)
    .then(() => {
      ElMessage({
        message: message,
        type: 'info',
        duration: 1000,
        offset: 260,
      })
    })
})

//显示时间
onMounted(() => {
  updateTime()
  initWebSocket() //启动websocket链接
  setInterval(() => {
    updateTime()
  }, 1000)
  Records.value.sommothScoll()
   img.value = document.querySelector('.blink-image')
})
onBeforeUnmount(() => {
  closeWebSocket()
})
Promise.all([
  getlistHistory(''),
  getrunwayStatus(),
  getvideoUrl(),
]).then((res) => {
  // console.log(res)
  historyCommunication.value = res[0].data
  runwayStatus.value = res[1].data
  if (runwayStatus.value.isOccupyJudge === '0') {
    isDisabled.value = true
  }
  videoUrl.value = [res[2].data]
  videoList.value.forEach((item, index) => {
    if (videoUrl.value.length > index) {
      item.url = videoUrl.value[index]
    }
  })
})
//报警确认
const alarmComfire = () =>{
alarmFalg.value = false
  img.value.classList.remove('blink-effect')
}
// websocket部分代码 因为目前只有一个页面就不对websocket进行封装
const ws = ref(null) // websocket的对象
const reconnectAttempts = ref(0) // 重连次数
const maxReconnectAttempts = ref(5) // 最大重连次数
const heartbeatInterval = ref(null) // 心跳定时器
const heartbeatTimeout = ref(null) // 应答超时检测
const heartbeatIntervalTime = ref(30000) // 30秒发送一次
const serverTimeout = ref(10000) // 10秒未响应认为断开
const lockReconnect = ref(true)  //标记是否主动关闭
//初始化websocket
const initWebSocket = () => {
  const wsUrl = 'ws://192.168.1.59:9120/websocket/WEB/1' // 连接地址
  ws.value = new WebSocket(wsUrl)
  //连接成功触发onopen函数
  ws.value.onopen = () => {
    console.log('WebSocket连接成功')
    reconnectAttempts.value = 0 // 重置重连计数器
    startHeartbeat() // 连接成功后启动心跳
  }
  //收到服务器发来的数据触发onmessage 参数event为服务器发来的数据
  ws.value.onmessage = (event) => {
    handleMessage(event.data) //处理服务器发来的数据
  }
  //websocket通信发生错误的会触发onerror函数
  ws.value.onerror = (error) => {
    console.error('WebSocket error:', error)
  }
  //websocket通信关闭时会触发onclose  该关闭包扣主动关闭和被动关闭
  ws.value.onclose = (e) => {
    console.log('WebSocket closed:', e)
    //非主动关闭就触发重连机制
    if (lockReconnect.value) {
      console.log(lockReconnect.value);
      handleReconnect() //触发重连 主动关闭不触发重连机制

    }
  }
}
const startHeartbeat = () => {
  stopHeartbeat()
  // 定时发送心跳
  heartbeatInterval.value = setInterval(() => {
    if (ws.value?.readyState === WebSocket.OPEN) {
      sendMessage({ type: 'heartbeat', timestamp: Date.now() })

      // 启动超时检测
      heartbeatTimeout.value = setTimeout(() => {
        console.warn('心跳超时，主动断开连接')
        ws.value.close() // 触发重连机制
      }, serverTimeout.value)
    }
  }, heartbeatIntervalTime.value)
}

const stopHeartbeat = () => {
  clearInterval(heartbeatInterval.value)
  clearTimeout(heartbeatTimeout.value)
}
const handleMessage = (message) => {
  try {
    const msg = JSON.parse(message)
      // type的值取 1（报警信息推送） 2（通话信息推送） 3（灯光状态推送） 4（跑道状态推送） 99（心跳信息推送） 
    if (msg.type === 1) {
      const data = msg.data
      alarmData.value = msg.data
      console.log('报警信息推送');
      historyData.value.forEach((item,index) =>{
        item.messages.forEach((item1,index1) =>{
          if (item1.id === data.logId){
            item1.active = true
            item1.index = index1
            colorIndex.value = index
            historyRef.value.checkAlarm(index1)
            historyRef.value.automaticScrolling()
            deelalarm()
            alarmFalg.value = true
          }
        })
      })
   

    } else if (msg.type === 2) {
    // 处理通话信息
      console.log(msg, 'msgmsgmsg');
      clearTimeout(timeMark.value)
      const communicationItem = msg.data
      if (!communicationItem.role || communicationItem.role ===2 ){
        return 
      }
      deelmessage(communicationItem)
      if (status.value ===1){
        data.value.push({
          id: dayjs().valueOf(),
          time:dayjs().format('YYYY-MM-DD HH:mm:ss'),
          status: 1
        })
        status.value = 0
      }
      communicationItem.status = status.value
      data.value.push(communicationItem)
      console.log(data, 'communicationItem');
      if (communicationItem.flightNo){
        deelHistory(communicationItem)
      }
      timeMark.value = setTimeout(() =>{
        //60s之后还没有收到通话信息那就需要加上一个时间标识
        status.value = 1
      },60000)
      nextTick(() => {
        Records.value.sommothScoll()
        historyRef.value.automaticScrolling()
      })
    } else if (msg.type === 3) {
      console.log('灯光状态推送');
    } else if (msg.type === 4) {
      console.log('跑道状态推送');
    } else if (msg.type === 99) {
      //心跳信息可以忽略掉
      console.log('心跳信息');
      clearTimeout(heartbeatTimeout.value)
      return
    }
  } catch (error) {
    console.error('消息解析失败:', error)
  }
}
//处理发送给服务器的消息
const sendMessage = (data) => {
  console.log(data, 'datadatadatadatadata');
  if (ws.value?.readyState === WebSocket.OPEN) {
    ws.value.send(JSON.stringify(data))
  }
}
// 重连websocket
const handleReconnect = () => {
  console.log('进入重连');
  stopHeartbeat()
  if (reconnectAttempts.value < maxReconnectAttempts.value) {
    const delay = Math.min(5000 * (reconnectAttempts.value + 1), 30000) // 指数退避
    setTimeout(() => {
      console.log(`尝试第 ${reconnectAttempts.value + 1} 次重连`)
      reconnectAttempts.value++
      initWebSocket()
    }, delay)
  } else {
    console.error('达到最大重连次数，放弃连接')
  }
}

//主动关闭时触发 关掉心跳机制的定时器和断开连接
const closeWebSocket = () => {
  if (ws.value) {
    stopHeartbeat() // 关闭前停止心跳
    ws.value.close()
    ws.value = null
    lockReconnect.value = false
  }
}
const deelmessage = (data) =>{
  if (data.role ===1){
    data.falg = 1
  }else if(data.role ===2){
    data.falg = 2
  }else if (data.role ===3){
    data.falg = 3
  }
let index = data.message.indexOf(',')
if(index != -1){
  data.firstPart = data.message.slice(0,index)
}
  data.secondPart = data.message.slice(index+1)
}
// 处理历史通话的信息
const deelHistory = (data) =>{
  let falg = false
historyData.value.forEach((item,index) =>{
  if (item.location == data.flightNo){
    const obj = {
      time: dayjs(data.happenTime).format('YYYY-MM-DD HH:mm:ss'),
      content: data.message,
      id:data.id
    }
    item.newTime = data.happenTime
    item.messages?.push(obj)
    falg = true
    colorIndex.value = index
  }
})

//没有找到 说明是一个新的航空器 首先需要判断目前数组是否大于10个 如果大于是个
  if (!falg){
    if(historyData.value.length>9){
      for(let i = 1;i<10;i++){
        if (historyData.value[i].newTime * 1 < historyData.value[colorIndex.value].newTime*1){
          colorIndex.value = i
        }
      }
    
    }else{
      //小于10
      colorIndex.value = historyData.value.length
      console.log(historyData.value.length,'historyData.value.lengthhistoryData.value.length');
      
    }
    historyData.value[colorIndex.value] = {
      location: data.flightNo,
      newTime: data.happenTime,
      messages: [{
        time: dayjs(data.happenTime).format('YYYY-MM-DD HH:mm:ss'),
        content: data.message,
        id:data.id
      }]
    }
  }
  data.cindex = colorIndex.value
  console.log(historyData,'historyDatahistoryDatahistoryData');
}
//处理报警
const deelalarm = () =>{
  
  img.value.classList.add('blink-effect')
  img.value.addEventListener('animationend',()=>{
    img.value.classList.remove('blink-effect')
    console.log('sfdsfsdf');
    
  })
}
// 页面收起或者切换时触发   看需求要不要 
// document.addEventListener('visibilitychange', () => {
//   if (document.visibilityState === 'visible') {
//     initWebSocket()
//   } else {
//     closeWebSocket()
//   }
// })
</script>
<style lang="scss" scoped>
.all {
  display: flex;
  flex-direction: row;
  height: 100vh;
  margin: 0;
  background-image: url('../assets/background.png');
  background-size: 100% 110%;
  overflow: hidden;
}

.all .left {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 22%;

  .title {
    width: 80%;
    color: rgb(226, 223, 223);
    font: optional;
    font-size: 1.1vw;
    margin: 5px 0 0 0px;
    text-align: center;
    border-top: 0.5px solid #6b5ead;

    h1 {
      margin-bottom: 0;
    }

    p {
      width: 10vw;
      font-size: 0.85vw;
      margin-top: 0;
      margin-left: 20px;
    }
  }
}

.all .right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  height: 100%;
  width: 78%;
  margin-left: 1%;

  .buttom {
    display: flex;
    width: 90%;
    height: 5%;
    align-items: center;
    justify-content: flex-end;
    margin-right: 2%;
    background-color: transparent;

    label {
      display: flex;
      height: 20px;
      align-items: center;
      margin: 5px;
      font-size: clamp(10px, 0.85vw, 16px);
      color: white;
    }

    label:first-of-type::after {
      content: url('../assets/borderLine.png');
      position: relative;
      left: 250%;
      top: 20%;
    }

    .switch {
      display: inline-block;
      width: 0px;
      height: 5px;
      margin-right: 7%;
      margin-bottom: 1.8%;
      background-color: #fff;
      border-radius: 10px;
      align-self: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .tag {
      font-size: clamp(12px, 0.85vw, 16px);
      color: white;
      margin-right: 30px;
      position: relative;
    }

    .tag::after {
      content: url('../assets/toRight.png');
      position: absolute;
      right: -10%;
      top: 35%;
      transform: translateY(-40%) translateX(120%);
    }

    .tag::before {
      content: url('../assets/borderLine.png');
      position: absolute;
      left: -30%;
      top: 50%;
      transform: translateY(-40%);
    }

    .identify {
      display: flex;
      margin-right: 10px;
      align-items: center;
      justify-content: center;
      font-size: clamp(12px, 0.85vw, 16px);
      color: rgb(195, 193, 193);
      background-color: transparent;
      background-image: none;
      width: 89px;
      height: 23px;
      border: rgb(15, 90, 153) 1px solid;
      cursor: pointer;
    }

    img {
      margin-left: 20px;
      cursor: pointer;
    }
  }

  .playGround {
    display: flex;
    width: 100%;
    height: 70%;
    justify-content: center;
    position: relative;

    .map {
      position: absolute;
      z-index: 1;
      width: 100%;
      height: 100%;
    }

    .light img {
      position: absolute;
      z-index: 2;
      top: 14%;
      left: 9%;
      width: 82%;
      height: 9%;
    }

    .runRoad img {
      position: absolute;
      z-index: 2;
      top: 16%;
      left: 8.8%;
      width: 82.3%;
      height: 6%;
    }

    .roadH img {
      position: absolute;
      z-index: 2;
      top: 22%;
      left: 29.1%;
      width: 3.5%;
      height: 12%;
    }

    .roadF img {
      position: absolute;
      z-index: 2;
      top: 22%;
      left: 49.5%;
      width: 3.5%;
      height: 27%;
    }

    .car {
      position: absolute;
      z-index: 2;
      top: 25%;
      left: 15%;
      width: 4vh;
      height: 4vh;

      img {
        width: 100%;
        height: 100%;
      }

    }

    .person {
      position: absolute;
      z-index: 2;
      top: 25%;
      left: 20%;
      width: 4vh;
      height: 4vh;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .hardstand {
      position: absolute;
      z-index: 2;
      top: 53%;
      left: 44%;
      display: flex;
      flex-direction: column;
      align-items: center;

      img {
        width: 3.5vh;
        height: 3.5vh;
        margin-bottom: 2px;
      }
    }

    .Wait-area {
      top: 34%;
      left: 49.8%;

      span {
        background-color: #89DC6D;
      }
    }

    .track {
      top: 15%;
      left: 83%;
      span {
        background-color: #ABA22C;
        margin-top: 5px;
        font-size: 1.5vh;
      }
    }

    .air-type {
      font-size: 1.3vh;
      padding: 0px 2px;
      background-color: #6DBEDC;
      color: #091F49;
      border-radius: 3px;
    }
  }


  .videoLarger {
    .hardstand {
      top: 55.5%;
    }

    .Wait-area {
      top: 34%;
    }

    .track {
      top: 15.5%;
    }
  }
        .mapLarger {
          width: 130% !important;
          height: 90% !important;
    
          .hardstand {
            top: 57%;
            left: 44%;
    
            img {
              width: 4vh;
              height: 4vh;
            }
          }
    
          .Wait-area {
            top: 34%;
            left: 50.2%;
          }
    
          .track {
            top: 16%;
            left: 83%;
            span {
                margin-top: 7px;
                font-size: 1.6vh;
              }
          }
        }
}
.alarmImg{
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  z-index: 2;
  .blink-image{
   display: none;
  }
  .blink-effect{
  display: block;
    animation: blink 3s linear 2 forwards;
  }
}
.alarmText{
  position: fixed;
  top: 12vh;
  right: 5.5vw;
  height: 14vh;
  width: 12vw;
  background: url('@/assets/top-pop.png')  no-repeat ;
  background-size:contain;
  z-index: 3;
  padding: 10px 20px;
  font-size: clamp(10px, 0.8vw, 13px);
  .title{
    display: flex;
    align-items: center;
    
    img{
      width: 28px;
      height: 30px;
    }
    span{
      font-weight: bold;
        color: #FE5E08;
        margin-top: 5px;
        
    }
  }
  .alarm-tip{
    margin-top: 10px;
    color: #0836FE;
  }
  .alarm-time{
    margin-top: 10px;
    color: #FE5E08;
  }
  .aralm-comfire{
    position: absolute;
    top: 6px;
    right: 1vw;
    background-color:#FE7759 ;
    padding: 3px 8px;
    color: #fff;
    font-weight: bold;
      border-radius: 20px;
      cursor: pointer;
  }
}
.bottomalarmText{
  top: 20vh;
    right: 6.5vw;
  background: url('@/assets/bottom-pop.png') no-repeat;
  background-size: contain;
  padding-top: 20px;
  .aralm-comfire{
top: 2vh;
  right: 1vw;
  }
  
}
@keyframes blink{
  0% {
    opacity: 0;
  }
  25%{
    opacity: 1;
  }
  50%{
   opacity: 0;
  }
  75%{
opacity: 1;
  }
  100%{
opacity: 0;
  }
}
.identify.active {
  width: 91px !important;
  height: 25px !important;
  color: #ffffff !important;
  background-image: url('../assets/selectedBg.png') !important;
  cursor: default !important;
}

/* 禁用状态下的样式 */
.disabled {
  --theme-color: #cfd8dc !important;
  /* 背景颜色 */
  --inactive-color: #b0bec5 !important;
  /* 关闭颜色 */
  --active-text-color: #78909c !important;
  /* 文字颜色 */
  --slider-active-color: #546e7a !important;
  /* 滑块颜色 */
  --inactive-text-color: #607d8b !important;
  /* 文字颜色 */
}

.el-dropdown-menu>.el-button {
  display: flex;
  width: 100%;
  border: none;
  justify-content: flex-start;
  padding: 0;
  margin: 0 20px 0 10px;
}
</style>