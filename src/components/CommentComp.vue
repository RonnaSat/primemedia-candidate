<template>
  <div class="mt-6 pt-4 border-t border-gray-100 h-64 flex flex-col">
    <h4 class="text-xs font-medium text-gray-600 mb-3">
      Comments ({{ commentStore.getCommentCountByDashboard(dashboardId) }})
    </h4>
    <div class="flex gap-2 mt-4 border-b border-gray-200 pb-4 mb-3">
      <input :value="commentStore.getNewCommentText(dashboardId)"
        @input="commentStore.setNewCommentText(dashboardId, ($event.target as HTMLInputElement).value)"
        placeholder="Add a comment..." @keyup.enter="commentStore.addComment(dashboardId)"
        class="flex-1 text-sm border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      <button @click="commentStore.addComment(dashboardId)"
        class="text-sm text-white bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full transition-colors duration-200 font-medium cursor-pointer">
        Add
      </button>
    </div>
    <div class="flex-1 overflow-y-auto">
      <div v-for="comment in commentStore.getCommentsByDashboard(dashboardId)" :key="comment.id"
        class="mb-3 flex justify-between border-b border-gray-200 pb-2">
        <div v-if="!comment.isEditing" class="flex items-end">
          <p class="text-sm text-gray-700 text-start">{{ comment.text }}</p>

        </div>
        <input v-else v-model="comment.editText" @keyup.enter="commentStore.saveEdit(comment.id)"
          class="w-64 text-sm border border-gray-200 rounded-full px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        <div class="flex justify-between items-center">
          <div class="flex gap-2">
            <button
              class="text-xs text-gray-600 bg-gray-50 hover:text-gray-700 hover:bg-gray-100 px-3 py-1 rounded-full transition-colors duration-200 cursor-pointer"
              @click="commentStore.toggleEdit(comment.id)">
              {{ comment.isEditing ? 'Cancel' : 'Edit' }}
            </button>
            <button
              class="text-xs text-red-600 bg-red-50 hover:text-red-700 hover:bg-red-100 px-3 py-1 rounded-full transition-colors duration-200 cursor-pointer"
              @click="commentStore.deleteComment(comment.id)">
              Delete
            </button>
            <button v-if="comment.isEditing"
              class="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1 rounded-full transition-colors duration-200 cursor-pointer"
              @click="commentStore.saveEdit(comment.id)">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCommentStore } from '@/stores/comment'

const commentStore = useCommentStore()

defineProps<{
  dashboardId: string
}>()
</script>

<style scoped></style>
