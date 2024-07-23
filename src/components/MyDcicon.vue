<script setup>
const props = defineProps({
  siname: String
})
const emits = defineEmits(['change-siname'])
</script>

<template>
  <el-card>
    <el-image
      :src="`/live2d/DestinyChild/${props.siname}/icon.png`"
      alt=""
      fit="contain"
      class="first-img"
      @click="emits('change-siname', props.siname)"
    ></el-image>
  </el-card>
</template>

<style>
.first-img {
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  border: 2px solid #76677a;
}
</style>
