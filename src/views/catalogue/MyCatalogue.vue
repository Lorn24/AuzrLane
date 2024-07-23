<script setup>
import { AzurLaneStore } from '@/stores/modules/AzurLane/ALInfo'
import SelectContent from './SelectContent.vue'
import MyIcon from '@/components/MyIcon.vue'

import { onActivated, ref } from 'vue'
const drawer = ref(false)
const shipList = ref()
const alPosition = ref()
const scrollPosition = ref()

const OptionGet = AzurLaneStore()
OptionGet.setDefaultList()
shipList.value = OptionGet.shipList

const updateList = (newList) => {
  // console.log(newList)
  shipList.value = newList
}

const savePosition = (e) => {
  // alPosition.value = e.scrollTop
  scrollPosition.value = e.scrollTop
}

onActivated(() => {
  alPosition.value.setScrollTop(scrollPosition.value)
})
</script>
<template>
  <div class="al-catalogue">
    <el-container>
      <el-header>
        <el-button
          type="primary"
          style="margin-left: 16px"
          @click="drawer = true"
          class="select-button"
        >
          筛选
        </el-button>

        <el-drawer v-model="drawer" :with-header="false" size="80%">
          <SelectContent
            :rarityList="OptionGet.rarityList"
            :nationalityList="OptionGet.nationalityList"
            :typeList="OptionGet.typeList"
            :shipList="OptionGet.shipList"
            @change-list="updateList"
          ></SelectContent>
        </el-drawer>
      </el-header>
      <el-main>
        <ul class="infinite-list" style="overflow: auto">
          <el-scrollbar ref="alPosition" @scroll="savePosition">
            <li
              v-for="(item, index) in shipList"
              :key="index"
              class="infinite-list-item"
            >
              <MyIcon :rarity="item.rarity" :painting="item.painting"></MyIcon>
            </li>
          </el-scrollbar>
        </ul>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.al-catalogue {
  background: url(/background/background03.png) center/cover no-repeat;
  height: 100vh;
  overflow: hidden;
}
.select-button {
  margin-top: 20px;
  width: 80px;
  height: 40px;
  font-size: 20px;
}
.infinite-list {
  width: 80vw;
  height: 100vh;
  margin: 0 auto 10px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  list-style: none;
}
.infinite-list .infinite-list-item {
  margin: 10px;
  width: 116px;
  height: 162px;
  display: inline-block;
  position: relative;
}
</style>
