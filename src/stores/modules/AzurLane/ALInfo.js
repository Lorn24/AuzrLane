import { defineStore } from 'pinia'
import { ref } from 'vue'
import { jsondata } from '@/api/GetInfo'
import { judgeStorage } from '@/utils/judge'
export const AzurLaneStore = defineStore(
  'ALInfo',
  () => {
    const rarityList = ref([])
    const nationalityList = ref([])
    const typeList = ref([])
    const shipList = ref({})
    const skinList = ref({})
    const live2dList = ref({})
    const setDefaultList = async () => {
      if (judgeStorage('ALInfo')) {
        const resOption = await jsondata('option')
        rarityList.value = resOption.rarity
        nationalityList.value = resOption.nationality
        typeList.value = resOption.type

        const resShip = await jsondata('ship')
        console.log(resShip)
        shipList.value = resShip

        const resSkin = await jsondata('skin')
        console.log(resSkin)
        skinList.value = resSkin

        const resLive2d = await jsondata('azurline-live2d')
        console.log(resLive2d)
        live2dList.value = resLive2d
      }
    }
    return {
      rarityList,
      nationalityList,
      typeList,
      shipList,
      skinList,
      live2dList,
      setDefaultList
    }
  },
  {
    persist: true
  }
)
