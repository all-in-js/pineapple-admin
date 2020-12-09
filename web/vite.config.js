const path = require('path');

module.exports = {
  alias: {
    '/@/': path.resolve(__dirname, 'src')
  },
  proxy: {
    '/v1/feicons': {
      target: 'http://localhost:8080',
      changeOrigin: true
    }
  }
}