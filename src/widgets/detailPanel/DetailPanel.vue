


<script setup lang="ts">
import { useCountryModel } from '@/entities/country'
import { mdiMapMarker } from '@mdi/js';
import { mdiViewList } from '@mdi/js';
import BaseIcon from '~/src/shared/ui/components/BaseIcon.vue';
const router = useRouter()
const CountryModel = useCountryModel()

const props = defineProps<{
  id: string,
}>()

async function fetchCountries() {
  await CountryModel.fetchCountries({code: props.id});
}

onMounted(() => {
  fetchCountries()
})
const data = computed(() => (CountryModel.items[0]))
</script>

<template>
  <NuxtLink to="/" class='flex items-center'><BaseIcon :path="mdiViewList" /> Back to list</NuxtLink>
  <div v-if='data' class="flex mb-4">
    <div class="w-1/4 p-2 ">
      <img :src='data.flagBig' />
    </div>
    <div class="w-1/4 p-2 ">
      <div><label class='font-bold'>Common Name: </label><span>{{data.common}}</span></div>
      <div><label class='font-bold'>Official Name: </label><span>{{data.official}}</span></div>
      <div><label class='font-bold'>Capital: </label><span>{{data.capital}}</span></div>
    </div>
    <div class="w-1/4 p-2 ">
      <div><label class='font-bold'>Region: </label><span>{{data.region}}</span></div>
      <div><label class='font-bold'>Subregion: </label><span>{{data.subregion}}</span></div>
      <div><label class='font-bold'>Area: </label><span>{{data.area}}</span></div>
      <div><label class='font-bold'>Population: </label><span>{{data.population}}</span></div>
    </div>
    <div class="w-1/4 p-2 ">
      <div><label class='font-bold'>Postal Code: </label><span>{{data.postalCode}}</span></div>
      <div><a class='underline text-blue-600' :href='data.map'  target="_blank"><BaseIcon :path='mdiMapMarker'/>Map</a></div>
    </div>
  </div>
  <div>
  </div>
</template>
  
  <style scoped lang="scss">
  
  </style>

  