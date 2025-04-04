


<script setup lang="ts">
import { useVacancyModel } from '@/entities/vacancy'
import { Table } from '~/src/features/catalog/table';
import { Pagination } from '~/src/features/catalog/pagination';
import type { TableHeader } from '~/src/features/catalog/table/ui/Table.vue';
import CatalogFilter from '~/src/features/catalog/filter/ui/CatalogFilter.vue';
import type { ICountry } from '~/src/entities/country/model/types';
const VacancyModel = useVacancyModel()

let headers: TableHeader[] = [
    {
        key: 'name',
        label: 'Vacancy'       
    },
    {
        key: 'link',
        label: 'Link',
        type: 'link'
    },
    {
        key: 'createdAt',
        label: 'Date',
        type: 'date'
    },
 
]

async function getTableData() {
  await VacancyModel.getData({page: page.value.toString(), keyword: keyword.value, perPage: perPage.value.toString()});
  total.value = VacancyModel.totalItems
  items.value = VacancyModel.items
}

onMounted(() => {
  getTableData()
})


const page = ref(1)
const mode: Ref<'grid' | 'list'> = ref('list')
const perPage = computed(() => mode.value === 'grid' ? 21 : 10) 

const items = ref(VacancyModel.items.slice(0, perPage.value))
const total = ref(VacancyModel.totalItems)
const keyword = ref('')

watch(() => [VacancyModel.items, page.value, mode.value,], () => {
 // getData()
})

watch(() => [keyword.value, page.value], () => {
  getTableData()
})

function getData() {
  let start = (page.value - 1) * perPage.value
  let end = page.value * perPage.value
  total.value = VacancyModel.totalItems
  items.value = VacancyModel.items.slice(start, end)
}


</script>

<template>
  <div>
      <div class="flex justify-between">
        <CatalogFilter v-model="keyword" />
      </div>
      <Table :mode="mode" :items="items" :headers="headers" />
      <Pagination v-model="page" :perPage="perPage" :total="total" />
  </div>
</template>
  
  <style scoped lang="scss">
  
  </style>

  