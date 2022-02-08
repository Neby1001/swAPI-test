import axios from 'axios'
import { DateTime } from 'luxon'

const state = {
	results: [],
	resultsCount: 0,
	doingSearch: false,
	isLoading: false,
	hidePagination: false,
	currentPage: 1
}

const mutations = {
	SET_RESULTS (state, payload) {
		if (payload) {
			// Format our dates & numbers nicely
			payload?.results?.map((entry) => {
				entry.created = DateTime.fromISO(entry.created).toFormat('dd LLL yyyy HH:mm:ss')
				entry.edited = DateTime.fromISO(entry.edited).toFormat('dd LLL yyyy HH:mm:ss')
				entry.mass = entry.mass !== 'unknown' ? parseFloat(entry.mass.replace(/,/g, '')) : 'unknown'
				entry.height = entry.height !== 'unknown' ? parseFloat(entry.height.replace(/,/g, '')) : 'unknown'
				return entry
			})

			state.results = payload?.results
			state.resultsCount = payload?.count
		} else {
			state.results = []
		}
	},
	SORT_RESULTS (state, payload) {
		let swapiData = state.results
		if (payload?.sortBy) {
			if (payload.sortBy === 'height' || payload.sortBy === 'mass') {
				const unusualSwapiData = swapiData.filter((entry) => entry[payload.sortBy] === 'unknown') // take a copy of our unknowns before we filter them out
				swapiData = swapiData.filter((entry) => entry[payload.sortBy] !== 'unknown')

				payload.descending ? swapiData.sort((a, b) => a[payload.sortBy] - b[payload.sortBy]) : swapiData.sort((a, b) => b[payload.sortBy] - a[payload.sortBy]) // sort by our numbers
				swapiData = [...swapiData, ...unusualSwapiData] // when sorting we'll put "unknown"s at the end
			} else {
				payload.descending ? swapiData.sort((a, b) => a[payload.sortBy].localeCompare(b[payload.sortBy])) : swapiData.sort((a, b) => b[payload.sortBy].localeCompare(a[payload.sortBy]))
			}
		}
		state.results = swapiData
	},
	SET_SEARCH_STATUS (state, payload) {
		state.doingSearch = payload
	},
	SET_LOADING_STATE (state, payload) {
		state.isLoading = payload
	},
	SET_HIDE_PAGINATION_STATE (state, payload) {
		state.hidePagination = payload
	},
	SET_CURRENT_PAGE (state, payload) {
		state.currentPage = payload
	}
}

const actions = {
	async getResults ({ commit }, page) {
		/*
		Get our results, API only returns 10 at a time per page, did think about loading all the data with multiple requests but wouldn't be efficient
		and if new data got added would have to account for that so easier to get 10 per page and works nicely with the pagination in quasar
		*/
		try {
			commit('SET_LOADING_STATE', true)
			const { data } = await axios.get(`https://swapi.dev/api/people?page=${page.page}`)
			commit('SET_CURRENT_PAGE', page.page)
			commit('SET_RESULTS', data)
			commit('SET_LOADING_STATE', false)
		} catch (e) {
			console.error(e)
			commit('SET_CURRENT_PAGE', page.page)
			commit('SET_RESULTS', false)
			commit('SET_LOADING_STATE', false)
		}
	},
	async doSearch ({ commit }, query) {
		/*
		Do a search using the API search query param
		*/
		try {
			commit('SET_LOADING_STATE', true)
			const { data } = await axios.get(`https://swapi.dev/api/people/?search=${query.query}`)
			commit('SET_RESULTS', data)
			commit('SET_LOADING_STATE', false)
		} catch (e) {
			console.error(e)
			commit('SET_RESULTS', false)
			commit('SET_LOADING_STATE', false)
		}
	},
	doSort ({ commit }, { sortBy, descending }) {
		commit('SORT_RESULTS', { sortBy, descending })
	},
	setSearchStatus ({ commit }, searching) {
		commit('SET_SEARCH_STATUS', searching?.searching)
		commit('SET_HIDE_PAGINATION_STATE', searching?.searching)
	},
	setLoading ({ commit }, loading) {
		commit('SET_LOADING_STATE', loading?.state)
	},
	setHidePagination ({ commit }, hidePagination) {
		commit('SET_HIDE_PAGINATION_STATE', hidePagination?.state)
	}
}

const getters = {
	allResults: (state) => state.results,
	getCount: (state) => state.resultsCount,
	isCurrentlySearching: (state) => state.doingSearch,
	getLoadingState: (state) => state.isLoading,
	hidePagination: (state) => state.hidePagination,
	currentPage: (state) => state.currentPage
}

export default {
	namespaced: true,
	getters,
	mutations,
	actions,
	state
}
