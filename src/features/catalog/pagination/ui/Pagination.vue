<script setup lang="ts">
import BaseButton from '~/src/shared/ui/components/BaseButton.vue';

let props = defineProps<{
  modelValue: number,
  perPage: number,
  total: number
}>()

const page = ref(props.modelValue)
const emit = defineEmits(['update:modelValue'])

watch(() => page.value, () => {
  emit('update:modelValue', page.value)
})
</script>

<template>
  <div class="mt-2 flex justify-end">
    <div class="flex items-center">{{ total ? (page - 1) * perPage + 1 : 0}} - {{ perPage * page > total ? total : perPage * page }} of {{ total }} </div>
    <BaseButton class='ml-2' label="First" color="info" @click="page = 1" :disabled="page === 1" />
    <BaseButton class='ml-2' label="Previous" color="info" @click="page -= 1" :disabled="page === 1" />
    <BaseButton class='ml-2' label="Next" color="info" @click="page += 1" :disabled="page * perPage >= total" />
    <BaseButton class='ml-2' label="Last" color="info" @click="page = Math.ceil(total / perPage)" :disabled="page * perPage >= total"/>
  </div>
</template>
  
  <style scoped lang="scss">
  
  </style>

  