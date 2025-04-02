
const useDebounceFn = (fn: Function, delay: number) => {
    let timeout: ReturnType<typeof setTimeout>

    return (...args: Array<string|number|Function>) => {
        if (timeout) {
            clearTimeout(timeout)
        }

        timeout = setTimeout(() => {
            fn(...args)
        }, delay)
    }
}

export {
    useDebounceFn
}