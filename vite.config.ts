import { defineConfig, type Plugin } from 'vite';
import { readFileSync } from 'node:fs';

// Writes sw.js with a precache list of every file in the build, so the
// whole game works offline after the first visit.
function serviceWorker(): Plugin {
  return {
    name: 'word-bots-sw',
    apply: 'build',
    generateBundle(_opts, bundle) {
      const files = ['./', ...Object.keys(bundle).map((f) => './' + f)];
      const publicFiles = ['manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png'];
      for (const f of publicFiles) files.push('./' + f);
      const version = Date.now().toString(36);
      const template = readFileSync('src/sw-template.js', 'utf8');
      this.emitFile({
        type: 'asset',
        fileName: 'sw.js',
        source: template
          .replace('__VERSION__', version)
          .replace('__FILES__', JSON.stringify(files)),
      });
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [serviceWorker()],
});
