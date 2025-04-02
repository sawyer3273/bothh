


<script setup lang="ts">
import { useCountryModel } from '@/entities/country'
import { Table } from '~/src/features/catalog/table';
import { ModeSwitch } from '~/src/features/catalog';
import { Pagination } from '~/src/features/catalog/pagination';
import type { TableHeader } from '~/src/features/catalog/table/ui/Table.vue';
import CatalogFilter from '~/src/features/catalog/filter/ui/CatalogFilter.vue';
import type { ICountry } from '~/src/entities/country/model/types';
const router = useRouter()
const CountryModel = useCountryModel()

let headers: TableHeader[] = [
    {
        key: 'common',
        label: 'Common Name'       
    },
    {
        key: 'official',
        label: 'Official Name'
    },
    {
        key: 'capital',
        label: 'Capital'
    },
    {
        key: 'region',
        label: 'Region'
    },
    {
        key: 'subregion',
        label: 'Subregion'
    },
    {
        key: 'area',
        label: 'Area'
    },
    {
        key: 'population',
        label: 'Population' 
    },
    {
        key: 'flag',
        label: 'Flag'
    }
]

async function fetchCountries() {
  await CountryModel.fetchCountries({keyword: keyword.value});
}

onMounted(() => {
  fetchCountries()
})


const page = ref(1)
const mode: Ref<'grid' | 'list'> = ref('list')
const perPage = computed(() => mode.value === 'grid' ? 21 : 20) 

const items = ref(CountryModel.items.slice(0, perPage.value))
const total = ref(CountryModel.items.length)
const keyword = ref('')

watch(() => [CountryModel.items, page.value, mode.value,], () => {
  getData()
})

watch(() => [keyword.value], () => {
  fetchCountries()
})

function getData() {
  let start = (page.value - 1) * perPage.value
  let end = page.value * perPage.value
  total.value = CountryModel.items.length
  items.value = CountryModel.items.slice(start, end)
}

function openPage(item: ICountry) {
  router.push(`/country/${item.cca3}`)
}

</script>

<template>
  <div>
      <div class="flex justify-between">
        <CatalogFilter v-model="keyword" />
        <ModeSwitch v-model="mode" />
      </div>
      <Table :mode="mode" :items="items" :headers="headers" @clickAction="openPage" />
      <Pagination v-model="page" :perPage="perPage" :total="total" />
  </div>
</template>
  
  <style scoped lang="scss">
  
  </style>

  