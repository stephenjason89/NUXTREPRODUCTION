export const state = () => ({
    user: {},
    token: null,
    tokenExpiration: null,
    refreshToken: null,
    refreshTokenExpiration: null,
})

export const mutations = {
    /* eslint-disable */
    login(state, { token_type, access_token, refresh_token, expires_in, user, error, message }) {
        if (!error) {
            const tokenExpiration = new Date().getTime() + expires_in * 1000
            const refreshTokenExpiration = new Date().getTime() + 60 * 60 * 24 * 30 * 1000
            state.user = user
            state.token = `${token_type} ${access_token}`
            state.tokenExpiration = tokenExpiration
            state.refreshToken = refresh_token
            state.refreshTokenExpiration = refreshTokenExpiration
            if (this.$router.currentRoute.path === '/login') this.$router.push({ name: 'dashboard-module' })
        } else {
            console.error(error, message)
            this.commit('auth/logout')
        }
    },
    /* eslint-enable */
    logout(state) {
        state.user = {}
        state.token = null
        state.tokenExpiration = null
        state.refreshToken = null
        state.refreshTokenExpiration = null
        if (this.$router.currentRoute.path !== '/login') this.$router.push({ name: 'login' })
    },
    setUser(state, user) {
        state.user = user
    },
}
