import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import crossOriginIsolation from 'vite-plugin-cross-origin-isolation'
import preprocess from 'svelte-preprocess';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    crossOriginIsolation()
  ]
})
