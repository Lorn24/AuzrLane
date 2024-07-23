<script setup>
import * as THREE from 'three'
//导入轨道控制器
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
//导入hdr加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
//导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { onMounted, onUnmounted, ref } from 'vue'

const threeBackground = ref()
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(0, 0, 10)
scene.add(camera)

//实例化加载器gltf
const gltfLoader = new GLTFLoader()
//加载模型
gltfLoader.load(
  //模型路径
  './three/gltf/security_camera_01_4k.gltf/security_camera_01_4k.gltf',
  //加载完成回调
  (gltf) => {
    console.log(gltf)
    const model = gltf.scene
    model.scale.set(7, 7, 7)
    model.position.set(-3, 0, -5)
    scene.add(model)
  }
)
gltfLoader.load(
  //模型路径
  './three/gltf/security_camera_02_4k.gltf/security_camera_02_4k.gltf',
  //加载完成回调
  (gltf) => {
    console.log(gltf)
    const model = gltf.scene
    model.scale.set(7, 7, 7)
    model.position.set(3, 0, -5)
    scene.add(model)
  }
)

//加载hdr贴图
const rgbeLoader = new RGBELoader()
rgbeLoader.load('./three/texture/hdr/artist_workshop_4k.hdr', (envMap) => {
  //设置球形映射
  envMap.mapping = THREE.EquirectangularReflectionMapping
  //设置背景贴图
  scene.background = envMap
  //设置环境贴图
  scene.environment = envMap
})

//渲染器
const renderer = new THREE.WebGLRenderer({
  //设置抗锯齿
  antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
//将webgl渲染的canvas内容添加到body
// threeBackground.value.appendChild(renderer.domElement)

//添加轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
//设置带阻尼的惯性
controls.enableDamping = true

// 定义渲染函数
const animate = () => {
  controls.update()
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}
animate()

// 监听窗口变化
window.addEventListener('resize', () => {
  //重置渲染器宽高比
  renderer.setSize(window.innerWidth, window.innerHeight)
  //重置相机宽高比
  camera.aspect = window.innerWidth / window.innerHeight
  //更新相机投影矩阵
  camera.updateProjectionMatrix()
})
onMounted(() => {
  //将webgl渲染的canvas内容添加到body
  threeBackground.value.appendChild(renderer.domElement)
})
onUnmounted(() => {
  while (scene.children.length > 0) {
    let child = scene.children[0]
    scene.remove(child)

    if (child instanceof THREE.Mesh) {
      child.geometry.dispose()
      child.material.dispose()
    }
  }
  console.log('成功')
})
</script>

<template>
  <div ref="threeBackground"></div>
</template>

<style></style>
