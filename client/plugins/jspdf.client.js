import { jsPDF } from 'jspdf'

export default defineNuxtPlugin(() => {
    const js = new jsPDF()
    js.save('test.pdf')
})
