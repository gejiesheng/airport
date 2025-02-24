<template>
  <label class="switch" :class="{active:checked,inactive:!checked,disabled}">
    <input type="hidden" v-if="name&&!checked&&inactiveValue!==false" v-bind="{name,value:inactiveValue}" />
    <input type="checkbox" v-bind="{checked,id,name:checked?name:null,value:activeValue,disabled}" @change.stop="onChange" />
    <div class="switch-inactive-slot" v-if="$slots.inactive">
      <slot name="inactive"></slot>
    </div>
    <div class="switch-slider flex">
      <span class="switch-slider-action">
        <slot name="action"></slot>
      </span>
      <small class="switch-slider-text"></small>
    </div>
    <div class="switch-active-slot" v-if="$slots.active">
      <slot name="active"></slot>
    </div>
  </label>
</template>
<script setup>
import {shallowRef} from '@vue/reactivity';
import {watch} from '@vue/runtime-core';
const props=defineProps({
  modelValue:{type:[Boolean,String,Number],default:null},
  activeValue:{type:[Boolean,String,Number],default:true},
  inactiveValue:{type:[Boolean,String,Number],default:false},
  id:{type:String,default:null},
  name:{type:String,default:null},
  disabled:{type:Boolean,default:false},
}),
emit=defineEmits(['update:modelValue','change']),
checked=shallowRef(false),
onChange=()=>{
  checked.value=!checked.value;
  emit('update:modelValue',checked.value?props.activeValue:props.inactiveValue);
  emit('change',checked.value);
};
if(props.modelValue!==null){
  watch(
    ()=>props.modelValue,
    val=>{
      checked.value=val===props.activeValue;
    },
    {immediate:true}
  );
}
</script>
<style lang="scss" scoped>
.switch{
  --active-color:var(--theme-color);
  --inactive-color:var(--inactive-color);
  --active-background:var(--active-color);
  --inactive-background:var(--inactive-color);
  --active-text:'';
  --inactive-text:'';
  --action-background:#fff;
  --transition-duration:0.2s;
  display:inline-flex;
  align-items:center;
  user-select:none;
  &.disabled{ pointer-events:none; }
  input[type="checkbox"]{ display:none; }
  &-inactive-slot,&-active-slot{ transition:color var(--transition-duration) ease; }
  &-inactive-slot{ margin-right:5px; }
  &-slider{
    position:relative;
    width:3.2em;
    height:1.6em;
    border-radius:0.8em;
    justify-content:center;
    margin-top:0;
    margin-bottom:0;
    transition:background var(--transition-duration) ease;
    &-action{
      border-radius:50%;
      background:var(--action-background);
      width:1.2em;
      height:1.2em;
      transition:transform var(--transition-duration) ease;
      display:flex;
      align-items:center;
      justify-content:center;
    }
    &-text{
      position:absolute;
      top:50%;
      left:0;
      right:0;
      transform:translateY(-50%) scale(0.8);
      text-align:center;
      &::after{
        color:#fff;
        display:inline-block;
        transition:transform var(--transition-duration) ease;
      }
    }
  }
  &-active-slot{ margin-left:5px; }
  
  &.active{
    .switch-inactive-slot{ color:var(--inactive-color); }
    .switch-slider{
      background:var(--active-background);
      box-shadow:1px 1px 3px #666 inset;
    }
    .switch-slider-action{
      transform:translateX(150%) translateY(3px);
      box-shadow:1px 1px 3px #888;
      background:var(--slider-active-color);
    }
    .switch-slider-text::after{
      content:var(--active-text);
      transform:translateX(-0.95em);
      color:var(--active-text-color);
    }
    .switch-active-slot{ color:var(--active-color); }
  }
  &.inactive{
    .switch-inactive-slot{ color:var(--inactive-color); }
    .switch-slider{
      background:var(--inactive-background);
      box-shadow:-1px 1px 3px #888 inset;
    }
    .switch-slider-action{
      transform:translateX(10%) translateY(3px);
      box-shadow:-1px 1px 3px #888;
    }
    .switch-slider-text::after{
      content:var(--inactive-text);
      transform:translateX(0.95em);
    }
    .switch-active-slot{ color:var(--inactive-color); }
  }
}
</style>