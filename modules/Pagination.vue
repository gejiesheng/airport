<template>
  <div class="pagination" v-if="modelValue > 0">
    <template v-if="last > 0">
      <span class="arrow" @click="turn(last)">
        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M609.408 149.376 277.76 489.6a32 32 0 0 0 0 44.672l331.648 340.352a29.12 29.12 0 0 0 41.728 0 30.592 30.592 0 0 0 0-42.752L339.264 511.936l311.872-319.872a30.592 30.592 0 0 0 0-42.688 29.12 29.12 0 0 0-41.728 0z"></path>
        </svg>
      </span>
      <template v-if="offset > 0">
        <template v-if="leftGap > 0">
          <span class="number" @click="turn(1)">1</span>
          <span v-if="leftGap > 1" class="ellipsis" @click="turn(modelValue > pagerCount ? modelValue - pagerCount : 1)"></span>
          <span class="number" v-for="i in offset" :key="i" @click="turn(leftGap + i)">{{ leftGap + i }}</span>
        </template>
        <template v-else>
          <span class="number" v-for="p in last" :key="p" @click="turn(p)">{{ p }}</span>
        </template>
      </template>
    </template>
    <span class="number current">{{ modelValue }}</span>
    <template v-if="modelValue < pageAmount">
      <template v-if="offset > 0">
        <template v-if="modelValue + offset < pageAmount">
          <span class="number" v-for="i in offset" :key="i" @click="turn(modelValue + i)">{{ modelValue + i }}</span>
          <span v-if="modelValue + offset + 1 < pageAmount" class="ellipsis" @click="turn(modelValue + pagerCount < pageAmount ? modelValue + pagerCount : pageAmount)"></span>
          <span class="number" @click="turn(pageAmount)">{{ pageAmount }}</span>
        </template>
        <template v-else>
          <span class="number" v-for="i in pageAmount - modelValue" :key="i" @click="turn(modelValue + i)">{{ modelValue + i }}</span>
        </template>
      </template>
      <span class="arrow" @click="turn(modelValue + 1)">
        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M340.864 149.312a30.592 30.592 0 0 0 0 42.752L652.736 512 340.864 831.872a30.592 30.592 0 0 0 0 42.752 29.12 29.12 0 0 0 41.728 0L714.24 534.336a32 32 0 0 0 0-44.672L382.592 149.376a29.12 29.12 0 0 0-41.728 0z"></path>
        </svg>
      </span>
    </template>
    <span v-if="pageAmount"><slot name="total" v-bind="{ pageAmount }">今日累计通信{{ total + '个航班' }}</slot></span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  total: Number,    // 总数
  modelValue: Number,  // 当前页数
  offset: { type: Number, default: 2 }, // 中间数字偏移量
  pageSize: { type: Number, default: 1 }, // 每页显示数量
})

const pageAmount = computed(() => Math.ceil(props.total / props.pageSize))
const pagerCount = computed(() => props.offset * 2 + 1)

const last = computed(() => props.modelValue - 1)
const leftGap = computed(() => last.value - props.offset)

const emit = defineEmits(['update:modelValue', 'turn'])

const turn = (val) => {
  emit('update:modelValue', val)
  emit('turn', (val - 1) * props.pageSize)
}
</script>

<style lang="scss" scoped>
:root {
  --theme-color: #2d8cf0;
}
.pagination {
  font-size: 12px;
  display: flex;
  justify-content: flex-end;
  user-select: none;
  border-bottom: 5px;
  span {
    margin-left: 5px;
    padding: 2px 8px;
    border-radius: 3px;
    background-color: transparent;
    border: none;
    color: #d6d6d6;
    cursor: pointer;
    
    &.current,
    &:hover {
      // border-color: var(--theme-color);
      background-color: #2d8cf0;
      // color: #FFF;
    }
  }
  
  .ellipsis::after {
    content: '…';
  }
  
  .arrow svg {
    width: 10px;
  }
}
</style>
