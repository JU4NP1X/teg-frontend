import { useState, useEffect, createContext, useReducer } from 'react'
import { useNavigate } from 'react-router-dom'
import ApiConnection from '../utils/apiConnection'
import { isMobile } from '../utils/utils'

const getTop3ReportsCount = (json) => {
  let top = []
  for (const key in json)
    top.push({ key, value: json[key] })
  top.sort((a, b) => b.value - a.value)

  const topThreeValues = top.slice(0, 3)
  let topThreeValuesInOrder = []
  for (const index in json)
    topThreeValues.map(({ key, value }) => {
      if (index === key)
        topThreeValuesInOrder.push({ key, value })
    })

  return topThreeValuesInOrder
}


const SearchContext = createContext()
const SearchProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [favLoading, setFavLoading] = useState(false)
  const [freqLoading, setFreqLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [companiesList, setCompaniesList] = useState([])
  const [categoriesList, setCategoriesList] = useState([])
  const [cardList, setCardList] = useState([])
  const [favCardList, setFavCardList] = useState([])
  const [freqCardList, setFreqCardList] = useState([])
  const [cancelToken, setCancelToken] = useState(null)
  const [cancelFavToken, setCancelFavToken] = useState(null)
  const [cancelFreqToken, setCancelFreqToken] = useState(null)
  const [page, setPage] = useState(1)
  const [favPage, setFavPage] = useState(1)
  const [freqPage, setFreqPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [favTotalPages, setFavTotalPages] = useState(0)
  const [freqTotalPages, setFreqTotalPages] = useState(0)
  const [countPurchases, setCountPurchases] = useState(0)
  const [counts, setCounts] = useState([
    { key: '', value: 0 },
    { key: '', value: 0 },
    { key: '', value: 0 },
  ])
  const [countSells, setCountSells] = useState(0)
  const [countLogistics, setCountLogistics] = useState(0)
  const [refresh, setRefresh] = useState(false)
  const [favFilter, setFavFilter] = useState(false)
  const [constructionFilter, setConstructionFilter] = useState(false)
  const [recentFilter, setRecentFilter] = useState(false)
  const [refreshAll, setRefreshAll] = useState(false)
  const [paginationType, setPaginationType] = useState('CARD')
  const [behaviorList, setBehaviorList] = useState(['STATIC', 'DYNAMIC'])
  const [cardSize, setCardSize] = useState('MEDIUM')

  const getReports = async (favorite, frequent, page) => {
    const cancel = new AbortController()
    if (favorite) {
      setFavLoading(true)
      if (cancelFavToken) cancelFavToken.abort()
      setCancelFavToken(cancel)
    } else if (frequent) {
      setFreqLoading(true)
      if (cancelFreqToken) cancelFreqToken.abort()
      setCancelFreqToken(cancel)
    } else {
      setLoading(true)
      if (cancelToken) cancelToken.abort()
      setCancelToken(cancel)
    }
    const Api = ApiConnection()
    const result = await Api.post('/reports/farm', {
      page,
      rows: isMobile() ? 8 : 16,
      search,
      companies: companiesList,
      categories: categoriesList,
      behavior: behaviorList,
      constructionFilter,
      recentFilter,
      frequent,
      favorite
    }, { signal: cancel.signal })

    if (favorite) {
      if (Api.status === 200) {
        setFavCardList(result.reports)
        setFavTotalPages(result.counts.totalPages)
        if (result.counts.totalPages < page && result.counts.totalPages)
          setFavPage(result.counts.totalPages)
      }
      setFavLoading(false)
      setCancelFavToken(null)
    } else if (frequent) {
      if (Api.status === 200) {
        setFreqCardList(result.reports)
        setFreqTotalPages(result.counts.totalPages)
        if (result.counts.totalPages < page && result.counts.totalPages)
          setFreqPage(result.counts.totalPages)
      }
      setFreqLoading(false)
      setCancelFreqToken(null)
    } else {

      if (Api.status === 200) {
        setCardList(result.reports)
        setTotalPages(result.counts.totalPages)
        delete result.counts.total
        delete result.counts.totalPages
        setCounts([...(getTop3ReportsCount(result.counts))])
        if (result.numOfPages < page && result.numOfPages)
          setPage(result.numOfPages)
        setLoading(false)
      }
      setCancelToken(null)
    }
  }

  useEffect(() => {
    if (!recentFilter) {
      if (page !== 1)
        setPage(1)
      else
        getReports(false, false, 1)

      if (favPage !== 1)
        setFavPage(1)
      else
        getReports(true, false, 1)
    }
    if (freqPage !== 1)
      setFreqPage(1)
    else
      getReports(false, true, 1)
  }, [companiesList, categoriesList, search, behaviorList, constructionFilter, recentFilter])

  useEffect(() => {
    if (refresh) {
      getReports(true, false, favPage)
      getReports(false, true, freqPage)
      setRefresh(false)
    }
  }, [refresh])
  useEffect(() => {
    if (refreshAll) {
      getReports(true, false, favPage)
      getReports(false, true, freqPage)
      getReports(false, false, page)
      setRefreshAll(false)
    }
  }, [refreshAll])
  useEffect(() => {
    getReports(false, false, page)
  }, [page])

  useEffect(() => {
    getReports(true, false, favPage)
  }, [favPage])

  useEffect(() => {
    getReports(false, true, freqPage)
  }, [freqPage])

  return (
    <SearchContext.Provider
      value={{
        loading,
        favLoading,
        cardList,
        setCardList,
        search,
        setSearch,
        companiesList,
        setCompaniesList,
        totalPages,
        setTotalPages,
        counts,
        countPurchases,
        setCountPurchases,
        countSells,
        setCountSells,
        countLogistics,
        setCountLogistics,
        page,
        setPage,
        favPage,
        setFavPage,
        categoriesList,
        setCategoriesList,
        favCardList,
        setFavCardList,
        favTotalPages,
        setFavTotalPages,
        setRefresh,
        setRefreshAll,
        behaviorList,
        setBehaviorList,
        paginationType,
        setPaginationType,
        favFilter,
        setFavFilter,
        constructionFilter,
        setConstructionFilter,
        recentFilter,
        setRecentFilter,
        cardSize,
        setCardSize,
        setFreqTotalPages,
        freqTotalPages,
        setFreqPage,
        freqPage,
        setFreqCardList,
        freqCardList,
        setFreqLoading,
        freqLoading
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export {
  SearchProvider
}

export default SearchContext