import { Grid } from '@mui/material'
import '../../styles/finder/finder.css'
import InputCard from './InputCard'
import TagsListCard from './TagsListCard'

const DocumentManager = () => {
  return (
    <Grid container>
      <Grid item xs={12} md={8} sx={{ pr: 2 }}>
        <InputCard />
      </Grid>
      <Grid item xs={12} md={4} sx={{ pl: 2, display: 'inline-grid' }}>
        <TagsListCard />
      </Grid>
    </Grid>
  )
}
export default DocumentManager
