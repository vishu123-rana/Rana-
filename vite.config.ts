import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  const rawUrl = process.env.VITE_SUPABASE_URL || '';
  const resolvedUrl = (rawUrl && rawUrl !== 'nqrkiqltalershurqasv')
    ? (rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}.supabase.co`)
    : 'https://jmgphiuxddonqdyeydjs.supabase.co';

  const rawKey = process.env.VITE_SUPABASE_ANON_KEY || '';
  const resolvedKey = (rawKey && !rawKey.includes('SJwgQ7rLjtmwKZMYuPLTag_A0AptYWI'))
    ? rawKey
    : 'sb_publishable_KASvUcGrsZjqWMKhZO1anA_0oZjyjxV';

  return {
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(resolvedUrl),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(resolvedKey),
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
