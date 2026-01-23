import { api } from "./api"
import { getApi, postApi } from "./DefaultApi"
import { getUserId } from "@/Utils/autherId"
const userId = getUserId();
export const handleShortList = async(brandId) => {
  // console.log("handleShortList :",brandId)
   
      const url = `${api.shortListApi.post}/${userId}`
    const data = {
            shortListedId: brandId 
        }
    await postApi(url,data)

    return

    

}

