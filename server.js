const path = require('path');
const fs = require('fs');
const http = require('http');
const browserSync = require('browser-sync').create();
const compression = require('compression');

const {
  publicPath,
  siteURL,
  exts,
  srcPath
} = require('./config');

browserSync.init({
  open: false,
  proxy: {
    target: siteURL
  },
  serveStatic: [{
    route: '/resources/images',
    dir: publicPath
  }],
  middleware: [
    compression()
  ]
});