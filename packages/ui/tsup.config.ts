import { defineConfig } from 'tsup'
import path from 'node:path'
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'

export default defineConfig({
  entry: ['src/index.ts', 'src/form.ts'],
  format: ['esm'],
  dts: true,
  splitting: false,
  treeshake: true,
  clean: true,
  external: ['react', 'react-dom', 'tailwindcss'],
  esbuildOptions(options) {
    options.jsx = 'automatic'
    options.alias = {
      '@': path.resolve(import.meta.dirname, 'src'),
    }
  },
  async onSuccess() {
    // Prepend "use client" to all JS files — required for Next.js RSC
    const distDir = path.resolve(import.meta.dirname, 'dist')
    for (const file of readdirSync(distDir)) {
      if (file.endsWith('.js')) {
        const filePath = path.join(distDir, file)
        const content = readFileSync(filePath, 'utf-8')
        writeFileSync(filePath, `"use client";\n${content}`)
      }
    }
  },
})
