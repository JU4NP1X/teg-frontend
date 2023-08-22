import axios from 'axios'
import history from './history'
import Session from './session'
import useAuth from '../hooks/useAuth'
const env = import.meta.env

let apiUrl = env.VITE_PROXY_ENDPOINT
apiUrl = apiUrl.slice(-1) !== '/' ? apiUrl + '/' : apiUrl
const ApiConnection = () => {
  let Api = axios.create({
    baseURL: apiUrl,
    headers: Session.token()
      ? { Authorization: `Token ${Session.token()}` }
      : {},
  })

  Api.status = 0

  Api.interceptors.response.use(
    (response) => {
      let data = response.data
      Api.status = response.status
      Api.data = data

      return data
    },
    (error) => {
      console.log({ error })
      let message = 'No autorizado'
      const response = error.response ?? {}
      let data = response.data ?? {}

      Api.status = response.status
      Api.data = data

      if (Api.status === 401) {
        Session.unset()
        history.replace(`/?errorMessage=${message}&unsetUser=true`)
      }
      return data
    }
  )

  return Api
}

export default ApiConnection
