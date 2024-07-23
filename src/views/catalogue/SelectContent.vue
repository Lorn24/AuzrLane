<script setup>
import { nextTick, ref, watch } from 'vue'
import * as echarts from 'echarts'
const rarity = ref()
const nationality = ref()
const type = ref()
const activeName = ref('type')
let alChart

const getChartData = (arr, obj, pname) => {
  const countMap = {} //创建一个空对象来储存值的出现次数
  // console.log(arr, obj)
  arr.forEach((value) => {
    countMap[value[1]] = 0
    Object.keys(obj).forEach((key) => {
      if (obj[key][pname] === value[0]) {
        countMap[value[1]]++
      }
    })
  })
  const resultArray = []
  for (const key in countMap) {
    resultArray.push({ value: countMap[key], name: key })
  }
  return resultArray.sort(function (a, b) {
    return a.value - b.value
  }) //排序
}

const changeChart = async (pname) => {
  await nextTick()
  let chartdata
  console.log(pname)
  if (pname === 'type') {
    chartdata = getChartData(props.typeList, props.shipList, pname)
  }
  if (pname === 'nationality') {
    chartdata = getChartData(props.nationalityList, props.shipList, pname)
  }
  if (pname === 'rarity') {
    chartdata = getChartData(props.rarityList, props.shipList, pname)
  }
  alChart = echarts.init(document.getElementById('scChart'))
  alChart.setOption({
    // backgroundColor: '#2E2733',
    title: {
      text: 'AuzrLane',
      subtext: pname,
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: chartdata,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  })
}

watch(
  (activeName,
  () => {
    changeChart(activeName.value)
    console.log(activeName.value, 'watch')
  })
)

const props = defineProps({
  rarityList: Array,
  nationalityList: Array,
  typeList: Array,
  shipList: {}
})
const emit = defineEmits(['change-list'])
watch(
  [rarity, nationality, type],
  ([newr, newn, newt]) => {
    let changeList = Object.keys(props.shipList).reduce((acc, key) => {
      const item = props.shipList[key]
      if (
        (!newr || item.rarity === newr) &&
        (!newn || item.nationality === newn) &&
        (!newt || item.type === newt)
      ) {
        acc[key] = item
      }
      return acc
    }, {})
    emit('change-list', changeList)
  },
  { deep: true }
)
</script>

<template>
  <div class="sc-sc">
    <div class="sc-chart" id="scChart"></div>
    <div class="sc-selector">
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item name="type">
          <template #title>
            <div class="select-sort">类型</div>
          </template>
          <el-radio-group v-model="type">
            <el-radio
              v-for="item in props.typeList"
              :label="item[0]"
              :key="item[0]"
              class="sc-el-radio"
              border
              >{{ item[1] }}</el-radio
            >
            <el-radio label="" class="sc-el-radio" border>全选</el-radio>
          </el-radio-group>
        </el-collapse-item>
        <el-collapse-item name="rarity">
          <template #title>
            <div class="select-sort">稀有度</div>
          </template>
          <el-radio-group v-model="rarity">
            <el-radio
              v-for="item in props.rarityList"
              :label="item[0]"
              :key="item[0]"
              size="large"
              class="sc-el-radio"
              border
              >{{ item[1] }}</el-radio
            >
            <el-radio label="" class="sc-el-radio" border>全选</el-radio>
          </el-radio-group>
        </el-collapse-item>
        <el-collapse-item name="nationality">
          <template #title>
            <div class="select-sort">阵营</div>
          </template>
          <el-radio-group v-model="nationality">
            <el-radio
              v-for="item in props.nationalityList"
              :label="item[0]"
              :key="item[0]"
              class="sc-el-radio"
              border
              >{{ item[1] }}</el-radio
            >
            <el-radio label="" class="sc-el-radio" border>全选</el-radio>
          </el-radio-group>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<style scoped>
.sc-sc {
  display: flex;
  background: transparent; /* 完全透明背景 */
  position: relative;
}
.sc-chart {
  width: 700px;
  height: 700px;
}
.sc-selector {
  width: 30%;
  position: absolute;
  right: 0;
}
.select-sort {
  width: 80px;
  margin: 20px 0;
  height: 40px;
  font-size: 20px;
  font-weight: 300;
}
.sc-el-radio {
  margin: 10px;
}
</style>
