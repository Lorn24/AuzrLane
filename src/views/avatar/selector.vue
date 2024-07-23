<script setup>
import { computed } from 'vue'

defineOptions({
  name: 'MySelector'
})
const props = defineProps({
  avatarName: String,
  skinList: {}
})
const emits = defineEmits(['update'])
const name = computed({
  get: () => props.avatarName,
  set: (value) => emits('update', value)
})
// console.log('name:', name)
</script>

<template>
  <el-select v-model="name" size="large" class="avator-select">
    <el-option
      v-for="(item, index) in Object.keys(props.skinList)"
      :key="index"
      :label="props.skinList[item].name"
      :value="props.skinList[item].painting"
    />
  </el-select>
</template>

<style>
.avator-select {
  width: 16em;
  box-shadow: var(--el-box-shadow-light);
}
</style>
