<script setup lang="ts">
import BaseIcon from '~/src/shared/ui/components/BaseIcon.vue';
import { mdiViewGrid } from '@mdi/js';
import { mdiViewList } from '@mdi/js';

let props = defineProps<{
  modelValue: 'grid' | 'list',
}>()

const mode = ref(props.modelValue)
const emit = defineEmits(['update:modelValue'])

watch(() => mode.value, () => {
  emit('update:modelValue', mode.value)
})
</script>

<template>
  <div class="flex justify-end">
    <BaseIcon @click="mode = 'grid'" :class="mode === 'grid' ? 'text-blue-500' : 'cursor-pointer'" :path="mdiViewGrid" />
    <BaseIcon @click="mode = 'list'" :class="mode === 'list' ? 'text-blue-500' : 'cursor-pointer'"  :path="mdiViewList" />
  </div>
</template>
  
  <style scoped lang="scss">
  
  </style>

  