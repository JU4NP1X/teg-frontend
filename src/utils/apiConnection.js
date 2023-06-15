import Session from './session'
import axios from 'axios'
import { createSearchParams } from 'react-router-dom'
import history from './history'
const env = import.meta.env

let apiUrl = env.VITE_PROXY_ENDPOINT
apiUrl = apiUrl.slice(-1) !== '/' ? apiUrl + '/' : apiUrl
const ApiConnection = () => {

  let Api = axios.create({
    baseURL: apiUrl,
    headers: { 'Authorization': `Bearer ${Session.token()}` }
  })

  Api.status = 0


  Api.interceptors.response.use(
    (response) => {
      let data = response.data
      Api.status = response.status
      Api.message = data.message
      Api.data = data.data

      return data.data
    },
    (error) => {

      console.log({ error })
      let message = ''
      const response = error.response ?? {}
      let data = response.data ?? {}

      Api.status = response.status
      Api.message = data.message
      Api.data = data.data

      if (data.message && (typeof data.message) === 'string') message = data.message
      else message = 'Error desconocido. Inicie sesión de nuevo.'
      if (Api.status === 401) {
        Session.unset()
        history.replace(`/?errorMessage=${message}`)
      }
      return data.data
    })

  return Api
}

export default ApiConnection
