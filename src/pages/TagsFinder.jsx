import { Typography, Grid, Box, Tooltip, TextField, Card, CardContent, CardActions, Button } from '@mui/material'
import { useLayoutEffect, useRef, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import useSearch from '../hooks/useSearch'
import ApiConnection from '../utils/apiConnection'
import SimpleBar from 'simplebar-react'
import { Search, Upload } from '@mui/icons-material'
import InputCard from '../components/finder/InputCard'
import TagsListCard from '../components/finder/TagsListCard'
import '../styles/finder/finder.css'

const TagsFinder = () => {

	const { open } = useOutletContext()


	return (
		<Box
			component='main'
		>
			<Grid container>

				<Grid item xs={8} sx={{ p: 2}}>
					<InputCard />
				</Grid>
				<Grid item xs={4} sx={{ p: 2, display: 'inline-grid', }}>
					<TagsListCard />
				</Grid>
			</Grid>
		</Box >
	)
}
export default TagsFinder