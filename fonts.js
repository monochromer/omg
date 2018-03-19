const { promisify } = require('util');
const path = require('path');
const fs = require('fs');
const childProcess = require('child_process')

const chalk = require('chalk');
const filesize = require('filesize');

const execFile = promisify(childProcess.execFile);
const stat = promisify(fs.stat);

const mapArgsToArr = (o) => Object.keys(o)
  .filter(key => !!o[key])
  .map((key) => typeof o[key] === 'boolean' && o[key] ? `--${key}` : `--${key}=${o[key]}`);


async function processFont({ inputFile, outputFile, ...opts }) {
  const utilityName = 'pyftsubset';

  const args = {
    'output-file': outputFile,
    'text-file': opts['text-file'],
    'flavor': opts['format'] === 'ttf' ? false : opts['format'],
    'with-zopfli': opts['format'] === 'woff' ? true: false,
    'layout-features': '"*"'
  };

  const { stdout, stderr } = await execFile(utilityName, [ inputFile, ...mapArgsToArr(args) ]);

  const [ inputStat, outputStat ] = await Promise.all([
    stat(inputFile),
    stat(outputFile)
  ]);

  console.log(
    'input: ' + inputFile + ' ' + chalk.red(filesize(inputStat.size)) + '\n' +
    'putput: ' + outputFile + ' ' + chalk.green(filesize(outputStat.size))
  );

  return { stdout, stderr };
}


async function processFonts({ files, outputDir, formats, ...args }) {
  return await Promise.all(formats.map(format => {
    return Promise.all(files.map(file => {
      return processFont({
        inputFile: file,
        outputFile: path.join(outputDir, path.parse(file).name + `.${format}`),
        format,
        ...args
      });
    }));
  }));
};


(async function main() {
  const inputDir = 'TTF';
  const files = fs.readdirSync(inputDir)
    .filter(file => path.extname(file) === '.ttf')
    .map(file => path.join(inputDir, file));

  const outputDir = 'dist';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(path.join(outputDir));
  }

  const res = await processFonts({
    files,
    outputDir,
    formats: ['ttf', 'woff', 'woff2'],
    'text-file': 'text.txt'
  });
})();
