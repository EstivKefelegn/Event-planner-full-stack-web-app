import axios, { type InternalAxiosRequestConfig } from "axios";
import { ACCESS_TOKEN } from "./tokens";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})


api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(ACCESS_TOKEN)
    console.log("API base URL is:", import.meta.env.VITE_API_URL);
    if (token) {
      config.headers.Authorization = `JWT ${token}`
      
    }

    return config 
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api