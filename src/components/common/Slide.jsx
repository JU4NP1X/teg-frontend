import { Collapse } from '@mui/material'
import React, { useEffect, useState } from 'react'

const Slide = ({ changed = false, children, setChanged }) => {
  const [currentComponent, setCurrentComponent] = useState(children)
  const [isEntering, setIsEntering] = useState(false)
  const [isFirstTime, setIsFirstTime] = useState(false)

  useEffect(() => {
    if (changed && !isFirstTime) {
      setChanged(false)
      setIsEntering(true)

      setTimeout(() => {
        setCurrentComponent(children)
        setIsEntering(false)
      }, 500)
    } else {
      setIsFirstTime(false)
    }
  }, [children.key])

  return <Collapse in={!isEntering}>{currentComponent}</Collapse>
}

export default Slide
