import { render, useState, useEffect, h } from './fre-esm.js'

// 路由映射 - 支持JSX组件
const routes = {
    '/': () => import('./app/routes/index.tsx'),
    '/about': () => import('./app/routes/about/index.tsx'),
    // 添加更多路由...
}

// 全局组件，用于客户端路由
function App() {
    const [Component, setComponent] = useState(null)
    const [loading, setLoading] = useState(true)

    // 初始加载和路由变化时加载组件
    useEffect(() => {
        const loadComponent = async () => {
            setLoading(true)
            const path = window.location.pathname || '/'
            const componentModule = routes[path] || routes['/']

            try {
                const module = await componentModule()
                setComponent(module.default)
            } catch (error) {
                console.error('加载组件失败:', error)
                // 可以加载404组件
            } finally {
                setLoading(false)
            }
        }

        loadComponent()

        // 监听路由变化
        const handlePopState = () => loadComponent()
        window.addEventListener('popstate', handlePopState)

        return () => {
            window.removeEventListener('popstate', handlePopState)
        }
    }, [])

    if (loading) {
        return <div>加载中...</div>
    }

    console.log(Component)

    return Component ? <Component /> : <div>页面未找到</div>
}

// 客户端水合逻辑
async function hydrate() {
    // 获取服务器注入的loader数据
    const loaderDataScript = document.getElementById('__FRE_LOADER_DATA__')
    const loaderData = loaderDataScript ? JSON.parse(loaderDataScript.textContent || '{}') : {}

    // 设置全局loader数据
    if (globalThis.__fre_globalFiber) {
        globalThis.__fre_globalFiber.current.value = loaderData
    }

    render(<App />, document.getElementById('app'))
}

// 启动水合过程
hydrate().catch(err => {
    console.error('客户端水合失败:', err)
})
