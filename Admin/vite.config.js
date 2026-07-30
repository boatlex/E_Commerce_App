// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   server: {
//     allowedHosts: true
//   },
//   preview: {
//     allowedHosts: true
//   }
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import history from 'connect-history-api-fallback'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    {
      name: 'production-spa-fallback',
      configurePreviewServer(server) {
        server.middlewares.use(
          history({
            verbose: false,
            disableDotRule: true ,
          })
        )
      }
    }
  ],
  server: {
    allowedHosts: true
  },
  preview: {
    allowedHosts: true
  }
})


