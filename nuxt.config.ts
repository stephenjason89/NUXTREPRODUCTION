import WorkerPlugin from 'worker-plugin'
import { ContextReplacementPlugin } from 'webpack'
import { defineNuxtConfig } from '@nuxt/bridge'

export default defineNuxtConfig({
    srcDir: 'client/',
    ssr: process.env.SSR === 'true',
    dev: process.env.NODE_ENV !== 'production',
    alias: {
        tslib: 'tslib/tslib.es6.js',
        '~/*': 'client/*',
        '@/*': 'client/*',
    },
    image: {
        domains: ['files.foodat.ph'],
        alias: {
            bucket: 'https://files.foodat.ph/',
        },
        screens: {
            xs: 320,
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
            xxl: 1536,
            '2xl': 1536,
        },
    },
    generate: {
        dir: 'public/dist',
    },
    // Global page headers (https://go.nuxtjs.dev/config-head)
    head: {
        titleTemplate: '%s - Foodat',
        title: 'Foodat',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: '' },
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
    typescript: {
        tsConfig: {
            compilerOptions: {
                lib: ['ESNext', 'ESNext.AsyncIterable', 'DOM', 'webworker'],
                types: ['@types/node', '@nuxt/types', '@nuxtjs/axios', '@nuxt/image'],
            },
        },
    },
    publicRuntimeConfig: {
        nuxtURL: process.env.NUXT_URL,
        laravelEndpoint: process.env.LARAVEL_URL,
        pusherKey: process.env.PUSHER_APP_KEY,
        wsHostname: process.env.WS_HOSTNAME,
        wsPort: Number(process.env.WS_PORT),
    },
    privateRuntimeConfig: {},
    // Global CSS (https://go.nuxtjs.dev/config-css)
    css: ['~/assets/css/main.css'],
    loading: {
        continuous: true,
        color: '#37474F',
        height: '3px',
    },
    loadingIndicator: {
        name: 'folding-cube',
        color: 'white',
        background: '#f68723',
    },

    // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
    plugins: [
        { src: '~/plugins/graphql/apolloComposable.ts' },
        { src: '~/plugins/jspdf.client.js', ssr: false },
    ],

    // Auto import components (https://go.nuxtjs.dev/config-components)
    components: true,
    // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
    buildModules: [
        'nuxt-storm',
        [
            '@nuxtjs/router',
            {
                fileName: 'router.js',
                keepDefaultRouter: true,
            },
        ],
        'nuxt-compress',
        // https://go.nuxtjs.dev/eslint
        // '@nuxtjs/eslint-module',
        // https://go.nuxtjs.dev/stylelint
        // '@nuxtjs/stylelint-module',
        '@nuxtjs/vuetify',
        // '@nuxtjs/tailwindcss',
    ],
    // Modules (https://go.nuxtjs.dev/config-modules)
    modules: [
        // https://go.nuxtjs.dev/axios
        '@nuxt/image',
        '@nuxtjs/axios',
        '@nuxtjs/apollo',
        '@nuxtjs/proxy',
        [
            'nuxt-social-meta',
            {
                url: 'https://apollosystems.ph',
                title: 'Apollo Systems',
                site_name: 'Apollo Systems',
                description: 'Enterprise Resource Planning',
                img: 'vuetify-logo.png',
                img_size: { width: '50', height: '50Z' },
                locale: 'en_US',
                twitter: '@apollosystems',
                twitter_card: 'summary_large_image',
                themeColor: '#1B2432',
            },
        ],
    ],
    apollo: {
        clientConfigs: {
            default: '~/plugins/graphql/client',
        },
        defaultOptions: {
            $watchQuery: { errorPolicy: 'all' },
            $mutate: { errorPolicy: 'all' },
            $query: {
                // fetchPolicy: 'cache-and-network',
                errorPolicy: 'all',
            },
        },
    },
    proxy: {
        '/api': {
            target: process.env.LARAVEL_URL,
            headers: {
                Connection: 'keep-alive',
            },
        },
        '/central': {
            target: process.env.LARAVEL_URL,
            pathRewrite: { '^/central': '/' },
        },
        '/maps/api': 'https://maps.googleapis.com',
    },
    // Axios module configuration (https://go.nuxtjs.dev/config-axios)
    axios: {
        proxy: true,
    },

    // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
    vuetify: {
        optionsPath: '~/vuetify.options.js',
        defaultAssets: false,
    },

    // Build Configuration (https://go.nuxtjs.dev/config-build)
    build: {
        publicPath: '/resources/',
        // @ts-ignore
        extend(config, { isClient }) {
            if (isClient) {
                config.plugins.push(
                    new WorkerPlugin({
                        filename: '[name].worker.js',
                        globalObject: "(typeof self!='undefined'?self:global)",
                    }),
                )
                config.node = {
                    fs: 'empty',
                }
            }
            // Remove this on peerjs ^2.0.0
            config.plugins.push(
                new ContextReplacementPlugin(/\/peerjs\//, (data: any) => {
                    delete data.dependencies[0].critical
                    return data
                }),
            )
            /* if (isDev && isClient) {
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/,
                    options: {
                        fix: true,
                    },
                })
            } */
        },
        // @ts-ignore
        extractCSS:
            process.env.NODE_ENV === 'production'
                ? {
                      ignoreOrder: true,
                  }
                : false,
        optimizeCSS: process.env.NODE_ENV === 'production',
        // hardSource: process.env.NODE_ENV !== 'production',
        // parallel: process.env.NODE_ENV !== 'production',
        // cache: process.env.NODE_ENV !== 'production',

        loaders: {
            vue: {
                // @ts-ignore
                compiler: require('vue-template-babel-compiler'),
            },
        },
    },
})
