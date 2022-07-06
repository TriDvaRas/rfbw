import { IToastStyle } from "../../util/interfaces";

const toastStyles = new Map<string, IToastStyle>([
    ['info', {
        containerClasses: 'bg-dark border border-info shadow',
        headerClasses: 'bg-info text-light ',
        bodyClasses: ''
    }],
    ['error', {
        containerClasses: 'bg-dark border border-danger shadow',
        headerClasses: 'bg-danger text-light ',
        bodyClasses: ''
    }],
    ['other', {
        containerClasses: 'bg-dark border border-secondary shadow',
        headerClasses: 'bg-secondary text-light ',
        bodyClasses: ''
    }],
    ['success', {
        containerClasses: 'bg-dark border border-primary shadow',
        headerClasses: 'bg-primary text-light ',
        bodyClasses: ''
    }],
])
export default toastStyles
