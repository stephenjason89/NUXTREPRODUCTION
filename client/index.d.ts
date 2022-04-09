import Vue from 'vue'
import Auth, { AuthHelpers } from '~/types/Auth'
import CompanyInfo from '~/types/CompanyInfo'
import IziToast from '~/types/IziToast'

declare module '*.vue' {
    export default Vue
}

declare global {
    let defineProps: function
    let defineEmits: function
    let defineExpose: function
    let withDefaults: function
}

declare module 'vue/types/vue' {
    interface Vue {
        $auth: Auth
        $authHelpers: AuthHelpers
        $apollo: any
        companyInfo: CompanyInfo
        $iziToast: IziToast
    }
}

declare module '@nuxt/types' {
    interface Context {
        $auth: Auth
        $authHelpers: AuthHelpers
        $iziToast: IziToast
    }

    interface NuxtAppOptions {
        $auth: Auth
        $authHelpers: AuthHelpers
        $iziToast: IziToast
    }
}

declare module 'vue/types/options' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface ComponentOptions<V extends Vue> {
        apollo?: any
    }
}
