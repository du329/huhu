<script setup lang="ts">
import { ref } from 'vue'
interface Props { 
  msg: string 
}
defineProps<Props>()

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>
</template>

<style scoped>
</style>
