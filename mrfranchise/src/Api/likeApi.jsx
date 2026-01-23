import { api } from "./api"
import { postApi } from "./DefaultApi"

export const likeApiFunction = async(id) => {

    // console.log("likeApiFunction :",id)
    const data = {
        branduuid : id
    }
    try {
       const res =  await postApi(api.likeApi.post,data)

    //    console.log("=== ,",res.data)
    } catch (error) {
        console.error(error)
    }
}