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

const sortCategories = (newCategories) => {
  newCategories.forEach(({ children }) => {
    if (children && children.length) sortCategories(children)
  })

  newCategories.sort((a, b) => {
    let nameA = ''
    let nameB = ''
    if (a.translation) nameA = a.translation.name.toUpperCase()
    if (b.translation) nameB = b.translation.name.toUpperCase()

    if (nameA < nameB) {
      return -1
    }
    if (nameA > nameB) {
      return 1
    }
    return 0
  })
}
const ClassifierProvider = ({ children }) => {
  const { setErrorMessage } = useNotification()
  const [showTable, setShowTable] = useState(true)
  const [loadingAuthorities, setLoadingAuthorities] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [search, setSearch] = useState('')
  const [loadingCategoriesOptions, setLoadingCategoriesOptions] =
    useState(false)
  const [categoriesOptions, setCategoriesOptions] = useState([])
  const [categoriesSelected, setCategoriesSelected] = useState([])
  const [loadingDocs, setLoadingDocs] = useState(false)
  const [page, setPage] = useState(0)
  const [authorities, setAuthorities] = useState([])
  const [categories, setCategories] = useState([])
  const [authority, setAuthority] = useState(null)
  const [doc, setDoc] = useState(documentTemplate)
  const [docs, setDocs] = useState(docsTemplate)
  const [categoryToAdd, setCategoryToAdd] = useState(null)

  const getAuthorityList = async () => {
    setLoadingAuthorities(true)
    const api = ApiConnection()
    const data = await api.get('/categories/authorities/', {
      params: {
        ordering: 'id',
        exclude_counts: true,
      },
    })
    if (api.status < 400) {
      setAuthorities(data.results)
    }
    setLoadingAuthorities(false)
  }

  const getCategoriesOptions = async (signal) => {
    setLoadingCategoriesOptions(true)
    const api = ApiConnection()

    const data = await api.get('/categories/translations/', {
      params: {
        search,
        language: 'es',
        ordering: 'name',
      },
      signal, // Pasamos la señal del AbortController a la petición
    })
    if (api.status < 400) {
      setCategoriesOptions(data.results)
      setLoadingCategoriesOptions(false)
    } else if (!signal.aborted) {
      setErrorMessage('Error al obtener las opciones de categorías.')
      setLoadingCategoriesOptions(false)
    }
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
    if (api.status < 400) {
      setDocs(data)
    }
    setLoadingDocs(false)
  }

  const getDoc = async (doc) => {
    const api = ApiConnection()
    const data = await api.get(`/documents/list/${doc.id}/`)
    if (api.status < 400) {
      setDoc(data)
    }
  }

  const classify = async () => {
    setLoadingCategories(true)
    const api = ApiConnection()
    const data = await api.post('/categories/classify/', {
      title: document.titleImg,
      summary: document.summaryImg,
      authorityId: authority && authority.id ? authority.id : undefined,
    })
    if (api.status < 400) {
      let newCategories = [
        ...categories,
        ...data.filter(
          (category) => !categories.map(({ id }) => id).includes(category.id)
        ),
      ]
      sortCategories(newCategories)

      setCategories(newCategories)
    } else setErrorMessage('Error al clasificar el texto.')
    setLoadingCategories(false)
  }

  const getCategory = async () => {
    const api = ApiConnection()
    const data = await api.get(`/categories/list/`, {
      params: {
        treeId: categoryToAdd.category.treeId,
        deprecated: false,
      },
    })
    if (api.status < 400) {
      let newCategories = [
        ...categories,
        ...data.results.filter(
          (category) => !categories.map(({ id }) => id).includes(category.id)
        ),
      ]
      sortCategories(newCategories)
      setCategories(newCategories)
      setCategoriesSelected([...categoriesSelected, categoryToAdd.category.id])
      setCategoryToAdd(null)
    }
  }

  useEffect(() => {
    getAuthorityList()
    getDocList()
  }, [])

  useEffect(() => {
    getDocList()
  }, [page])

  useEffect(() => {
    if (categoryToAdd && categoryToAdd.id) getCategory()
  }, [categoryToAdd])

  useEffect(() => {
    const controller = new AbortController()
    getCategoriesOptions(controller.signal) // Guardamos la función de limpieza

    return () => {
      controller.abort()
    }
  }, [search])

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
        getDoc,
        loadingCategoriesOptions,
        categoriesOptions,
        setSearch,
        setCategoryToAdd,
        categoriesSelected,
        setCategoriesSelected,
      }}
    >
      {children}
    </ClassifierContext.Provider>
  )
}

export { ClassifierProvider }

export default ClassifierContext
