import { defineStore } from 'pinia'

export const useTokenStore = defineStore({
  id: 'token',
  state: () => ({
    token: null
  }),
  getters: {
    requestConfig: (state) => {
      if (!state.token) return null;

      return {
        headers: {
           Authorization: `${state.token.tokenType} ${state.token.accessToken}`
        }
     }
    }
  },
  actions: {
    setToken(newToken) {
      this.token = newToken
    }
  }
})
