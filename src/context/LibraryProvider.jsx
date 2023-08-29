import React, { createContext, useEffect, useState } from 'react'
import ApiConnection from '../utils/apiConnection'

const LibraryContext = createContext()
const LibraryProvider = ({ children }) => {
  const [apiFilters, setApiFilters] = useState([])
  const [search, setSearch] = useState('')
  const [filterSearch, setFilterSearch] = useState('')
  const [authorityList, setAuthorityList] = useState([])
  const [selectedAuthority, setSelectedAuthority] = useState(null)
  const [loadingFilters, setLoadingFilters] = useState(false)
  const [loadingAuthorities, setLoadingAuthorities] = useState(false)

  const [filters, setFilters] = useState([])

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
        },
        signal,
      })
      if (api.status === 200) {
        setApiFilters(data.results)
        setLoadingFilters(false)
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
        filters,
        setFilters,
        search,
        setSearch,
      }}
    >
      {children}
    </LibraryContext.Provider>
  )
}
export { LibraryProvider }

export default LibraryContext
