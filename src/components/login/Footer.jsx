import { Grid, Link, Typography } from '@mui/material'
import '../../styles/login/footer.css'
import { isMobile } from '../../utils/utils'

export function Footer(props) {
  return (
    <Grid container className='footer-container' style={{ marginTop: 'auto', backgroundColor: 'white' }}>
      <Grid container sx={{ width: isMobile()? 500: 1000, justifyContent: 'center' }}>
        <img className='logo_febeca footer-img' />
        <img className='logo_beval footer-img' />
        <img className='logo_sillaca footer-img' />
        <img className='logo_cofersa footer-img' />
        <img className='logo_mundipartes footer-img' />
        <img className='logo_olo footer-img' />
      </Grid >
    </Grid >
  )
}