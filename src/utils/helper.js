import axios from "axios"

export const helper = {
    APICALL: {
        POST: async(url, params)=>{
            try{
                return await axios.post(url, params)
            }
            catch(e){
                throw new Error(e)
            }
        }
    }
}