<template>
	<div>
		<q-input v-model="searchQuery" dark rounded standout label="Search for a person by name..." :style="'width: 550px;'">
			<template v-slot:prepend>
				<q-icon v-if="currentlySearching" name="close" @click="searchQuery = ''" class="cursor-pointer" />
			</template>
			<template v-slot:append>
				<q-icon name="search" color="white" />
			</template>
		</q-input>
	</div>
</template>
<script>
import debounce from 'lodash/debounce'
export default {
	data () {
		return {
			searchQuery: ''
		}
	},
	watch: {
		async searchQuery (value) {
			await this.searchResults(value)
		}
	},
	computed: {
		currentlySearching () {
			return this.$store.getters['swapiStore/isCurrentlySearching']
		}
	},
	methods: {
		searchResults: debounce(async function doSearch (value) {
			this.$store.dispatch('swapiStore/setSearchStatus', { searching: value.length > 0 })
			await this.$store.dispatch('swapiStore/doSearch', { query: value })
		}, 500)
	}
}
</script>
