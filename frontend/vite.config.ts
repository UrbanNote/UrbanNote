import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-plugin-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
});
