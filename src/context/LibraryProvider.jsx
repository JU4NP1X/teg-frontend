import React, { createContext, useEffect, useState } from 'react'
import ApiConnection from '../utils/apiConnection'

const docsTemplate = {
  count: 0,
  next: null,
  previous: null,
  results: [],
}
const docTemplate = {
  title: '',
  summary: '',
  categories: [],
  pdf: '',
  img: '',
}

const LibraryContext = createContext()
const LibraryProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [documents, setDocs] = useState(docsTemplate)
  const [selectedFilters, setSelectedFilters] = useState([])
  const [apiFilters, setApiFilters] = useState([])
  const [search, setSearch] = useState('')
  const [filterSearch, setFilterSearch] = useState('')
  const [authorityList, setAuthorityList] = useState([])
  const [selectedAuthority, setSelectedAuthority] = useState(null)
  const [loadingFilters, setLoadingFilters] = useState(false)
  const [loadingDocuments, setLoadingDocuments] = useState(false)
  const [loadingAuthorities, setLoadingAuthorities] = useState(false)
  const [doc, setDoc] = useState(docTemplate)

  const fetchFilters = async (signal) => {
    try {
      setLoadingFilters(true)
      const api = ApiConnection()
      const data = await api.get('categories/translations/', {
        params: {
          search: filterSearch,
          language: 'es',
          ordering: 'name',
          authority: selectedAuthority?.id,
          exclude: selectedFilters.map(({ id }) => id).toString(),
          limit: 100 - selectedFilters.length,
        },
        signal,
      })
      if (api.status < 400) {
        setApiFilters(data.results)
        setLoadingFilters(false)
      } else setLoadingFilters(false)
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Búsqueda de filtros cancelada')
      } else {
        console.error('Error al obtener los filtros:', error)
      }
    }
  }

  const fetchDocuments = async (signal) => {
    try {
      setLoadingDocuments(true)
      const api = ApiConnection()
      const data = await api.get('documents/list/', {
        params: {
          search: search,
          limit: 20,
          categories: selectedFilters
            .map(({ category }) => category.id)
            .toString(),
          offset: (currentPage - 1) * 20,
        },
        signal,
      })
      if (api.status < 400) {
        if (!data.count) setCurrentPage(1)
        setDocs(data)
        setLoadingDocuments(false)
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Búsqueda de filtros cancelada')
      } else {
        console.error('Error al obtener los filtros:', error)
      }
    }
  }

  const fetchAuthorityList = async () => {
    try {
      setLoadingAuthorities(true)
      const api = ApiConnection()
      const data = await api.get('categories/authorities/', {
        params: {
          ordering: 'id',
          excludeCounts: true,
          disabled: false,
        },
      })
      if (api.status < 400) {
        setAuthorityList(data.results)
        setLoadingAuthorities(false)
      }
    } catch (error) {
      console.error('Error al obtener la lista de autoridad:', error)
    }
  }

  const getDoc = async (doc) => {
    const api = ApiConnection()
    const data = await api.get(`/documents/list/${doc.id}/`)
    if (api.status < 400) {
      setDoc(data)
    }
  }

  useEffect(() => {
    let abortController = new AbortController()

    fetchFilters(abortController.signal)

    return () => {
      abortController.abort()
    }
  }, [filterSearch, selectedAuthority])

  useEffect(() => {
    fetchAuthorityList()
  }, [])

  useEffect(() => {
    fetchDocuments()
  }, [search, selectedFilters, currentPage])
  return (
    <LibraryContext.Provider
      value={{
        filterSearch,
        setFilterSearch,
        loadingAuthorities,
        setLoadingAuthorities,
        loadingFilters,
        setLoadingFilters,
        selectedAuthority,
        setSelectedAuthority,
        authorityList,
        setAuthorityList,
        apiFilters,
        setApiFilters,
        selectedFilters,
        setSelectedFilters,
        search,
        setSearch,
        documents,
        setDocs,
        currentPage,
        setCurrentPage,
        loadingDocuments,
        setLoadingDocuments,
        doc,
        setDoc,
        getDoc,
      }}
    >
      {children}
    </LibraryContext.Provider>
  )
}
export { LibraryProvider }

export default LibraryContext
