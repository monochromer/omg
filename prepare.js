const path = require('path');
const { parse: parseUrl } = require('url');
const fs = require('fs');
const http = require('http');

const browserSync = require('browser-sync').create();
const mkdirp = require('mkdirp');

function createIfNotExist(dir) {
  return new Promise((resolve, reject) => {
    mkdirp(dir, err => err ? reject(err): resolve());
  });
};

const {
  publicPath,
  siteURL,
  exts,
  srcPath
} = require('./config');

browserSync.init({
  proxy: {
    target: siteURL,
    middleware: [
      async function(req, res, next) {
        const url = req.url;
        let filename = path.basename(url);
        let ext = path.extname(url);
        let { pathname } = parseUrl(url);

        if (ext === '') {
          pathname += '/index.html';
        };

        await createIfNotExist(path.join(srcPath, path.dirname(pathname)));

        const file = fs.createWriteStream(path.join(srcPath, pathname));

        const request = http.get(siteURL + url, (response) => {
          response.pipe(file);
          next();
        });
      }
    ]
  }
});