<script setup lang="ts">
import { useDebounceFn }  from '~/src/composables/useDebounce';

let props = defineProps<{
  modelValue: string,
}>()

const keyword = ref(props.modelValue)
const emit = defineEmits(['update:modelValue'])

watch(() => keyword.value, () => {
  search()
})

const search = useDebounceFn(() => {
    emit('update:modelValue', keyword.value)
}, 500)



</script>

<template>
  <div class="max-w-sm">
    <input class='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 mb-2' v-model="keyword" placeholder='Search...'/> 
  </div>
</template>
  
  <style scoped lang="scss">
  
  </style>

  