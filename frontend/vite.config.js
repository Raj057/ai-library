import { defineConfig, transformWithEsbuild } from "vite";
import react from "@vitejs/plugin-react";
import postcssNesting from "postcss-nesting";

const jsToJsxConvertor = () => ({
    name: 'treat-js-files-as-jsx',
    async transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) return null

        // Use the exposed transform from vite, instead of directly
        // transforming with esbuild
        return transformWithEsbuild(code, id, {
            loader: 'jsx',
            jsx: 'automatic',
        })
    },
})

export default defineConfig({
    css: {
        postcss: {
            plugins: [postcssNesting]
        }
    },
    optimizeDeps: {
        force: true,
        esbuildOptions: {
            loader: {
                '.js': 'jsx',
            },
        },
    },
    // this will throw errors in build, so fix them before uncommenting
    // plugins: [eslint(), react(), viteCompression()],
    plugins: [jsToJsxConvertor(), react()],
});