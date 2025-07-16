<template>
  <div class="bg-white border border-gray-100 rounded-sm p-6 w-[512px]">
    <h3 class="text-sm font-medium text-gray-800 mb-4">{{ title }}</h3>
    <div class="h-64 ">
      <slot></slot>
    </div>
    <CommentSection :dashboardId="title" />
  </div>
</template>

<script lang="ts" setup>
import CommentSection from '@/components/CommentComp.vue';

defineProps<{
  title: string;
}>();
</script>

<style scoped></style>
