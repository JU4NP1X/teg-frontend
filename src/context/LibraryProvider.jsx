import React, { createContext, useEffect, useState } from 'react'
import ApiConnection from '../utils/apiConnection'

const documentsTemplate = {
  count: 0,
  next: null,
  previous: null,
  results: [],
}

const LibraryContext = createContext()
const LibraryProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [documents, setDocuments] = useState(documentsTemplate)
  const [selectedFilters, setSelectedFilters] = useState([])
  const [apiFilters, setApiFilters] = useState([])
  const [search, setSearch] = useState('')
  const [filterSearch, setFilterSearch] = useState('')
  const [authorityList, setAuthorityList] = useState([])
  const [selectedAuthority, setSelectedAuthority] = useState(null)
  const [loadingFilters, setLoadingFilters] = useState(false)
  const [loadingDocuments, setLoadingDocuments] = useState(false)
  const [loadingAuthorities, setLoadingAuthorities] = useState(false)

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
      if (api.status === 200) {
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
            .map(({ category }) => category)
            .toString(),
          offset: (currentPage - 1) * 20,
        },
        signal,
      })
      if (api.status === 200) {
        if (!data.count) setCurrentPage(1)
        setDocuments(data)
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
        },
      })
      if (api.status === 200) {
        setAuthorityList(data.results)
        setLoadingAuthorities(false)
      }
    } catch (error) {
      console.error('Error al obtener la lista de autoridad:', error)
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
        setDocuments,
        currentPage,
        setCurrentPage,
        loadingDocuments,
        setLoadingDocuments,
      }}
    >
      {children}
    </LibraryContext.Provider>
  )
}
export { LibraryProvider }

export default LibraryContext
