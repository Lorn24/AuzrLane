<script setup>
import selector from './selector.vue'
import { useRoute } from 'vue-router'
import {
  Application,
  Sprite,
  Container,
  Rectangle,
  Texture,
  Ticker,
  Loader
} from 'pixi.js'
import { AzurLaneStore } from '@/stores/modules/AzurLane/ALInfo'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { paintingJson, paintingObj } from '@/api/getInfo'
import { Spine } from 'pixi-spine'
import { Live2DModel } from 'pixi-live2d-display/cubism4'

// 注册 PIXI 的 Ticker 到 Live2DModel
Live2DModel.registerTicker(Ticker)

const OptionGet = AzurLaneStore()
const route = useRoute()
const pName = ref(route.params.painting)
const skinInf = ref(OptionGet.skinList[pName.value])
const live2dList = ref(OptionGet.live2dList)
const pJson = ref()
const pObj = ref()
const loading = ref(true)
const app = new Application({ resolution: 2 })
const paintingContainer = new Container()
const spineContainer = new Container()
const container = ref()
let limodel
let paintingFace
let back
let spineBase
let spineChar
let timerId


const first = async () => {
  let rarity = OptionGet.shipList[pName.value]['rarity']
  app.loader
    .add(`/AzurLane/shipbackground/${rarity}.png`, (res) => {
      back = new Sprite(res.texture)
      back.anchor.set(0.5)
      back.scale.set(
        Math.max(container.value.offsetWidth / back.width, container.value.offsetHeight / back.height)
      )
      back.position.set(container.value.offsetWidth / 2, container.value.offsetHeight / 2)
      app.stage.addChild(back)
    })
    .add(
      `/AzurLane/spinebase/&{rarity > 6 ? rarity - 2 : rarity}.png`,
      (res) => {
        spineBase = new Sprite(res.texture)
        spineBase.position.set(spineContainer.width / 2, spineContainer.height)
        spineContainer.addChild(spineBase)
        spineContainer.position.set(130, app.screen.height - 100)
      }
    )
    .load(() => handleChange(pName.value))
}

const composeSprite = (texture, pobj) => {
  const layer = new Container()
  const count = pobj.vtList.length
  for (let i = 1; i <= count; i += 4) {
    let v0 = [pobj.vList[i].x, pobj.vList[i].y]
    let v1 = [pobj.vList[i + 2].x, pobj.vList[i + 2].y]
    let vt0 = [
      Math.round(pobj.vtList[i].u * texture.width),
      Math.round(pobj.vtList[i].v * texture.height)
    ]
    let vt1 = [
      Math.round(pobj.vtList[i + 2].u * texture.width),
      Math.round(pobj.vtList[i + 2].v * texture.height)
    ]
    let rectangle = new Rectangle(
      vt0[0],
      texture.height - vt1[1],
      vt1[0] - vt0[0],
      vt1[1] - vt0[1]
    )
    let sprite = new Sprite(new Texture(texture.baseTexture, rectangle))
    sprite.scale.set(1, -1)
    sprite.position.set(-v0[0], v1[1])
    layer.addChild(sprite)
  }
  return layer
}

