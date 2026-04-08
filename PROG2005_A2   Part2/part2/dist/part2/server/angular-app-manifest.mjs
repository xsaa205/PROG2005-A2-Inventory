
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/inventory"
  },
  {
    "renderMode": 2,
    "route": "/search"
  },
  {
    "renderMode": 2,
    "route": "/help"
  },
  {
    "renderMode": 2,
    "route": "/privacy"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 430, hash: '9fce6d1a1f1c71ae6794438327665f381e31c0a692edba9438d3cee43badc4c1', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 943, hash: 'ae52cc2c8b66ab1d64f0c40e213d8a5bc34d64d196ea11cabf35932ccc8912f6', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 22777, hash: 'a2c3d760296563fd0768887ee550b725747d500f7a31aee3d32ee382821a97f8', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'inventory/index.html': {size: 27733, hash: '7bd71d69838de563f9fc398be10b21646c30e1363f604a100d43b75bce1f83b4', text: () => import('./assets-chunks/inventory_index_html.mjs').then(m => m.default)},
    'help/index.html': {size: 23833, hash: '7c6faa23462f3d0231a9fad716bf1789f120dbce5331ae30b2e38206d3442ad9', text: () => import('./assets-chunks/help_index_html.mjs').then(m => m.default)},
    'search/index.html': {size: 23675, hash: 'df6c236674e3447488b961549b424e49ef1291f24abad04ee8a24ecbb2d67803', text: () => import('./assets-chunks/search_index_html.mjs').then(m => m.default)},
    'privacy/index.html': {size: 23456, hash: 'a11834d5bfb86420cbb495c254dcbf116d523d10be290b5b61365342635754e8', text: () => import('./assets-chunks/privacy_index_html.mjs').then(m => m.default)},
    'styles-5INURTSO.css': {size: 0, hash: 'menYUTfbRu8', text: () => import('./assets-chunks/styles-5INURTSO_css.mjs').then(m => m.default)}
  },
};
