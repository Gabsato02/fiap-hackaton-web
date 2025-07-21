import { defineConfig } from 'vite';
import federation from '@originjs/vite-plugin-federation';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'app',
      exposes: {
        './store': './src/store/index.ts',
        './types': './src/domain/entities/index.ts',
        './global_components': './src/presentation/global_components/index.ts',
        './vars': './src/vars/index.ts',
      },
      remotes: {
        remoteLogin: 'http://localhost:5001/assets/remoteEntry.js',
        remoteSales: 'http://localhost:5002/assets/remoteEntry.js',
        remoteStock: 'http://localhost:5003/assets/remoteEntry.js',
        remoteGoals: 'http://localhost:5004/assets/remoteEntry.js',
      },
      shared: [
        'react',
        'react-dom',
        '@mui/material',
        '@mui/icons-material',
        '@emotion/react',
        '@emotion/styled',
        'zustand',
        'dayjs',
      ],
    }),
    {
      name: 'vite-plugin-reload-endpoint',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/__fullReload') {
            server.hot.send({ type: 'full-reload' });
            res.end('Full reload triggered');
          } else {
            next();
          }
        });
      },
    },
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  preview: {
    port: 5000, // A porta específica deste remote
    host: true, // Garante que o servidor seja acessível na sua rede
  },
});
