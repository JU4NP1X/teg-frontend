import { createContext, useEffect, useState } from 'react'
import useNotification from '../hooks/useNotification'
import ApiConnection from '../utils/apiConnection'

const ClassifierContext = createContext()
const ClassifierProvider = ({ children }) => {
  const { setErrorMessage } = useNotification()
  const [loadingAuthorities, setLoadingAuthorities] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [authorities, setAuthorities] = useState([])
  const [authority, setAuthority] = useState(null)
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [categories, setCategories] = useState([])

  const getAuthorityList = async () => {
    setLoadingAuthorities(true)
    const api = ApiConnection()
    const data = await api.get('/categories/authorities/', {
      params: {
        ordering: 'id',
        exclude_counts: true,
      },
    })
    if (api.status === 200) {
      setAuthorities(data.results)
    }
    setLoadingAuthorities(false)
  }
  const classify = async () => {
    setLoadingCategories(true)
    const api = ApiConnection()
    const data = await api.post('/categories/classify/', {
      title,
      summary,
      authority: authority && authority.id ? authority.id : undefined,
    })
    if (api.status === 200) {
      addExpandNSelectedOptions(data.results, true)
      setCategories(data.results)
    } else setErrorMessage('Error al clasificar el texto.')
    setLoadingCategories(false)
  }

  const addExpandNSelectedOptions = (categories, root = false) => {
    categories.map((cat) => {
      cat.expanded = root
      cat.selected = root
      addExpandNSelectedOptions(cat.childs)
    })
  }

  useEffect(() => {
    getAuthorityList()
  }, [])

  return (
    <ClassifierContext.Provider
      value={{
        loadingAuthorities,
        authorities,
        title,
        setTitle,
        summary,
        setSummary,
        categories,
        setCategories,
        classify,
        loadingCategories,
        authority,
        setAuthority,
      }}
    >
      {children}
    </ClassifierContext.Provider>
  )
}

export { ClassifierProvider }

export default ClassifierContext
