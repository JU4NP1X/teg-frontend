import { createContext, useEffect, useState } from 'react'
import useNotification from '../hooks/useNotification'
import ApiConnection from '../utils/apiConnection'

const tagsTemplate = {
  categories: [],
  subjectHeading: [],
  authorityList: [],
}

const tagInfoTemplate = {
  title: '',
  englishTrans: '',
  group: {},
  relatedConcepts: [],
  uri: '',
}

const TagsFinderProviderContext = createContext()
const TagsFinderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [isText, setIsText] = useState(true)
  const [text, setText] = useState(true)
  const [tagList, setTagList] = useState(tagsTemplate)
  const [getTags, setGetTags] = useState(false)
  const [showTagInfo, setShowTagInfo] = useState(false)
  const [tagInfo, setTagInfo] = useState(tagInfoTemplate)

  const { setErrorMessage } = useNotification()

  const Api = ApiConnection()

  const getTagsFromApi = async ({ repId }) => {
    try {
      setLoading(true)
      const tagList = await Api.post(`tags`, text)
      setTagList(tagList)
    } catch (error) {
      console.log(error)
      setErrorMessage('Error al traer el vocabulario controlado.')
    }
    setLoading(false)
  }

  //Get Companies and roles
  useEffect(() => {
    if (getTags) getTagsFromApi()
  }, [getTags])

  return (
    <TagsFinderProviderContext.Provider
      value={{
        loading,
        text,
        setText,
        isText,
        setIsText,
        tagList,
        getTags,
        setGetTags,
        showTagInfo,
        setShowTagInfo,
        tagInfo,
        setTagInfo,
      }}
    >
      {children}
    </TagsFinderProviderContext.Provider>
  )
}

export { TagsFinderProvider }

export default TagsFinderProviderContext
