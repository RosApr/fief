import { createContext, useContext } from "fre"

export const LoaderDataContext = createContext({})

if (!globalThis.__fre_globalFiber) {
    globalThis.__fre_globalFiber = {
        current: createContext({}) // 存储 currentFiber 的实际值
    }
}

export function useLoaderData() {
    if (typeof window !== 'undefined') {
        const aaa = window['__FRE_LOADER_DATA__']
        console.log(aaa)
        return aaa
    }
    return useContext(globalThis.__fre_globalFiber.current)
}