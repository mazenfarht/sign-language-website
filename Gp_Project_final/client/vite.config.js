import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import { default as browserify } from 'browserify';

import { Buffer } from 'buffer';

export default defineConfig(({ command, mode }) => {
  
  const isBrowser = command === 'serve' && mode === 'development';

  if (isBrowser) {
    if (typeof globalThis.Buffer === 'undefined') {
      globalThis.Buffer = Buffer;
    }
  }

  return {
    plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
    optimizeDeps: {
      exclude: ['path', 'buffer', 'url', 'http'],
    },
    rollupInputOptions: {
      plugins: [
        {
          name: 'replace-node-modules',
          resolveId(id) {
            if (id === 'path' || id === 'buffer' || id === 'url' || id === 'http') {
              return id;
            }
            return null;
          },
          load(id) {
            if (id === 'path' || id === 'buffer' || id === 'url' || id === 'http') {
              return `export default require('browserify').resolve("${id}")`;
            }
            return null;
          },
        },
      ],
    },
  };
  
});