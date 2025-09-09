import esbuild from 'esbuild'
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

// 辅助函数：获取当前模块目录
const __dirname = dirname(fileURLToPath(import.meta.url))

// 客户端打包相关配置
const CLIENT_OUTPUT = "app/static/client.js"

// 使用 esbuild 打包客户端代码，添加JSX支持
export async function bundleClientCode(rootDir) {


    const outputDir = dirname(join(__dirname, CLIENT_OUTPUT))
    console.log(outputDir)

    // 增强JSX处理配置
    const result = await esbuild.build({
        entryPoints: ['./client-entry.tsx'],
        outfile: join(__dirname, CLIENT_OUTPUT),
        bundle: true,
        platform:'node',
        // splitting:true,
        target: ["es2020"],
        // platform: "browser",
        jsxFactory: "h",
        jsxFragment: "Fragment",
    })

    if (result.errors.length > 0) {
        console.error("客户端打包错误:", result.errors)
        throw new Error("客户端代码打包失败")
    }

    console.log("客户端代码打包成功")
    return CLIENT_OUTPUT
}

bundleClientCode(process.cwd())