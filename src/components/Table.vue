<template>
	<div class="q-pa-md">
		<q-table
			title="Star Wars Index"
			:loading="isLoading"
			:data="resultData"
			row-key="name"
			:columns="columns"
			:pagination.sync="pagination"
			no-data-label="No Results Found"
			:hide-pagination="hidePagination"
			@request="onRequest"
			dark
		>
			<template v-slot:loading>
				<q-inner-loading showing color="primary" />
			</template>
			<template v-slot:body="props">
				<q-tr :props="props">
					<q-td key="name" :props="props">
						{{ props.row.name }}
					</q-td>
					<q-td key="height" :props="props">
						{{ props.row.height }}
					</q-td>
					<q-td key="mass" :props="props">
						{{ props.row.mass }}
					</q-td>
					<q-td key="created" :props="props">
						{{ props.row.created }}
					</q-td>
					<q-td key="edited" :props="props">
						{{ props.row.edited }}
					</q-td>
					<q-td key="homeworld" :props="props">
						<q-btn color="primary" label="see details" size="sm" @click="openDetails(props.row.homeworld)"/>
					</q-td>
				</q-tr>
			</template>
			<template v-slot:no-data="{ icon, message }">
				<div class="full-width row flex-center q-gutter-sm">
				<span>
					{{ message }}
				</span>
				<q-icon v-if="!isLoading" size="2em" :name="icon"  />
				</div>
			</template>
		</q-table>
		<Popup ref="popup" />
	</div>
</template>

<script>
import Popup from './PopUp.vue'
export default {
	components: { Popup },
	data () {
		return {
			pagination: {
				sortBy: 'desc',
				descending: false,
				page: 1,
				rowsPerPage: 10,
				rowsNumber: this.paginationCount
			},
			planetRequest: null,
			columns: [
				{
					name: 'name',
					required: true,
					label: 'Name',
					align: 'left',
					field: row => row.name,
					format: val => `${val}`,
					sortable: true
				},
				{ name: 'height', align: 'center', label: 'Height', field: 'height', sortable: true },
				{ name: 'mass', label: 'Mass', field: 'mass', sortable: true },
				{ name: 'created', label: 'Created', field: 'created', sortable: true },
				{ name: 'edited', label: 'Edited', field: 'edited', sortable: true },
				{ name: 'homeworld', label: 'Planet Name', field: 'homeworld' }
			]
		}
	},
	computed: {
		resultData () {
			return this.$store.getters['swapiStore/allResults']
		},
		paginationCount () {
			return this.$store.getters['swapiStore/getCount']
		},
		currentlySearching () {
			return this.$store.getters['swapiStore/isCurrentlySearching']
		},
		isLoading () {
			return this.$store.getters['swapiStore/getLoadingState']
		},
		hidePagination () {
			return this.$store.getters['swapiStore/hidePagination']
		},
		currentPage () {
			return this.$store.getters['swapiStore/currentPage']
		}
	},
	async created () {
		await this.loadPage()
	},
	methods: {
		openDetails (planetRequest) {
			this.$refs.popup.openPopUp(planetRequest)
		},
		async loadPage (reloadCurrentPage = false) {
			await this.$store.dispatch('swapiStore/getResults', { page: reloadCurrentPage ? this.currentPage : this.pagination.page })
			this.pagination.page = reloadCurrentPage ? this.currentPage : this.pagination.page
			this.pagination.sortBy = 'desc'
			this.pagination.rowsNumber = this.paginationCount
		},
		async onRequest (data) {
			/*
			handles pagination in quasar
			first click on header column === sortBy asc
			second click on header column === sortBy desc
			third click on header column === original order for page
			*/
			this.pagination = data.pagination
			if (this.pagination.sortBy && this.pagination.sortBy !== 'desc') {
				this.$store.dispatch('swapiStore/doSort', { sortBy: this.pagination.sortBy, descending: this.pagination.descending })
				this.$store.dispatch('swapiStore/setHidePagination', { state: true })
				// if we're sorting then don't reload the page && hide pagination
				return
			}
			this.$store.dispatch('swapiStore/setHidePagination', { state: false })
			// sortBy is null so we've removed all sortBy and we want to reload the current page
			await this.loadPage(data.pagination.sortBy === null)
		}
	}
}
</script>
