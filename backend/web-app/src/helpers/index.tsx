import {toast} from "react-toastify";


export const title_pag: any = {}

export const getTitlePag = (match_fn: any) => {
  let match = match_fn()
  if (match !== undefined){
    let path = match.path
    let title = title_pag[path]
    if (title !== undefined && title !== '')
      return "EWS | " + title
  }
  return 'EWS'
}


export const genericApiError = () => {
  toast.error("An error occurred while communicating with the server, please try again in a few moments", {
    position: toast.POSITION.TOP_CENTER
  });
}

export const formatData = (data: any) => {
  const formatedDataList: any[] = []
  data.map((item: any) => {
    let fromatedData
    if (item.maxSteps !== undefined) {
      fromatedData = {
        value: item.id,
        label: item.name,
        maxSteps: item.maxSteps,
      }
    } else {
      fromatedData = {
        value: item.id,
        label: item.text,
      }
    }
    formatedDataList.push(fromatedData)
  })
  return formatedDataList
}

export const dimensionsFixArrowService = (url: string, width: number, height: number) => {
  if (url !== ""){
    return url.replace(/&width=.*&height/, `&width=${width}&height`).replace(/&height=.*&arrowdesc/, `&height=${height}&arrowdesc`)
  } else {
    return url
  }
}
