/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {legacyPlugin} from '@web/dev-server-legacy';

const mode = process.env.MODE || 'dev';
if (!['dev', 'prod'].includes(mode)) {
  throw new Error(`MODE must be "dev" or "prod", was "${mode}"`);
}

export default {
  rootDir: 'src',
  nodeResolve: true,
  watch: true,
  appIndex: 'index.html',
  open: true,
  historyApiFallback: {
    index: 'index.html',
    disableDotRule: true
  },
  plugins: [
    legacyPlugin({
      polyfills: {
        // Manually imported in index.html file
        webcomponents: false,
      },
    }),
  ],
  middleware: [
    function(context, next) {
      if (context.path === '/node_modules/@reduxjs/toolkit/dist/redux-toolkit.esm.js') {
        context.body = `
          window.process = { env: { NODE_ENV: 'development' } };
          ${context.body}
        `;
      }
      return next();
    }
  ]
};
