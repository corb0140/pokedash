import axios from 'axios'

export const api = axios.create({
  baseURL:
    import.meta.env.VITE_RESTFUL_API_URL ??
    import.meta.env.VITE_RESTFUL_API_LOCAL_URL,
  withCredentials: true,
})
