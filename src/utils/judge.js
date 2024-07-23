export const judgeStorage = (sName) => {
  const localStorageInf = localStorage.getItem(sName)
  if (localStorageInf === null) {
    return true
  }
  return false
}
