import { InMemoryCache } from 'apollo-cache-inmemory'
import Pusher from 'pusher-js'
import { ApolloLink } from 'apollo-link'
import { BatchHttpLink } from 'apollo-link-batch-http'
import { CachePersistor, LocalForageWrapper } from 'apollo3-cache-persist'
import localforage from 'localforage'
import PusherLink from '~/plugins/graphql/pusher'
import initializeAuth from '~/plugins/auth'

export default (context) => {
    initializeAuth(context)

    const { req, $auth, $authHelpers } = context

    const cache = new InMemoryCache()

    if (process.client) {
        const persistor = new CachePersistor({
            cache,
            storage: new LocalForageWrapper(localforage),
        })

        if (window.navigator.onLine) {
            persistor.purge().then(() => console.log('New apollo cache ready'))
        } else {
            persistor.restore()
            console.log('Using old cache for offline mode')
        }
    }

    const authFetch = async (uri, options) => {
        const initialRequest = await fetch(uri, options)
        let expiredToken = false

        for (const query of await initialRequest.clone().json())
            if (query?.errors?.[0]?.message === 'Unauthenticated.') {
                expiredToken = true
                break
            }

        if (expiredToken && $authHelpers.isRefreshTokenExpired()) {
            console.error('expired token:', expiredToken, $authHelpers.isRefreshTokenExpired())
            $authHelpers.logout(true)
            return { text: () => Promise.resolve('{"data":{}}') }
        } else if (expiredToken && process.client) {
            await $authHelpers.refresh()
            options.headers.Authorization = $auth.token
            return fetch(uri, options)
        } else {
            return initialRequest
        }
    }

    const subdomain = ''
    const link = process.client
        ? ApolloLink.from([
              new PusherLink({
                  pusher: new Pusher(context.$config.pusherKey, {
                      auth: {
                          headers: { 'X-Tenant': subdomain },
                      },
                      wsHost: context.$config.wsHostname,
                      wsPort: context.$config.wsPort,
                      wssPort: context.$config.wsPort,
                      disableStats: true,
                      authEndpoint: context.$config.laravelEndpoint + '/graphql/subscriptions/auth',
                      enabledTransports: ['ws', 'wss'],
                  }),
              }),
              new BatchHttpLink({
                  uri: context.$config.laravelEndpoint + '/graphql',
                  headers: { 'X-Tenant': subdomain },
                  fetch: authFetch,
              }),
          ])
        : new BatchHttpLink({
              uri: context.$config.laravelEndpoint + '/graphql',
              headers: { 'X-Tenant': subdomain },
          })

    return {
        assumeImmutableResults: true,
        link,
        cache,
        defaultHttpLink: false,
        getAuth: () => $auth.token,
    }
}
