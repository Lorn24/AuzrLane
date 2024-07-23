<script setup>
import * as THREE from 'three'
//导入轨道控制器
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
//导入hdr加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
//导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { onMounted, ref } from 'vue'

const test = ref()
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(0, 0, 10)
scene.add(camera)

// //添加物体
// const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
// const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 })
// //根据几何体和材料创建物体
// const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
// scene.add(cube)

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

//创建纹理加载器
const textureLoader = new THREE.TextureLoader()
//加载纹理
const texture = textureLoader.load('./AzurLane/shipicon/22.png')
//使用SRGB 默认线性空间
texture.colorSpace = THREE.SRGBColorSpace

//加载ao贴图
// const aoMap = textureLoader.load()
//加载hdr贴图
const rgbeLoader = new RGBELoader()
rgbeLoader.load(
  './three/udim/industrial_pipe_and_valve_01_2k.hdr',
  (envMap) => {
    //设置球形映射
    envMap.mapping = THREE.EquirectangularReflectionMapping
    //设置背景贴图
    scene.background = envMap
    //设置环境贴图
    scene.environment = envMap
    //设置plane的环境贴图
    planeMaterial.envMap = envMap
  }
)
//纹理
const planeGeometry = new THREE.PlaneGeometry(1, 1)
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0xfffffff,
  map: texture,
  //允许透明
  transparent: true
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.position.set(2, 2, 2)
scene.add(plane)

//渲染器
const renderer = new THREE.WebGLRenderer({
  //设置抗锯齿
  antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)

//添加轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
//设置带阻尼的惯性
controls.enableDamping = true

// 定义渲染函数
const animate = () => {
  controls.update()
  requestAnimationFrame(animate)
  // //旋转
  // cube.rotation.x += 0.01
  // cube.rotation.y += 0.01
  renderer.render(scene, camera)
}
animate()

onMounted(() => {
  //将webgl渲染的canvas内容添加到body
  test.value.appendChild(renderer.domElement)
})
// 监听窗口变化
window.addEventListener('resize', () => {
  //重置渲染器宽高比
  renderer.setSize(window.innerWidth, window.innerHeight)
  //重置相机宽高比
  camera.aspect = window.innerWidth / window.innerHeight
  //更新相机投影矩阵
  camera.updateProjectionMatrix()
})
</script>

<template>
  <div ref="test"></div>
</template>

<style></style>
