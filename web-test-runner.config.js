import { legacyPlugin } from '@web/dev-server-legacy';

export default {
  nodeResolve: true,
  files: ['test/**/*_test.js'],
  coverage: true,
  coverageConfig: {
    include: ['src/**/*.js'],
  },
  plugins: [
    // make sure this plugin is always last
    legacyPlugin({
      polyfills: {
        webcomponents: true,
        // Inject lit's polyfill-support module into test files, which is required
        // for interfacing with the webcomponents polyfills
        custom: [
          {
            name: 'lit-polyfill-support',
            path: 'node_modules/lit/polyfill-support.js',
            test: "!('attachShadow' in Element.prototype)",
            module: false,
          },
        ],
      },
    }),
  ],
  middleware: [
    function(context, next) {
      if (context.path.endsWith('.js')) {
        context.set('Content-Type', 'application/javascript');
      }
      return next();
    }
  ]
};