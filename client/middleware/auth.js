export default function (context) {
    const { store, redirect, route } = context
    if (!store.state.auth.user?.id) {
        if (route.name !== 'login' && route.name !== 'index') redirect({ name: 'login' })
    } else {
        if (route.name === 'index') redirect({ name: 'dashboard-module' })
        if (process.client) context.$authHelpers.refresh()
    }
}
