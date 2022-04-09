import Vue from 'vue'
import Form from '~/plugins/forms/Form.js'

export default (context) => {
    context.$auth = context.store.state?.auth
    context.$authHelpers = {
        logout: (expired = false) => {
            context.store.commit('auth/logout')
            if (expired)
                context.$iziToast.error({
                    title: 'Session Expired',
                    message: 'Please re-login',
                })
        },
        login: async (data) => {
            const form = data instanceof Form ? data : new Form(data)
            const response = await form.post(context.$config.laravelEndpoint + '/api/get-token', true)
            context.store.commit('auth/login', response)
            return form
        },
        refresh: async () => {
            if (context.$authHelpers.isTokenExpired())
                if (!context.$authHelpers.isRefreshTokenExpired())
                    await context.$authHelpers.login({ refresh_token: context.$auth.refreshToken })
                else context.$authHelpers.logout(true)
        },
        setUser: (data) => {
            context.store.commit('auth/setUser', data)
        },
        isTokenExpired: () => parseFloat(context.$auth.tokenExpiration) < new Date().getTime(),
        isRefreshTokenExpired: () => parseFloat(context.$auth.refreshTokenExpiration) < new Date().getTime(),
    }
    Vue.prototype.$auth = context.$auth
    Vue.prototype.$authHelpers = context.$authHelpers
}
