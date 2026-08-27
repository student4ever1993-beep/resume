import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"
import type { Plugin } from "vite"

function apiDevServerPlugin(): Plugin {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const env = loadEnv(server.config.mode, process.cwd(), '');

        if (req.url?.startsWith('/api/groq')) {
          let bodyStr = '';
          req.on('data', (chunk) => (bodyStr += chunk));
          req.on('end', async () => {
            try {
              const body = JSON.parse(bodyStr || '{}');
              const apiKey = env.GROQ_API_KEY || env.VITE_GROQ_API_KEY;

              if (!apiKey) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'GROQ_API_KEY is not configured in .env' }));
                return;
              }

              const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${apiKey.trim()}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  model: body.model || 'allam-2-7b',
                  messages: body.messages || [],
                  temperature: body.temperature ?? 0.6,
                  max_tokens: body.max_tokens ?? 250,
                }),
              });

              const data = await groqRes.json();
              res.statusCode = groqRes.status;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message || 'Server error' }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), apiDevServerPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
