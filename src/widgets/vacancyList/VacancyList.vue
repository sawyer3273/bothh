


<script setup lang="ts">
import { useVacancyModel } from '@/entities/vacancy'
import { Table } from '~/src/features/catalog/table';
import { Pagination } from '~/src/features/catalog/pagination';
import type { TableHeader } from '~/src/features/catalog/table/ui/Table.vue';
import CatalogFilter from '~/src/features/catalog/filter/ui/CatalogFilter.vue';
import type { IVacancy } from '~/src/entities/vacancy/model/types';
const VacancyModel = useVacancyModel()

let headers: TableHeader[] = [
    {
        key: 'name',
        label: 'Vacancy'       
    },
    {
        key: 'company',
        label: 'Company'       
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
    {
        key: 'updateCount',
        label: 'Count'       
    },
    {
        key: 'delete',
        label: 'Delete',
        type: 'action'
    },
 
]

async function getTableData() {
  await VacancyModel.getData({page: page.value.toString(), keyword: keyword.value, perPage: perPage.value.toString()});
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

watch(() => [keyword.value, page.value], () => {
  getTableData()
})

watch(() => [VacancyModel.totalItems], () => {
  total.value = VacancyModel.totalItems
  items.value = VacancyModel.items
})

async function onDelete(item: IVacancy, type: string) {
  if (type == 'delete' && item.id) {
    await VacancyModel.delete(item.id);
    getTableData()
  }
}
</script>

<template>
  <div>
      <div class="flex justify-between">
        <CatalogFilter v-model="keyword" />
      </div>
      <Table :mode="mode" :items="items" :headers="headers" @actionButton="onDelete"/>
      <Pagination v-model="page" :perPage="perPage" :total="total" />
  </div>
</template>
  
  <style scoped lang="scss">
  
  </style>

  