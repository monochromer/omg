const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');
const imageminGifsicle = require('imagemin-gifsicle');

const {
  publicPath,
  siteURL,
  exts,
  srcPath
} = require('./config');

const fileExts = exts.map(ext => ext.slice(1)).join(',');

imagemin([`${srcPath}/**/*.{${fileExts}}`], publicPath, {
  use: [
    imageminJpegtran({
      progressive: true
    }),
    imageminPngquant({
      quality: '65-80'
    }),
    imageminSvgo(),
    imageminGifsicle()
  ]
}).then(files => {
  console.log('done');
});