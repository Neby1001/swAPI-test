<template>
  <q-page class="spa flex-center">
	<Search />
	<Table />
  </q-page>
</template>

<script>
import Table from '../components/Table.vue'
import Search from '../components/Search.vue'

export default {
	name: 'PageIndex',
	components: { Table, Search }
}
</script>
<style scoped>
.spa {
	display: flex;
	flex-direction: column;
}
</style>
