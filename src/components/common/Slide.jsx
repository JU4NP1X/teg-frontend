import { Collapse } from '@mui/material'
import React, { useEffect, useState } from 'react'

const Slide = ({ changed = false, children, setChanged }) => {
  const [currentComponent, setCurrentComponent] = useState(children)
  const [isEntering, setIsEntering] = useState(false)

  useEffect(() => {
    if (changed) {
      setChanged(false)
      setIsEntering(true)

      const transitionTimeout = setTimeout(() => {
        setCurrentComponent(children)
        setIsEntering(false)
      }, 500)

      return () => clearTimeout(transitionTimeout)
    }
  }, [changed])

  return <Collapse in={!isEntering}>{currentComponent}</Collapse>
}

export default Slide
