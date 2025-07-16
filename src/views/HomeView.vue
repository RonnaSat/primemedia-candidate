<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const HomeComp = defineAsyncComponent(() => import('../components/HomeComp.vue'));
</script>

<template>
  <HomeComp />
</template>
