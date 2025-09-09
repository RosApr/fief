import esbuild from 'esbuild'
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

// 辅助函数：获取当前模块目录
const __dirname = dirname(fileURLToPath(import.meta.url))


// 使用 esbuild 打包客户端代码，添加JSX支持
async function bundleClientCode(rootDir) {



    // 增强JSX处理配置
    const result = await esbuild .build({
        entryPoints: ['src/client-entry.tsx'],
        bundle: true,
        format: 'esm',
        metafile: true,
        splitting: true,
        target: 'es2020',
        outdir: 'app/static/',
      })

    if (result.errors.length > 0) {
        console.error("客户端打包错误:", result.errors)
        throw new Error("客户端代码打包失败")
    }

    console.log("客户端代码打包成功")
    
}

bundleClientCode(process.cwd())