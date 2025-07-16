import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export class Comment {
  dashboardId: string
  id: string
  text: string
  isEditing: boolean
  editText: string
  createdAt: Date

  constructor(dashboardId: string, text: string) {
    this.dashboardId = dashboardId
    this.id = new Date().getTime().toString()
    this.text = text
    this.isEditing = false
    this.editText = text
    this.createdAt = new Date()
  }
}

export const useCommentStore = defineStore(
  'comment',
  () => {
    const comments = ref<Comment[]>([])
    const newCommentTexts = ref<Record<string, string>>({})

    const getNewCommentText = (dashboardId: string): string => {
      return newCommentTexts.value[dashboardId] || ''
    }

    const setNewCommentText = (dashboardId: string, text: string) => {
      newCommentTexts.value[dashboardId] = text
    }

    const addComment = (dashboardId: string) => {
      const commentText = newCommentTexts.value[dashboardId] || ''
      if (commentText.trim() !== '') {
        const newComment = new Comment(dashboardId, commentText)
        comments.value.push(newComment)
        newCommentTexts.value[dashboardId] = ''
      }
    }

    const toggleEdit = (commentId: string) => {
      const comment = comments.value.find((c) => c.id === commentId)
      if (comment) {
        comment.isEditing = !comment.isEditing
        comment.editText = comment.text
      }
    }

    const saveEdit = (commentId: string) => {
      const comment = comments.value.find((c) => c.id === commentId)
      if (comment && comment.editText.trim() !== '') {
        comment.text = comment.editText
        comment.isEditing = false
      }
    }

    const deleteComment = (commentId: string) => {
      const index = comments.value.findIndex((c) => c.id === commentId)
      if (index !== -1) {
        comments.value.splice(index, 1)
      }
    }

    const clearAllComments = () => {
      comments.value = []
    }

    const getCommentsByDashboard = (dashboardId: string) => {
      return comments.value.filter((comment) => comment.dashboardId === dashboardId)
    }

    const getCommentCountByDashboard = (dashboardId: string) => {
      return comments.value.filter((comment) => comment.dashboardId === dashboardId).length
    }

    const commentCount = computed(() => comments.value.length)

    return {
      comments,
      newCommentTexts,
      getNewCommentText,
      setNewCommentText,
      addComment,
      toggleEdit,
      saveEdit,
      deleteComment,
      clearAllComments,
      getCommentsByDashboard,
      getCommentCountByDashboard,
      commentCount,
    }
  },
  {
    persist: {
      storage: localStorage,
    },
  },
)
