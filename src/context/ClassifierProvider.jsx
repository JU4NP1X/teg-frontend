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
  const { setErrorMessage, setSuccessMessage } = useNotification()
  const [showTable, setShowTable] = useState(true)
  const [onlyCategoriesDeprecad, setOnlyCategoriesDeprecad] = useState(false)
  const [loadingSaveDocument, setLoadingSaveDocument] = useState(false)
  const [loadingAuthorities, setLoadingAuthorities] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [initialCategoriesAdded, setInitalCategoriesAdded] = useState(false)
  const [search, setSearch] = useState('')
  const [searchDocument, setSearchDocument] = useState('')
  const [searchCategoryFilter, setSearchCategoryFilter] = useState('')
  const [loadingCategoriesOptions, setLoadingCategoriesOptions] =
    useState(false)
  const [categoriesOptions, setCategoriesOptions] = useState([])
  const [categoriesSelected, setCategoriesSelected] = useState([])
  const [loadingDocs, setLoadingDocs] = useState(false)
  const [page, setPage] = useState(0)
  const [authorities, setAuthorities] = useState([])
  const [authoritiesListFilter, setAuthoritiesListFilter] = useState([])
  const [categoriesListFilter, setCategoriesListFilter] = useState([])
  const [categories, setCategories] = useState([])
  const [authority, setAuthority] = useState(null)
  const [authorityFilter, setAuthorityFilter] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState(null)
  const [doc, setDoc] = useState(documentTemplate)
  const [docs, setDocs] = useState(docsTemplate)
  const [categoryToAdd, setCategoryToAdd] = useState(null)
  const [categoryAdded, setCategoryAdded] = useState(false)

  const getAuthorityList = async (active) => {
    setLoadingAuthorities(true)
    const api = ApiConnection()
    const data = await api.get('/categories/authorities/', {
      params: {
        ordering: 'id',
        excludeCounts: true,
        disabled: false,
        active,
      },
    })
    if (api.status < 400) {
      if (active !== undefined) setAuthorities(data.results)
      else setAuthoritiesListFilter(data.results)
    }
    setLoadingAuthorities(false)
  }

  const getCategoriesOptions = async (signal, isFilter = false) => {
    setLoadingCategoriesOptions(true)
    const api = ApiConnection()
    console.log({ authorityFilter })

    const data = await api.get('/categories/translations/', {
      params: {
        search: !isFilter ? search : searchCategoryFilter,
        language: 'es',
        ordering: 'name',
        authority: isFilter && authorityFilter ? authorityFilter.id : undefined,
      },
      signal, // Pasamos la señal del AbortController a la petición
    })
    if (api.status < 400) {
      if (isFilter) setCategoriesListFilter(data.results)
      else setCategoriesOptions(data.results)
      setLoadingCategoriesOptions(false)
    } else if (!signal.aborted) {
      setErrorMessage('Error al obtener las opciones de categorías.')
      setLoadingCategoriesOptions(false)
    }
  }

  const getDocList = async (signal) => {
    setLoadingDocs(true)
    const api = ApiConnection()
    const data = await api.get('/documents/list/', {
      params: {
        ordering: 'id',
        limit: 20,
        offset: page * 20,
        search: searchDocument,
        categories: categoryFilter ? categoryFilter.category.id : undefined,
        authorities: authorityFilter ? authorityFilter.id : undefined,
        deprecated: onlyCategoriesDeprecad ? onlyCategoriesDeprecad : undefined,
      },
      signal,
    })
    if (api.status < 400) {
      setDocs(data)
      setLoadingDocs(false)
    }
  }

  const getDoc = async (doc) => {
    const api = ApiConnection()
    const data = await api.get(`/documents/list/${doc.id}/`)
    if (api.status < 400) {
      setDoc(data)
    }
  }

  const deleteDoc = async (doc) => {
    const api = ApiConnection()
    const data = await api.delete(`/documents/list/${doc.id}/`)
    if (api.status < 400) {
      setSuccessMessage('Documento eliminado exitosamente')
      getDocList()
    } else setErrorMessage('Error al eliminar el documento')
  }

  const classify = async () => {
    setLoadingCategories(true)
    const api = ApiConnection()
    const data = await api.post('/categories/classify/', {
      title: doc.title,
      summary: doc.summary,
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
    setLoadingCategories(true)
    const api = ApiConnection()
    const data = await api.get(`/categories/list/`, {
      params: {
        treeId: categoryToAdd.category.treeId,
        authority:categoryToAdd.authority.id,
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
      setCategoryAdded(true)
      sortCategories(newCategories)
      setCategories(newCategories)
      setLoadingCategories(false)
    } else setLoadingCategories(false)
  }

  const saveDocument = async () => {
    setLoadingSaveDocument(true)
    const api = ApiConnection()
    if (doc.id)
      await api.put(`/documents/list/${doc.id}/`, {
        ...doc,
        categories: categoriesSelected,
      })
    else
      await api.post(`/documents/list/`, {
        ...doc,
        categories: categoriesSelected,
      })

    if (api.status < 400) {
      setSuccessMessage(
        `Documento ${doc.id ? 'modificado' : 'añadido'} exitosamente.`
      )
      setLoadingSaveDocument(false)
    } else
      setErrorMessage(
        `Error al ${doc.id ? 'modificar' : 'crear'} el documento.`
      )
    setLoadingSaveDocument(false)
  }

  useEffect(() => {
    const controller = new AbortController()
    getDocList(controller.signal)
    return () => {
      controller.abort()
    }
  }, [
    page,
    searchDocument,
    authorityFilter,
    categoryFilter,
    onlyCategoriesDeprecad,
  ])

  useEffect(() => {
    if (categoryToAdd && categoryToAdd.id) getCategory()
  }, [categoryToAdd])

  useEffect(() => {
    if (categoryAdded) {
      setCategoryAdded(false)
      setCategoriesSelected([...categoriesSelected, categoryToAdd.category.id])
      setCategoryToAdd(null)
    }
  }, [categories])

  useEffect(() => {
    const controller = new AbortController()
    getCategoriesOptions(controller.signal) // Guardamos la función de limpieza

    return () => {
      controller.abort()
    }
  }, [search])

  useEffect(() => {
    const controller = new AbortController()
    getCategoriesOptions(controller.signal, true) // Guardamos la función de limpieza

    return () => {
      controller.abort()
    }
  }, [authorityFilter, searchCategoryFilter])

  const getInitialCategories = async (categories) => {
    setLoadingCategories(true)
    const api = ApiConnection()
    const data = await api.get(`/categories/list/`, {
      params: {
        treeId: categories.map(({ treeId }) => treeId).join(','),
        deprecated: false,
      },
    })
    if (api.status < 400) {
      let categories = data.results
      sortCategories(categories)
      setCategories(categories)
      setInitalCategoriesAdded(true)
      setLoadingCategories(false)
    } else setLoadingCategories(false)
  }

  useEffect(() => {
    if (doc.id && doc.categories.length) {
      getInitialCategories(doc.category)
    }
  }, [doc.id])

  useEffect(() => {
    if (showTable) {
      getDocList()
      setDoc(documentTemplate)
      setCategories([])
      setCategoriesSelected([])
    } else getAuthorityList(true)
  }, [showTable])

  useEffect(() => {
    if (initialCategoriesAdded) {
      setCategoriesSelected(doc.categories)
      setInitalCategoriesAdded(false)
    }
  }, [initialCategoriesAdded])
  useEffect(() => {
    getAuthorityList()
  }, [])

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
        saveDocument,
        loadingSaveDocument,
        deleteDoc,
        searchDocument,
        setSearchDocument,
        authoritiesListFilter,
        authorityFilter,
        setAuthorityFilter,
        categoriesListFilter,
        categoryFilter,
        setCategoryFilter,
        searchCategoryFilter,
        setSearchCategoryFilter,
        onlyCategoriesDeprecad,
        setOnlyCategoriesDeprecad,
      }}
    >
      {children}
    </ClassifierContext.Provider>
  )
}

export { ClassifierProvider }

export default ClassifierContext
