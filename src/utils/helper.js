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
        },
        GET: async(url)=>{
            try{
                return await axios.get(url)
            }
            catch(e){
                throw new Error(e)
            }
        },
        PUT: async(url, params)=>{
            try{
                return await axios.put(url, params)
            }
            catch(e){
                throw new Error(e)
            }
        },
        DELETE : async(url, id)=>{
            try {
                return await axios.delete(url, {id})
            } catch (e) {
                throw new Error(e)
            }
        }
    }
}