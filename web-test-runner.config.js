import { playwrightLauncher } from '@web/test-runner-playwright';
import { esbuildPlugin } from '@web/dev-server-esbuild';

export default {
  files: 'test/**/*_test.js',
  nodeResolve: true,
  coverage: true,
  coverageConfig: {
    exclude: ['**/node_modules/**/*', '**/test/**/*'],
  },
  browsers: [playwrightLauncher({ product: 'chromium' })],
  plugins: [
    esbuildPlugin({ 
      ts: true,
      json: true,
      target: 'auto',
      define: {
        'process.env.NODE_ENV': '"test"',
        'process.env': '{}',
        'process': '{ env: { NODE_ENV: "test" } }'
      }
    })
  ],
  testFramework: {
    config: {
      ui: 'bdd',
      timeout: '2000'
    }
  },
  testRunnerHtml: testFramework => `
    <html>
      <head>
        <script type="module" src="/test/test-setup.js"></script>
        <script type="module" src="${testFramework}"></script>
      </head>
    </html>
  `
};