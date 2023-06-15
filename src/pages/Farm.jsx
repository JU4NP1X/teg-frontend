import { Typography, Grid, Box, Tooltip, } from '@mui/material'
import { useLayoutEffect, useRef, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import CardListPagination from '../components/farm/CardListPagination'
import ReportListPagination from '../components/__common/ReportListPagination'
import SearchCard from '../components/farm/SearchCard'
import useSearch from '../hooks/useSearch'
import ApiConnection from '../utils/apiConnection'
import SimpleBar from 'simplebar-react'

const Farm = () => {

	const { open } = useOutletContext()
	const {
		loading,
		favLoading,
		freqLoading,
		totalPages,
		favTotalPages,
		freqTotalPages,
		cardList,
		favCardList,
		freqCardList,
		page,
		setPage,
		search,
		setSearch,
		favPage,
		freqPage,
		setFavPage,
		setFreqPage,
		countPurchases,
		countSells,
		countLogistics,
		setRefresh,
		paginationType,
		setPaginationType,
		cardSize,
		setCardSize,
		favFilter,
		recentFilter,
		setRefreshAll,
		counts
	} = useSearch()


	return (
		<>

			<SearchCard
				counts={counts}
				setSearch={setSearch}
				loading={loading}
				paginationType={paginationType}
				setPaginationType={setPaginationType}
				setCardSize={setCardSize}
				cardSize={cardSize}
				setRefreshAll={setRefreshAll}
				setPage={setPage}
			/>
			<SimpleBar style={{
				flexGrow: 1,
				height: 'calc(100vh - 135px)',
				overflow: 'auto',
			}

			}>
				<Box
					component='main'
				>
					<div className='farm-reports-container' style={{ paddingLeft: '20px', width: '100%' }}>
						{!favFilter && freqCardList && freqCardList.length ?
							<div style={{ marginBottom: 15 }}>
								<Grid container style={{ marginBottom: 10 }}>
									<Tooltip title='Lista de reportes que haz visualizado frecuentemente'>
										<Typography variant='h6' className='layout-not-select'>
											<b>Frecuentes</b>
										</Typography>
									</Tooltip>
								</Grid>

								{paginationType === 'CARD' ?
									<CardListPagination cardList={freqCardList} numOfPages={freqTotalPages} pageChange={setFreqPage} isFreq={true} page={freqPage} loading={freqLoading} setRefreshAll={setRefreshAll} cardSize={cardSize} /> :
									<ReportListPagination list={freqCardList} numOfPages={freqTotalPages} pageChange={setFreqPage} page={freqPage} isFreq={true} loading={freqLoading} setRefreshAll={setRefreshAll} />
								}

							</div> : <></>
						}
						{!recentFilter && favCardList && favCardList.length ?
							<div style={{ marginBottom: 15 }}>
								<Grid container>
									<Tooltip title='Lista de reportes que haz agregado a favoritos'>
										<Typography variant='h6' className='layout-not-select'>
											<b>Favoritos</b>
										</Typography>
									</Tooltip>
								</Grid>

								{paginationType === 'CARD' ?
									<CardListPagination cardList={favCardList} numOfPages={favTotalPages} pageChange={setFavPage} isFav={true} page={favPage} loading={favLoading} setRefreshAll={setRefreshAll} cardSize={cardSize} /> :
									<ReportListPagination list={favCardList} numOfPages={favTotalPages} pageChange={setFavPage} page={favPage} isFav={true} loading={favLoading} setRefreshAll={setRefreshAll} />
								}

								</div> : <></>
						}

								{!favFilter && !recentFilter ?
									<>
										<Grid container>
											<Tooltip title='Lista de reportes generales a los que tienes acceso'>
												<Typography variant='h6' className='layout-not-select'>
													<b>Reportes generales</b>
												</Typography>
											</Tooltip>
										</Grid>
										{paginationType === 'CARD' ?
											<CardListPagination cardList={cardList} numOfPages={totalPages} pageChange={setPage} page={page} loading={loading} setRefreshAll={setRefreshAll} cardSize={cardSize} /> :
											<ReportListPagination list={cardList} numOfPages={totalPages} pageChange={setPage} page={page} loading={loading} setRefreshAll={setRefreshAll} />
										}
									</> : <></>}
							</div>
				</Box>
			</SimpleBar>
		</>
	)
}
export default Farm