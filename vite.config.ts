import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss()
  ],
  // Եթե ապագայում խնդիրներ ունենաս path-երի հետ (օրինակ՝ @/components), 
  // կարող ես այստեղ ավելացնել resolve բաժինը:
})
