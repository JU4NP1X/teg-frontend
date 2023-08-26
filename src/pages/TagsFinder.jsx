import { Box, Grid } from '@mui/material'
import { useOutletContext } from 'react-router-dom'
import InputCard from '../components/finder/InputCard'
import TagsListCard from '../components/finder/TagsListCard'
import '../styles/finder/finder.css'

const TagsFinder = () => {
  const { open } = useOutletContext()

  return (
    <Box component={'main'}>
      <Grid container>
        <Grid item xs={12} md={8} sx={{ p: 2 }}>
          <InputCard />
        </Grid>
        <Grid item xs={12} md={4} sx={{ p: 2, display: 'inline-grid' }}>
          <TagsListCard />
        </Grid>
      </Grid>
    </Box>
  )
}
export default TagsFinder
