<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { AzurLaneStore } from '@/stores/modules/AzurLane/ALInfo'
import MySquareicon from '@/components/MySquareicon.vue'
import * as PIXI from 'pixi.js'
import { Live2DModel } from 'pixi-live2d-display/cubism4'

const drawer = ref(false)
const OptionGet = AzurLaneStore()
const liapp = new PIXI.Application({ resolution: 2, backgroundAlpha: 0 })
const licontainer = ref()
const live2dList = ref(OptionGet.live2dList)
const renderName = ref('abeikelongbi_3')
let limodel

window.PIXI = PIXI

const loadModel = async (liname) => {
  if (limodel) {
    liapp.stage.removeChild(limodel)
    limodel.destroy() // 销毁之前的模型
  }

  limodel = await Live2DModel.from(live2dList.value[liname].url)
  const scaleSize =
    Math.min(
      licontainer.value.offsetWidth / limodel.width,
      licontainer.value.offsetHeight / limodel.height
    ) * 1.1
  liapp.stage.addChild(limodel)
  limodel.scale.set(scaleSize)
  limodel.x = licontainer.value.offsetWidth / 10
  limodel.y = -licontainer.value.offsetHeight / 12

  // 交互
  limodel.on('hit', (hitAreas) => {
    if (hitAreas.includes('TouchHead')) {
      limodel.motion('Start')
    } else if (hitAreas.includes('TouchBody')) {
      limodel.motion('All')
    }
  })
}

//组件通信改变renderName
const changeSiname = (name) => {
  renderName.value = name
  console.log(renderName.value)
}

//监听renderName的改变，重新渲染live2d图像
watch(renderName, () => {
  loadModel(renderName.value)
})

onMounted(() => {
  licontainer.value.appendChild(liapp.view)
  liapp.renderer.resize(
    licontainer.value.offsetWidth,
    licontainer.value.offsetHeight
  )
  loadModel(renderName.value)
})
onUnmounted(() => {
  limodel?.destroy()
  liapp?.destroy()
})
</script>

<template>
  <div id="lipixi" ref="licontainer"></div>
  <el-button
    type="primary"
    style="margin-left: 16px"
    @click="drawer = true"
    class="al-button"
  >
    open
  </el-button>
  <el-drawer
    v-model="drawer"
    title="I am the title"
    :with-header="false"
    size="35%"
  >
    <div id="testli">
      <ul class="infinite-list" style="overflow: auto">
        <el-scrollbar>
          <li
            v-for="(item, index) in live2dList"
            :key="index"
            class="infinite-list-item"
          >
            <MySquareicon
              :siname="item.name"
              @change-siname="changeSiname"
            ></MySquareicon>
          </li>
        </el-scrollbar>
      </ul>
    </div>
  </el-drawer>
</template>

<style>
#lipixi {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
}
#lipixi canvas {
  transform-origin: 0 0;
  scale: 0.5;
}
.al-button {
  position: absolute;
  right: 6vw;
  top: 2vh;
}
#testli {
  position: absolute;
  right: 0;
  width: auto;
  height: 100vh;
}
#testli .infinite-list {
  width: 30vw;
  height: 100vh;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
#testli .infinite-list .infinite-list-item {
  margin: 10px;
  width: 86px;
  height: 96px;
  display: inline-block;
  position: relative;
}
</style>
