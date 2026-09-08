import { defineConfig } from 'vite'
import dotenv, { parse } from 'dotenv';
import vue from '@vitejs/plugin-vue'
import path from "path"
import { plugin as mdPlugin } from 'vite-plugin-markdown';
import MarkdownIt from 'markdown-it';

dotenv.config();

const frontEndPort = parseInt(process.env.FRONTEND_PORT || 18772, 10);

const markdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

const markdownOptions = {
  mode: ['markdown', 'html'],
  markdown: (body) => markdownIt.render(body),
};

const localizedIndexPlugin = (isChinese) => ({
  name: 'localized-index-html',
  transformIndexHtml(html) {
    const replacements = {
      '__HTML_LANG__': isChinese ? 'zh-CN' : 'en-US',
      '__META_DESCRIPTION__': isChinese ? 'Henry / Zihan 的线上小酒馆' : "Henry/Zihan's Online Bistro",
      '__PAGE_TITLE__': isChinese ? 'Henry / Zihan 的线上小酒馆' : "Henry/Zihan's Online Bistro",
      '__LOADING_TEXT__': isChinese ? '加载中...' : 'Loading...',
    };

    return Object.entries(replacements).reduce(
      (result, [key, value]) => result.replaceAll(key, value),
      html,
    );
  },
});

export default defineConfig(({ mode }) => {
  const isChinese = mode === 'cn';

  return {
    base: './',
    plugins: [
      vue(),
      mdPlugin(markdownOptions),
      localizedIndexPlugin(isChinese),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@content": path.resolve(__dirname, isChinese ? "./contents-cn" : "./contents"),
      },
    },
    build: {
      outDir: `./docs/${isChinese ? 'cn' : 'en'}`,
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
          assetFileNames: (assetInfo) => {
            if (assetInfo.name.endsWith('.woff') || assetInfo.name.endsWith('.woff2')) {
              return 'fonts/[name][extname]';
            }
            return 'assets/[name]-[hash][extname]';
          },
        }
      },
      chunkSizeWarningLimit: 1000,
    },
    server: {
      host: '0.0.0.0',
      port: frontEndPort,
    }
  };
});
