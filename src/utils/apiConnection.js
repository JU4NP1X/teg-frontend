import axios from 'axios'
import history from './history'
import Session from './session'
const env = import.meta.env

let apiUrl = env.VITE_PROXY_ENDPOINT
apiUrl = apiUrl.slice(-1) !== '/' ? apiUrl + '/' : apiUrl
const ApiConnection = (withToken = true) => {
  let Api = axios.create({
    baseURL: apiUrl,
    headers: Session.token()
      ? { Authorization: withToken ? `Bearer ${Session.token()}` : undefined }
      : {},
  })

  Api.status = 0

  Api.interceptors.request.use((config) => {
    if (config.method === 'get') {
      config.params = transformToSnakeCase(config.params)
    } else {
      config.data = transformToSnakeCase(config.data)
    }
    return config
  })

  Api.interceptors.response.use(
    (response) => {
      let data = response.data
      Api.status = response.status
      Api.data = transformToCamelCase(data)

      return Api.data
    },
    (error) => {
      console.log({ error })
      let message = 'Sesión expirada'
      const response = error.response ?? {}
      let data = response.data ?? {}

      Api.status = response.status
      Api.data = transformToCamelCase(data)

      if (
        Api.status === 401 ||
        (Api.status === 403 && Api.data && Api.data.detail)
      ) {
        history.replace(`/?errorMessage=${message}&unsetUser=true`)
      }
      return Api.data
    }
  )

  return Api
}

const transformToSnakeCase = (data) => {
  if (Array.isArray(data)) {
    return data.map((item) => transformToSnakeCase(item))
  } else if (typeof data === 'object' && data !== null) {
    let transformedData = {}
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        let snakeCaseKey = toSnakeCase(key)
        transformedData[snakeCaseKey] = transformToSnakeCase(data[key])
      }
    }
    return transformedData
  } else {
    return data
  }
}

const transformToCamelCase = (data) => {
  if (Array.isArray(data)) {
    return data.map((item) => transformToCamelCase(item))
  } else if (typeof data === 'object' && data !== null) {
    let transformedData = {}
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        let camelCaseKey = toCamelCase(key)
        transformedData[camelCaseKey] = transformToCamelCase(data[key])
      }
    }
    return transformedData
  } else {
    return data
  }
}

const toSnakeCase = (str) => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

const toCamelCase = (str) => {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())
}

export default ApiConnection
