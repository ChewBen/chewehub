import {fileURLToPath, URL} from 'node:url'
import tailwindcss from "@tailwindcss/vite";
import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'path'
import autoImport from 'unplugin-auto-import/vite'
import setupExtend from 'unplugin-vue-setup-extend-plus/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import compression from 'vite-plugin-compression'

const baseUrl = 'http://localhost:38080' // 后端接口地址

// https://vite.dev/config/
export default defineConfig(({mode, command}) => {
    const env = loadEnv(mode, process.cwd())
    const {VITE_APP_ENV, VITE_BUILD_COMPRESS} = env
    const isBuild = command === 'build'
    
    return {
        // 部署路径
        base: VITE_APP_ENV === 'production' ? '/' : '/',
        
        plugins: [
            vue(),
            vueDevTools(),
            tailwindcss({
                config: './tailwind.config.js'
            }),
            // 自动导入
            autoImport({
                imports: [
                    'vue',
                    'vue-router',
                    'pinia'
                ],
                dts: false
            }),
            // setup 语法糖扩展
            setupExtend({}),
            // SVG 图标
            createSvgIconsPlugin({
                iconDirs: [path.resolve(process.cwd(), 'src/assets/icons/svg')],
                symbolId: 'icon-[dir]-[name]',
                svgoOptions: isBuild
            }),
            // 压缩插件（仅构建时）
            ...(isBuild && VITE_BUILD_COMPRESS ? (() => {
                const plugin = []
                const compressList = VITE_BUILD_COMPRESS.split(',')
                if (compressList.includes('gzip')) {
                    plugin.push(
                        compression({
                            ext: '.gz',
                            deleteOriginFile: false
                        })
                    )
                }
                if (compressList.includes('brotli')) {
                    plugin.push(
                        compression({
                            ext: '.br',
                            algorithm: 'brotliCompress',
                            deleteOriginFile: false
                        })
                    )
                }
                return plugin
            })() : []),
        ],
        
        resolve: {
            alias: {
                '~': path.resolve(__dirname, './'),
                '@': fileURLToPath(new URL('./src', import.meta.url))
            },
            extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
        },
        
        // 打包配置
        build: {
            sourcemap: command === 'build' ? false : 'inline',
            outDir: 'dist',
            assetsDir: 'assets',
            chunkSizeWarningLimit: 2000,
            rollupOptions: {
                output: {
                    chunkFileNames: 'static/js/[name]-[hash].js',
                    entryFileNames: 'static/js/[name]-[hash].js',
                    assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
                }
            }
        },
        
        // 开发服务器配置
        server: {
            port: 39092,
            host: true,
            open: true,
            proxy: {
                // API代理
                '/dev-api': {
                    target: baseUrl,
                    changeOrigin: true,
                    rewrite: (p) => p.replace(/^\/dev-api/, '')
                },
                // springdoc proxy
                '^/v3/api-docs/(.*)': {
                    target: baseUrl,
                    changeOrigin: true,
                }
            }
        }
    }
})
