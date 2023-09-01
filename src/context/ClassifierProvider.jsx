import { createContext, useEffect, useState } from 'react'
import useNotification from '../hooks/useNotification'
import ApiConnection from '../utils/apiConnection'

const ClassifierContext = createContext()

const docsTemplate = {
  count: 0,
  next: null,
  previous: null,
  results: [],
}
const documentTemplate = {
  title: '',
  summary: '',
  categories: [],
  pdf: '',
  img: '',
}
const ClassifierProvider = ({ children }) => {
  const { setErrorMessage } = useNotification()
  const [showTable, setShowTable] = useState(true)
  const [loadingAuthorities, setLoadingAuthorities] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [loadingDocs, setLoadingDocs] = useState(false)
  const [page, setPage] = useState(0)
  const [authorities, setAuthorities] = useState([])
  const [categories, setCategories] = useState([])
  const [authority, setAuthority] = useState(null)
  const [doc, setDoc] = useState(documentTemplate)
  const [docs, setDocs] = useState(docsTemplate)

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

  const getDocList = async () => {
    setLoadingDocs(true)
    const api = ApiConnection()
    const data = await api.get('/documents/list/', {
      params: {
        ordering: 'id',
        limit: 20,
        offset: page * 20,
      },
    })
    if (api.status === 200) {
      setDocs(data)
    }
    setLoadingDocs(false)
  }

  const classify = async () => {
    setLoadingCategories(true)
    const api = ApiConnection()
    const data = await api.post('/categories/classify/', {
      title: document.titleImg,
      summary: document.summaryImg,
      authority: authority && authority.id ? authority.id : undefined,
    })
    if (api.status === 200) {
      addExpandNSelectedOptions(data.results, true)
      setCategories([
        ...categories,
        ...data.filter((category) => !categories.includes(category)),
      ])
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
    getDocList()
  }, [])

  useEffect(() => {
    getDocList()
  }, [page])

  return (
    <ClassifierContext.Provider
      value={{
        loadingAuthorities,
        authorities,
        classify,
        loadingCategories,
        authority,
        setAuthority,
        doc,
        setDoc,
        categories,
        setCategories,
        showTable,
        setShowTable,
        docs,
        setDocs,
        loadingDocs,
        setLoadingDocs,
        page,
        setPage,
      }}
    >
      {children}
    </ClassifierContext.Provider>
  )
}

export { ClassifierProvider }

export default ClassifierContext
