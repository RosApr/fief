import { HttpStatus, MIME_TYPE } from "./constant.ts"
import { renderToString } from "./r2s.ts"
import type { EngineConfig, RouteHandler } from "./type.ts"
import { toFileUrl } from "@std/path"
import { h } from 'fre'

const routes = new Map<string, RouteHandler>()
const assets = new Map<string, Uint8Array<ArrayBufferLike>>()

async function resolveRoutes(dir: string) {
  for await (const entry of Deno.readDir(dir)) {
    const routeName = `${dir}/${entry.name}`
    if (entry.isDirectory) {
      resolveRoutes(routeName)
    } else {
      const key = routeName
        .replace(/.*(routes\/)/g, "")
        .replace(/\.tsx/, "")
        .replace("/index", "")
      const mod: RouteHandler = await import(`${dir}/${entry.name}`)
      routes.set(key, mod)
    }
  }
}

async function resolveStaticAssets(root: string, dir: string) {
  for await (const entry of Deno.readDir(dir)) {
    const routeName = `${dir}/${entry.name}`
    if (entry.isDirectory) {
      resolveStaticAssets(root, routeName)
    } else {
      const { href } = new URL(routeName, import.meta.url)
      const resp = await fetch(href)

      const key = routeName.replace(root, "")
      const bytes = new Uint8Array(await resp.arrayBuffer())
      assets.set(key, bytes)
    }
  }
}

function determineMimeType(fullPath: string) {
  const lastFragment = fullPath.split("/").at(-1)
  const ext = lastFragment ? lastFragment.split(".").at(-1) : MIME_TYPE.plain
  const mime = ext ? MIME_TYPE[ext as keyof typeof MIME_TYPE] : MIME_TYPE.plain
  return mime ?? MIME_TYPE.plain
}


function devEngine(config: EngineConfig) {
  const root = config.rootDir
  let routes = [root, "routes"].join("/")

  return {
    async render(request: Request): Promise<Response> {
      let { pathname } = new URL(request.url)

      if (pathname.includes("/static/") || pathname === '/favicon.ico') {
        if (pathname === '/favicon.ico') {
          pathname = '/static/favicon.ico'
        }
        const { href } = new URL(`${root}${pathname}`, import.meta.url)
        const resp = await fetch(toFileUrl(href))

        if (!resp.ok) {
          return new Response(null, {
            status: HttpStatus.NotFound,
          })
        }

        return new Response(resp.body, {
          headers: {
            "Content-Type": determineMimeType(pathname),
          },
        })
      }

      if (pathname.includes("/api/")) {
        let apiPath = pathname.replace(/^\//, "").replace(/\//g, ".")
        const { loader }: RouteHandler = await import(
          toFileUrl(`${routes}/${apiPath}.ts`)
        )

        const loaderFnRes =
          loader instanceof Function ? await loader(request) : null

        const res =
          loaderFnRes instanceof Promise ? await loaderFnRes : loaderFnRes

        if (res instanceof Response) return res

        throw res
      }

      try {

        const routeName = pathname === "/" ? "/index.tsx" : `${pathname}.tsx`
        let modulePath = new URL(`${routes}${routeName}`, import.meta.url).href
        const handler: RouteHandler = await import(toFileUrl(modulePath))

        if (!handler) {
          return new Response("hello not found", {
            status: HttpStatus.NotFound,
          })
        }

        const { default: Page, loader } = handler // 此时的 Page 中的 currentFiber 为 null

        const loaderFnRes = loader instanceof Function ? loader(request) : null
        const res =
          loaderFnRes instanceof Promise ? await loaderFnRes : loaderFnRes

        if (res instanceof Response) return res
        const Ctx = globalThis.__fre_globalFiber.current

        const html = renderToString( // 在这里无论怎么修改（currentFiber = fiber）也无效
          <Ctx value={res}>
            <Page />
          </Ctx>
          ,
        )

        return new Response(
          `<!DOCTYPE html>
${html}
`,
          {
            headers: {
              "X-Powered-By": "@fre/kit",
              "Content-Type": "text/html",
            },
          },
        )
      } catch (error) {
        console.info(
          ":::log >> error:::",
          JSON.stringify({
            pathname,
          }),
        )
        throw error
      }
    },
  }
}

/**
 * to create a server side rendering engine for both dev and production
 * ```bash
 * export MODE=dev # for development
 * export MODE=production # for production
 * ```
 */
export function createServerSideRendering(config: EngineConfig):
  | Promise<{
    render(request: Request): Promise<Response>
  }>
  | {
    render(request: Request): Promise<Response>
  } {
  const isRootDirEndedWithSlash = config.rootDir.endsWith("/")
  if (isRootDirEndedWithSlash) {
    throw new Error(
      `Expect root dir to not end with /, but recieve rootDir ${config.rootDir}`,
    )
  }

  return devEngine(config)
}
