<script setup>
  import  DetailPage  from '@/pages/details';
  const route = useRoute()
</script>

<template>
  <DetailPage :id='route.params.id'/>
</template>