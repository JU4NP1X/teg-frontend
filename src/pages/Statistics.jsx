import { Typography, Grid, Box, Tooltip, Card, CardContent, Select, InputLabel, MenuItem, FormControl, TextField, } from '@mui/material'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import GeneraLStats from '../components/statistics/GeneralStats';
import ReportStats from '../components/statistics/ReportStats';
import UserStats from '../components/statistics/UserStats';
const Statistics = () => {


	return (
		<Grid container style={{ padding: 12 }}>
		<Grid sx={12} style={{ width: '100%' }}>
			<Card >
				<CardContent>
					<GeneraLStats/>
				</CardContent>
			</Card>

		</Grid>
			<Grid sx={12} style={{ width: '100%', marginTop: '20px' }}>
				<Card >
					<CardContent>
						<UserStats/>
					</CardContent>
				</Card>

			</Grid>
			<Grid sx={12} style={{ width: '100%', marginTop: '20px' }}>
				<Card >
					<CardContent>
						<ReportStats/>
					</CardContent>
				</Card>

			</Grid>
		</Grid>
	)
}
export default Statistics