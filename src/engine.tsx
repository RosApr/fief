import { HttpStatus, MIME_TYPE } from "./const.js"
import { renderToString } from "./render-to-string.js"
import { pathToFileURL } from "url"
import { readdir, readFile, stat } from "fs/promises"
import { join, dirname, resolve, relative } from "path"
import { useContext, createContext, h } from "fre"

const routes = new Map()
const assets = new Map()

async function resolveRoutes(dir) {
    const entries = await readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
        const routeName = join(dir, entry.name)

        if (entry.isDirectory()) {
            await resolveRoutes(routeName)
        } else {
            // 处理路由键名
            let key = relative(join(dirname(dir), 'routes'), routeName)
                .replace(/\.tsx$/, '')
                .replace(/\/index$/, '')

            // 确保根路由正确
            if (key === '') key = '/'
            else if (!key.startsWith('/')) key = `/${key}`

            // 导入模块
            const moduleUrl = pathToFileURL(routeName).href
            const mod = await import(moduleUrl)
            routes.set(key, mod)
        }
    }
}

async function resolveStaticAssets(root, dir) {
    const entries = await readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
        const assetPath = join(dir, entry.name)

        if (entry.isDirectory()) {
            await resolveStaticAssets(root, assetPath)
        } else {
            // 读取文件内容
            const content = await readFile(assetPath)
            // 计算相对路径作为键
            const key = relative(root, assetPath)
            assets.set(key, content)
        }
    }
}

function determineMimeType(fullPath) {
    const lastFragment = fullPath.split("/").at(-1)
    const ext = lastFragment ? lastFragment.split(".").at(-1) : MIME_TYPE.plain
    const mime = ext ? MIME_TYPE[ext] : MIME_TYPE.plain
    return mime ?? MIME_TYPE.plain
}

function devEngine(config) {
    const root = config.rootDir
    const routesDir = join(root, "routes")

    return {
        async render(request) {

            const url = new URL(request.url, `http://${request.headers.host}`)
            let { pathname } = url

            // 处理静态资源
            if (pathname.includes("/static/") || pathname === '/favicon.ico') {
                if (pathname === '/favicon.ico') {
                    pathname = '/static/favicon.ico'
                }

                const filePath = resolve(root, pathname.substring(1))

                try {
                    // 检查文件是否存在
                    await stat(filePath)
                    const content = await readFile(filePath)
                    return new Response(content, {
                        headers: {
                            "Content-Type": determineMimeType(pathname),
                        },
                    })
                } catch (error) {
                    return new Response(null, {
                        status: HttpStatus.NotFound,
                    })
                }
            }

            // 处理API请求
            if (pathname.includes("/api/")) {
                try {
                    let apiPath = pathname.replace(/^\//, "").replace(/\//g, ".")
                    const modulePath = resolve(routesDir, `${apiPath}.ts`)
                    const moduleUrl = pathToFileURL(modulePath).href
                    const { loader } = await import(moduleUrl)

                    const loaderFnRes = typeof loader === 'function' ? await loader(request) : null
                    const res = loaderFnRes instanceof Promise ? await loaderFnRes : loaderFnRes

                    if (res instanceof Response) return res

                    throw res
                } catch (error) {
                    console.error("API处理错误:", error)
                    return new Response(JSON.stringify({ error: error.message }), {
                        status: HttpStatus.InternalServerError,
                        headers: { "Content-Type": "application/json" }
                    })
                }
            }

            // 处理页面路由
            try {
                const routeName = pathname === "/" ? "/index.tsx" : `${pathname}.tsx`
                const modulePath = resolve(routesDir, routeName.substring(1))
                const moduleUrl = pathToFileURL(modulePath).href
                const handler = await import(moduleUrl)

                if (!handler) {
                    return new Response("Page not found", {
                        status: HttpStatus.NotFound,
                    })
                }

                const { default: Page, loader } = handler

                const loaderFnRes = typeof loader === 'function' ? loader(request) : null
                const res = loaderFnRes instanceof Promise ? await loaderFnRes : loaderFnRes

                if (res instanceof Response) return res

                const Ctx = globalThis.__fre_globalFiber.current

                const html = renderToString(
                    <Ctx value={res}>
                        <Page />
                    </Ctx>
                )

                // 序列化loader数据，用于客户端水合
                const loaderData = JSON.stringify(res || {}).replace(/</g, '\\u003c')

                return new Response(
                    `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fre SSR</title>
  <script>
   window.__FRE_LOADER_DATA__= ${loaderData}
  </script>
</head>
<body>
  <div id="app">${html}</div>
  <script src="/static/client-entry.js" type="module"></script>
</body>
</html>
`,
                    {
                        headers: {
                            "X-Powered-By": "@fre/kit",
                            "Content-Type": "text/html",
                        },
                    }
                )
            } catch (error) {
                console.error(
                    "渲染错误:",
                    JSON.stringify({ pathname }),
                    error
                )
                return new Response("Internal Server Error", {
                    status: HttpStatus.InternalServerError,
                })
            }
        },
    }
}

export function createServerSideRendering(config) {
    const isRootDirEndedWithSlash = config.rootDir.endsWith("/") ||
        config.rootDir.endsWith("\\")
    if (isRootDirEndedWithSlash) {
        throw new Error(
            `根目录不应以斜杠结尾，但收到的rootDir是 ${config.rootDir}`
        )
    }

    return devEngine(config)
}
