<script setup>
// defineOptions({
//   name: 'MyIcon'
// })
import { useRouter } from 'vue-router'
const props = defineProps({
  rarity: Number,
  painting: String
})
const router = useRouter()
const goAvatar = (value) => {
  router.push({
    name: 'avatar',
    params: {
      painting: value
    }
  })
}
</script>

<template>
  <el-card
    :style="{
      backgroundImage: `url(./AzurLane/iconbackground/${props.rarity}.png)`
    }"
    ><el-image
      :src="`./AzurLane/shipicon/${props.painting}.png`"
      alt=""
      fit="contain"
      class="first-img"
      @click="goAvatar(props.painting)"
    /><el-image
      :src="`./AzurLane/iconframe/${props.rarity}.png`"
      alt=""
      fit="contain"
      class="last-img"
    />
  </el-card>
</template>

<style>
.el-card {
  height: 0;
  padding-bottom: 132%;
  position: relative;
  background-size: 100% 100%;
  overflow: visible;
}
.first-img {
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
}
.last-img {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  bottom: 0;
  scale: 1.125;
  pointer-events: none;
}
</style>
