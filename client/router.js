import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export function createRouter(ssrContext, createDefaultRouter, routerOptions, config) {
    const options = routerOptions || createDefaultRouter(ssrContext, config).options

    return new Router({
        ...options,
        routes: options.routes,
    })
}
