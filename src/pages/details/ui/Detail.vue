<script setup lang="ts">

import { DetailPanel } from '~/src/widgets/detailPanel'; 
defineProps<{
  id: string,
}>()

</script>

<template>
  <NuxtLayout>
    <DetailPanel :id='id' />
  </NuxtLayout>
</template>
  

  