
import { useContext, createContext } from "./fre.ts"

export const LoaderDataContext  = createContext({})

if (!globalThis.__fre_globalFiber) {
  globalThis.__fre_globalFiber = {
    current: createContext({}) // 存储 currentFiber 的实际值
  };
}

export function useLoaderData() {
  return useContext(globalThis.__fre_globalFiber.current)
}
