import { Grid } from '@mui/material'
import '../../styles/finder/finder.css'
import InputCard from './InputCard'
import TagsListCard from './TagsListCard'

const TagsFinder = () => {
  return (
    <Grid container>
      <Grid item xs={12} md={8} sx={{ p: 2 }}>
        <InputCard />
      </Grid>
      <Grid item xs={12} md={4} sx={{ p: 2, display: 'inline-grid' }}>
        <TagsListCard />
      </Grid>
    </Grid>
  )
}
export default TagsFinder
