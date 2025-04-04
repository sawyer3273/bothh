<script setup lang="ts">
import moment from 'moment';
import BaseButton from '~/src/shared/ui/components/BaseButton.vue';

export type TableHeader = {
    key: string,
    label: string,
    type?: string
}
defineProps<{
  mode: 'grid' | 'list',
  items: Array<any>,
  headers: Array<TableHeader>
}>()
const emit = defineEmits(['clickAction', 'actionButton'])

</script>

<template>
  <table v-if="mode === 'list'" class="table-fill">
    <thead>
        <tr>
          <th v-for="header in headers">{{ header.label }}</th>
        </tr>
    </thead>
    <tbody class="table-hover cursor-pointer">
        <tr v-for="item in items" @click="$emit('clickAction', item)">
            <td v-for="header in headers">
              <template v-if="header.type === 'link'"><a target="_blank" class="text-blue-600" :href="item[header.key]">{{ item[header.key] }}</a></template>
              <template v-else-if="header.type === 'date'">{{ moment(item[header.key]).format('DD.MMM HH:mm') }}</template>
              <template v-else-if="header.type === 'action'"><BaseButton color="info" @click.stop="$emit('actionButton', item, header.key)" :label="header.label" /></template>
              <template v-else>{{ item[header.key] }}</template>
            </td>
        </tr>
    </tbody>
  </table> 
  <div v-else>
    <div class="grid grid-cols-3">
      <div v-for="item in items" class="block max-w-sm m-2 p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer"  @click="$emit('clickAction', item)">
        <div v-for="header in headers"><label class="font-bold">{{ header.label}}:</label> <span>{{ item[header.key] }}</span></div>
      </div>
    </div>
  </div>
  </template>
  
  <style scoped lang="scss">
  .table-fill {
    background: white;
    border-radius:3px;
    border-collapse: collapse;
    height: 320px;
    margin: auto;
    padding:5px;
    width: 100%;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    animation: float 5s infinite;
  }
   
  th {
    color:#D5DDE5;;
    background:#1b1e24;
    border-bottom:4px solid #9ea7af;
    border-right: 1px solid #343a45;
    font-size:23px;
    font-weight: 100;
    padding:24px;
    text-align:left;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
    vertical-align:middle;
    &:first-child {
      border-top-left-radius:3px;
    }
    
    &:last-child {
      border-top-right-radius:3px;
      border-right:none;
    }
  }
  
  
    
  tr {
    border-top: 1px solid #C1C3D1;
    border-bottom: 1px solid #C1C3D1;
    color:#666B85;
    font-size:16px;
    font-weight:normal;
    text-shadow: 0 1px 1px rgba(256, 256, 256, 0.1);
  
    &:hover td {
      background:rgb(243 244 246);
    }
    &:first-child {
      border-top:none;
    }
  
    &:last-child {
      border-bottom:none;
    }
    
    &:nth-child(odd) td {
      background:#EBEBEB;
    }
    
    &:nth-child(odd):hover td {
      background:rgb(243 244 246);
    }
  
    &:last-child td:first-child {
      border-bottom-left-radius:3px;
    }
    
    &:last-child td:last-child {
      border-bottom-right-radius:3px;
    }
  }
   
   
  td {
    background:#FFFFFF;
    padding:20px;
    text-align:left;
    vertical-align:middle;
    font-weight:300;
    font-size:18px;
    text-shadow: -1px -1px 1px rgba(0, 0, 0, 0.1);
    border-right: 1px solid #C1C3D1;
    &:last-child {
      border-right: 0px;
    }
  }
  
  
  
  </style>

  