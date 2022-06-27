// store/filters.js
import { defineStore, acceptHMRUpdate } from 'pinia'

export const useStore = defineStore({
  id: 'main-store',
  state: () => ({
    id: null,
    user: {},
    tokens: [],
    isTokensLoading: false
  }),
  actions: {},
  getters: {}
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot))
}