//加载2d原画
const loadPainting = async (pname, jsondata) => {
  const loader = new Loader()
  const painting = new Container()
  const baseSize = jsondata[pname]['size']
  const baseScale = (app.screen.height / jsondata[pname]['view'][1]) * 0.8
  for (let file of Object.keys(jsondata)) {
    let size = jsondata[file]['size']
    let rawSize = jsondata[file]['rawSize']
    let pivot = jsondata[file]['pivot']
    let position = jsondata[file]['position']
    let layer
    if (file === 'face') {
      paintingFace = new Container()
      paintingFace.scale.set(size[0] / rawSize[0], size[1] / rawSize[1])
      paintingFace.position.set(
        baseSize[0] / 2 - size[0] * pivot[0] + position[0],
        baseSize[1] / 2 - size[1] * pivot[1] + position[1]
      )
      painting.addChild(paintingFace)
      await changeFace(jsondata[file]['list'][0])
      continue
    }
    const png = await new Promise((resolve) => {
      loader
        .reset()
        .add(`/AzurLane/painting/${pname}/${file}.png`, (res) => resolve(res))
        .load()
    })
    if (jsondata[file]['raw'] === true) {
      layer = new Container()
      let sprite = new Sprite(png.texture)
      sprite.position.set(0, sprite.height)
      sprite.scale.set(1, -1)
      layer.addChild(sprite)
    } else {
      pObj.value = await paintingObj(pName.value, file + '-mesh')
      layer = composeSprite(png.texture, pObj.value)
    }
    // console.log(size, rawSize)
    layer.scale.set(size[0] / rawSize[0], size[1] / rawSize[1])
    if (file !== pname) {
      layer.position.set(
        baseSize[0] / 2 - size[0] * pivot[0] + position[0],
        baseSize[1] / 2 - size[1] * pivot[1] + position[1]
      )
    }
    painting.addChild(layer)
  }
  loader.destroy()
  painting.pivot.set(
    baseSize[0] / 2 + jsondata[pname]['position'][0],
    baseSize[1] / 2 + jsondata[pname]['position'][1]
  )
  painting.scale.set(baseScale, -baseScale)
  painting.position.set(0, 0)
  return painting
}

//加载live2d
const loadModel = async (pname) => {
  //清除计时器
  clearInterval(timerId)
  const absoluteUrl = live2dList.value[pname].url
  // console.log("url:",absoluteUrl)
  limodel = await Live2DModel.from(absoluteUrl)
  const scaleSize = Math.max(
    container.value.offsetWidth / limodel.width,
    container.value.offsetHeight / limodel.height
  )*0.6

  //调live2d大小
  limodel.pivot.set(
  limodel.width / 2 ,
  limodel.height / 2 
  )
  limodel.scale.set(scaleSize)
  limodel.position.set(app.screen.width / 2 , app.screen.height / 2)
  app.stage.addChild(limodel)
  // console.log("x:",app.screen.width / 2 - limodel.width*scaleSize,"y:",0);

  //随机触发是否出现开场动画
  let random_start = Math.random()
  if(random_start < 0.25){
    limodel.motion('login')
  }else if(random_start >= 0.25 && random_start < 0.5){
    limodel.motion('home')
  }

  playIdMotion()

  // 交互
  limodel.on('hit', (hitAreas) => {
    console.log('hitArea: ',hitAreas);
    if (hitAreas.includes('TouchHead')) {
      limodel.motion('touch_head')
    } else if (hitAreas.includes('TouchBody')) {
      limodel.motion('touch_body')
    } else if (hitAreas.includes('TouchSpecial')) {
      limodel.motion('touch_special')
    } else if (hitAreas.includes('TouchIdle1')) {
      limodel.motion('touch_idle1')
    } else if (hitAreas.includes('TouchIdle2')) {
      limodel.motion('touch_idle2')
    } else if (hitAreas.includes('TouchIdle3')) {
      limodel.motion('touch_idle3')
    } else if (hitAreas.includes('TouchIdle4')) {
      limodel.motion('touch_idle4')
    } else if (hitAreas.includes('TouchIdle5')) {
      limodel.motion('touch_idle5')
    } else if (hitAreas.includes('TouchDrag1')) {
      limodel.motion('touch_drag1')
    } else if (hitAreas.includes('TouchDrag2')) {
      limodel.motion('touch_drag2')
    } else if (hitAreas.includes('TouchDrag3')) {
      limodel.motion('touch_drag3')
    } else if (hitAreas.includes('TouchDrag4')) {
      limodel.motion('touch_drag4')
    } else if (hitAreas.includes('TouchDrag5')) {
      limodel.motion('touch_drag5')
    } 
  })
}

