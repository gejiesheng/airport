<template>
  <button
    class="button"
    :class="[color?`bgc-${color}`:'theme-color']"
    :type="type"
    @click="onClick">
    <slot></slot>
  </button>
</template>
<script setup>
const props=defineProps({
  type:{type:String,default:'button'},
  color:{type:String,default:null},
}),
emit=defineEmits(['click']),
onClick=e=>{
  e.target.blur();
  emit('click',e);
};
</script>