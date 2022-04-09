import { provideApolloClient } from '@vue/apollo-composable'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('vue:setup', () => {
        provideApolloClient(nuxtApp.nuxt2Context.app.apolloProvider?.defaultClient)
    })
})
