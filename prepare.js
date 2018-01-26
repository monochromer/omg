const path = require('path');
const fs = require('fs');
const http = require('http');
const browserSync = require('browser-sync').create();

const {
  publicPath,
  siteURL,
  exts,
  srcPath
} = require('./config');

browserSync.init({
  open: false,
  proxy: {
    target: siteURL,
    middleware: [
      (req, res, next) => {
        const url = req.url;
        const filename = path.basename(url);
        const ext = path.extname(url);

        if (exts.indexOf(ext) < 0) {
          return next();
        };

        const file = fs.createWriteStream(path.join(srcPath, filename));
        const request = http.get(siteURL + url, (response) => {
          response.pipe(file);
          next();
        });
      }
    ]
  }
});