import fs from "fs"
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
                  ...(body.reasoning_effort && { reasoning_effort: body.reasoning_effort }),
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

        // Any other /api/<name> request runs the matching Vercel function in api/<name>.js,
        // so the dev server behaves like production (used by /api/tts and /api/gemini).
        const route = req.url?.match(/^\/api\/([a-z0-9-]+)(?:[/?]|$)/i)?.[1];
        const file = route && path.resolve(__dirname, 'api', `${route}.js`);
        if (file && fs.existsSync(file)) {
          for (const [key, value] of Object.entries(env)) {
            if (process.env[key] === undefined) process.env[key] = value;
          }

          let bodyStr = '';
          req.on('data', (chunk) => (bodyStr += chunk));
          req.on('end', async () => {
            type VercelRes = typeof res & { status(code: number): VercelRes; json(data: unknown): VercelRes; send(data: unknown): VercelRes };
            const vercelRes = res as VercelRes;
            vercelRes.status = (code: number) => ((res.statusCode = code), vercelRes);
            vercelRes.json = (data: unknown) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return vercelRes;
            };
            vercelRes.send = (data: unknown) => (res.end(data as string | Buffer), vercelRes);

            try {
              let body: unknown = bodyStr;
              try {
                body = JSON.parse(bodyStr || '{}');
              } catch {
                // leave non-JSON bodies as a string, like Vercel does
              }
              (req as typeof req & { body?: unknown }).body = body;
              const mod = await server.ssrLoadModule(file);
              await mod.default(req, vercelRes);
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Server error' }));
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
