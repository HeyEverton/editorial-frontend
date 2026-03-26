
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// Fix: Import process to ensure cwd() is available in the Vite config environment
import process from 'node:process';

export default defineConfig(({ mode }) => {
  // Carrega variáveis do .env e do ambiente de deploy
  const env = loadEnv(mode, process.cwd(), '');
  
  /**
   * NOTA PARA DEPLOY (Ex: Netlify, Vercel, Cloudflare Pages):
   * Certifique-se de adicionar a variável de ambiente 'API_KEY' (ou 'VITE_GEMINI_API_KEY') 
   * nas configurações do seu painel de controle de deploy. 
   * O valor deve ser a sua chave da Gemini API obtida em ai.google.dev.
   */
  const apiKey = env.VITE_GEMINI_API_KEY || env.API_KEY || "";

  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(apiKey),
      'process.env': {
        NODE_ENV: JSON.stringify(mode),
        API_KEY: JSON.stringify(apiKey)
      }
    },
    server: {
      port: 3000
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      chunkSizeWarningLimit: 2000
    }
  };
});
