import { Card, CardContent, CardMedia, IconButton, Typography, Grid, Pagination } from '@mui/material'
import StarOutlineIcon from '@mui/icons-material/StarOutline'
import GradeIcon from '@mui/icons-material/Grade'
import '../../styles/farm/cardPagination.css'
import { useEffect, useReducer, useRef, useState } from 'react'

const SearchProportionBar = ({ counts, loading }) => {
  const purchasesRef = useRef(null)
  const sellsRef = useRef(null)
  const logisticsRef = useRef(null)

  useEffect(() => {
    const total = parseInt(counts[0].value) + parseInt(counts[1].value) + parseInt(counts[2].value)
    console.log({ total })
    if (total) {
      purchasesRef.current.style.width = (counts[0].value / total * 100) + '%'
      sellsRef.current.style.width = (counts[1].value / total * 100) + '%'
      logisticsRef.current.style.width = (counts[2].value / total * 100) + '%'
    } else {
      purchasesRef.current.style.width = '0%'
      sellsRef.current.style.width = '0%'
      logisticsRef.current.style.width = '0%'
    }
  }, [loading]);
  return (
    <Grid container>
      <Grid xs={12} style={{ height: '5px', display: 'flex', marginTop: 'auto', padding: 0 }}>
        <div ref={purchasesRef} style={{ height: '100%', width: '30%', backgroundColor: '#303030', transition: 'width 2s' }} />
        <div ref={sellsRef} style={{ height: '100%', width: '50%', backgroundColor: '#c3c3c3', transition: 'width 2s' }} />
        <div ref={logisticsRef} style={{ height: '100%', width: '20%', backgroundColor: '#6a6a6a', transition: 'width 2s' }} />
      </Grid>
    </Grid>)
}
export default SearchProportionBar