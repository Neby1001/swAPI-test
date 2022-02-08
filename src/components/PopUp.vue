<template>
	<div>
		<q-dialog v-model="alert" dark>
			<q-card v-if="!loading" dark style="width: 300px">
				<q-card-section>
					<div class="text-h6">{{ planetData.name }}</div>
				</q-card-section>
				<q-card-section>
					<q-list>
						<q-item v-for="(detail, i) in planetDetails" :key="i" v-ripple>
							<q-item-section class="starWars">
								<q-item-label>{{ detail }}</q-item-label>
								<q-item-label caption class="starWars">{{ planetData[detail] }}</q-item-label>
							</q-item-section>
						</q-item>
					</q-list>
				</q-card-section>
			</q-card>
			<q-card v-else class="starWars" dark>
				<div class="loading">
					Loading...
				</div>
			</q-card>
		</q-dialog>
	</div>
</template>

<script>
import axios from 'axios'

export default {
	data () {
		return {
			alert: false,
			planetData: {},
			loading: false,
			planetDetails: ['diameter', 'climate', 'population'] // if you wanted more you could add addtional properties here to display them
		}
	},
	methods: {
		async openPopUp (urlToCall) {
			this.planetData = {}
			this.alert = true
			this.loading = true
			await this.getData(urlToCall)
			this.loading = false
		},
		async getData (urlToCall) {
			try {
				const { data } = await axios.get(urlToCall)
				this.planetData = data
			} catch (e) {
				console.error(e)
			}
		}
	}
}
</script>
<style scoped>
.starWars {
	color: white;
}

.loading {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 50px;
}
</style>
