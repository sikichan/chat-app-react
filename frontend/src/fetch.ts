import axios from "axios"

const service = axios.create({
  baseURL: "/api",
  timeout: 5000,
})
service.interceptors.request.use(
  (resolve) => {
    resolve.headers["x-header-host"] = window.location.host
    return resolve
  },
  (error) => {
    return Promise.reject(error)
  },
)
service.interceptors.response.use(
  (response) => {
    return response
  },
  ({ response }) => {
    console.log("response", response)
    if (response.status === 401) {
      localStorage.removeItem("chat-user")
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
    return Promise.reject({
      status: response.status,
      message: response.data || response.statusText,
    })
  },
)
export { service as request }
