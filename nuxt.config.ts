import { defineNuxtConfig } from '@nuxt/bridge'

export default defineNuxtConfig({
    srcDir: 'client/',
    ssr: true,
    dev: true,
    alias: {
        tslib: 'tslib/tslib.es6.js',
        '~/*': 'client/*',
        '@/*': 'client/*',
    },
    generate: {
        dir: 'public/dist',
    },

    typescript: {
        tsConfig: {
            compilerOptions: {
                lib: ['ESNext', 'ESNext.AsyncIterable', 'DOM'],
                types: ['@types/node', '@nuxt/types', '@nuxtjs/axios', '@nuxt/image'],
            },
        },
    },

    plugins: [{ src: '~/plugins/jspdf.client.js', ssr: false }],

    components: true,
    buildModules: ['@nuxtjs/vuetify'],
    modules: [
        // https://go.nuxtjs.dev/axios
    ],

    vuetify: {
        optionsPath: '~/vuetify.options.js',
        defaultAssets: false,
    },

    build: {
        publicPath: '/resources/',
    },
})
