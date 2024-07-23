export const jsondata = async (name) => {
  const request = new Request(`/data/${name}.json`)

  const response = await fetch(request)
  const jsondata = await response.json()

  return jsondata
}

export const paintingJson = async (name, pname) => {
  const request = new Request(`/AzurLane/painting/${name}/${pname}.json`)
  const response = await fetch(request)
  const paintingJson = await response.json()
  return paintingJson
}

export const paintingObj = async (name, pname) => {
  const request = new Request(`/AzurLane/painting/${name}/${pname}.obj`)
  const response = await fetch(request)
  const paintingObj = await response.text()
  const lines = paintingObj.split('\n')
  const pObj = {}
  const vList = []
  const vtList = []
  for (const line of lines) {
    const parts = line.trim().split(/\s+/)
    const prefix = parts[0]

    if (prefix === 'v') {
      // 处理顶点坐标
      const x = parseFloat(parts[1])
      const y = parseFloat(parts[2])

      // 仅保留 x 和 y 坐标
      vList.push({ x, y })
    } else if (prefix === 'vt') {
      // 处理纹理坐标
      const u = parseFloat(parts[1])
      const v = parseFloat(parts[2])

      // 保留 u 和 v 坐标
      vtList.push({ u, v })
    }
  }
  pObj.vList = vList
  pObj.vtList = vtList
  return pObj
}

export const spineSkel = async (name, pname) => {
  const request = new Request(`/AzurLane/spine/${name}/${pname}.skel`)
  const response = await fetch(request)
  const paintingSkel = await response.blob()
  return paintingSkel
}
