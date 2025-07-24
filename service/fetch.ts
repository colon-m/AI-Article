import axios from "axios";

const fetch = axios.create({
    baseURL: '/',
})

fetch.interceptors.request.use(config => {
    return config
},error => Promise.reject(error))
fetch.interceptors.response.use(response =>{
    if (response.status === 200){
        return response.data
    }
},error => Promise.reject(error))

export default fetch;