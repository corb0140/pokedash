import axios from 'axios'

const LIVE_URL = import.meta.env.VITE_RESTFUL_API_URL
const LOCAL_URL = import.meta.env.VITE_RESTFUL_API_LOCAL_URL

// Determine which URL to use
const getBaseURL = () => {
  // In development mode, use local backend
  if (import.meta.env.DEV) {
    return LOCAL_URL || 'http://localhost:8000'
  }
  // In production, use live backend
  return LIVE_URL
}

export const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
})
