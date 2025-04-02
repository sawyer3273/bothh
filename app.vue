<script setup>
useHead({
 
  titleTemplate: (titleChunk) => {
    const titleBase = process.env.PROJECT_NAME ? process.env.PROJECT_NAME : 'Default title'

    return titleChunk ? `${titleChunk} - ${titleBase}` : titleBase
  }
})
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>