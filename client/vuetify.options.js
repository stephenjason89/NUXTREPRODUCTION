import colors from 'vuetify/es5/util/colors'

export default {
    customVariables: ['~/assets/css/variables.scss'],
    breakpoint: {},
    icons: {
        iconfont: 'mdiSvg',
    },
    theme: {
        dark: false,
        themes: {
            dark: {
                primary: colors.blue.lighten4,
                accent: colors.grey.darken3,
                secondary: colors.amber.darken3,
                info: colors.teal.lighten1,
                warning: colors.amber.base,
                error: colors.deepOrange.accent4,
                success: colors.green.accent3,
            },
        },
    },
}
