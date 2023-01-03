<template>
  <div class="about">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const msg = ref<string>('This is an about page sgsdg');
</script>