//随机待机动作
const playIdMotion = () => {
  let random_num = Math.random()
  console.log("random_num=",random_num)
  if(random_num < 0.1){
    limodel.motion('idle')
  } else if(random_num >= 0.1 && random_num < 0.2){
    limodel.motion('idle2')
  } else if(random_num >= 0.2 && random_num < 0.3){
    limodel.motion('idle3')
  } else if(random_num >= 0.3 && random_num < 0.4){
    limodel.motion('idle4')
  } else if(random_num >= 0.4 && random_num < 0.5){
    limodel.motion('main_1')
  } else if(random_num >= 0.5 && random_num < 0.6){
    limodel.motion('main_2')
  } else if(random_num >= 0.6 && random_num < 0.7){
    limodel.motion('main_3')
  } else if(random_num >= 0.7 && random_num < 0.8){
    limodel.motion('main_4')
  } else if(random_num >= 0.8 && random_num < 0.9){
    limodel.motion('wedding')
  } else if(random_num >= 0.9 && random_num < 1){
    limodel.motion('complete')
  }
}

const changeFace = async (index) => {
  const loader = new Loader()
  const png = await new Promise((resolve) => {
    loader
      .reset()
      .add(`/AzurLane/paintingface/${pName.value}/${index}.png`, (res) =>
        resolve(res)
      )
      .load()
  })
  loader.destroy()
  let sprite = new Sprite(png.texture)
  sprite.position.set(0, sprite.height)
  sprite.scale.set(1, -1)
  paintingFace.removeChildren()
  paintingFace.addChild(sprite)
}

const handleChange = async (pname) => {
  if (limodel) {
    app.stage.removeChild(limodel)
  }
  //判断是否该皮肤是否有live2d格式
  let keyExists = live2dList.value.hasOwnProperty(pname)
  console.log("keyExists",keyExists)
  loading.value = true
  app.loader.reset()
  pJson.value = await paintingJson(pName.value, pName.value)
  paintingContainer.removeChildren()
  if(keyExists){
    loadModel(pname)
    //设置定时器，定时待机动作
    timerId = setInterval(playIdMotion,60000)
  }else{
    paintingContainer.addChild(await loadPainting(pname, pJson.value))
    paintingContainer.pivot.set(0)
    paintingContainer.scale.set(1)
    paintingContainer.position.set(app.screen.width / 2, app.screen.height / 2)
    app.stage.addChild(paintingContainer)
  }
  app.stage.addChild(spineContainer)
  loading.value = false

  app.loader
    .add(`/AzurLane/spine/${pName.value}/${pName.value}.skel`, (res) => {
      console.log(res)
      spineChar?.destroy()
      spineChar = new Spine(res.spineData)
      console.log(spineChar)
      spineChar.scale.set(0.5)
      spineChar.position.set(
        spineContainer.width / 2,
        spineContainer.height - 25
      )
      spineContainer.addChild(spineChar)
      spineChar.state.setAnimation(0, 'stand', true)
    })
    .load()
}

watch(pName, () => {
  handleChange(pName.value)
})

onMounted(() => {
  container.value.appendChild(app.view)
  app.renderer.resize(container.value.offsetWidth, container.value.offsetHeight)
  first()

  container.value.onwheel = (e) => {
    paintingContainer.pivot.x +=
      (e.offsetX / 2 - paintingContainer.position.x) / paintingContainer.scale.x
    paintingContainer.pivot.y +=
      (e.offsetY / 2 - paintingContainer.position.y) / paintingContainer.scale.y
    paintingContainer.position.set(e.offsetX / 2, e.offsetY / 2)
    paintingContainer.scale.set(
      Math.min(Math.max(paintingContainer.scale.x + e.deltaY * -0.005, 0.25), 4)
    )
  }

  paintingContainer.interactive = true
  paintingContainer.on('pointerdown', (e) => {
    let { x, y } = e.data.global
    paintingContainer
      .on('pointermove', (e) => {
        paintingContainer.position.x += e.data.global.x - x
        paintingContainer.position.y += e.data.global.y - y
        ;(x = e.data.global.x), (y = e.data.global.y)
      })
      .on('pointerup', () => {
        paintingContainer.off('pointermove')
      })
  })
})

onUnmounted(() => {
  app.destroy(true, true)
  clearInterval(timerId)

})
</script>

<template>
  <div id="pixi" ref="container"></div>
  <selector
    :avatorName="pName"
    :skinList="skinInf"
    v-model="pName"
    class="a-selector"
  ></selector>
</template>

<style>
#pixi {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
}
#pixi canvas {
  transform-origin: 0 0;
  scale: 0.51;
}
.a-selector {
  margin: 8px 5px;
}
</style>
