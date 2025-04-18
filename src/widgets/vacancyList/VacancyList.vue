


<script setup lang="ts">
import { useVacancyModel } from '@/entities/vacancy'
import { Table } from '~/src/features/catalog/table';
import { Pagination } from '~/src/features/catalog/pagination';
import type { TableHeader } from '~/src/features/catalog/table/ui/Table.vue';
import CatalogFilter from '~/src/features/catalog/filter/ui/CatalogFilter.vue';
import type { IVacancy } from '~/src/entities/vacancy/model/types';
import moment from 'moment';
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
        key: 'status',
        label: 'Status',
        options: [
            {
                value: 'active',
                label: 'Active'
            },
            {
                value: 'pending',
                label: 'Pending'
            },
            {
                value: 'rejected',
                label: 'Rejected'
            },
            {
                value: 'approved',
                label: 'Approved'
            }
        ]
    },
    {
        key: 'updatedAt',
        label: 'Updated',
        type: 'date',
        custom: (item: any) => {
          return item.updatedAt ? moment(item.updatedAt).format('DD.MMM HH:mm') + ' (' + item.updateCount + ')'  : ''
        }
    },
    {
        key: 'createdAt',
        label: 'Created',
        type: 'date'
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
async function onSelect(item: IVacancy, type: string, value: string) {
  if (item.id) {
    await VacancyModel.update(item.id, {[type]: value});
  }
}
</script>

<template>
  <div>
      <div class="flex justify-between">
        <CatalogFilter v-model="keyword" />
      </div>
      <Table :mode="mode" :items="items" :headers="headers" @actionButton="onDelete" @onSelect="onSelect"/>
      <Pagination v-model="page" :perPage="perPage" :total="total" />
  </div>
</template>
  
  <style scoped lang="scss">
  
  </style>

  