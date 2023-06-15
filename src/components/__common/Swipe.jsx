import React from 'react';
import { useState } from 'react';

const minDistance = 150

const Swipe = ({ onSwipeRight, onSwipeLeft, children, style = {} }) => {
  const [swipedRight, setSwipedRight] = useState(false)
  const [swipedLeft, setSwipedLeft] = useState(false)
  const [swiping, setSwiping] = useState(false)
  const [position, setPosition] = useState({})

  const TouchStartHandler = (e) => {
    const touch = e.touches[0]
    setPosition({ x: touch.clientX })
    setSwipedRight(false)
    setSwipedLeft(false)
  }

  const TouchMoveHandler = (e) => {
    if (e.changedTouches && e.changedTouches.length) {
      setSwiping(true)
    }
  }

  const TouchEndHandler = (e) => {
    const touch = e.changedTouches[0]
    const absX = touch.clientX - position.x

    if (swiping && absX > minDistance) {
      onSwipeRight && onSwipeRight(swipedRight)
      setSwipedRight(true)
      console.log({ onSwipeRight })
    } else if (swiping && absX < - minDistance) {
      onSwipeLeft && onSwipeLeft(swipedLeft)
      setSwipedLeft(true)
    }
    setPosition({})
  }

  return (

    <div
      style={style}
      onTouchStart={TouchStartHandler}
      onTouchMove={TouchMoveHandler}
      onTouchEnd={TouchEndHandler}>
      {children}
    </div>
  )
}



export default Swipe