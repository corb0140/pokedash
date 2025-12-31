import axios from 'axios'

const LIVE_URL = import.meta.env.VITE_RESTFUL_API_URL
// const LOCAL_URL = import.meta.env.VITE_RESTFUL_API_LOCAL_URL

export const api = axios.create({
  baseURL: LIVE_URL,
  withCredentials: true,
})
