import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/happy-birthday-siri/',  // your repo name here
  plugins: [react()]
})
