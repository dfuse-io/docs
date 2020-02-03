const { promisify } = require('util');
const { resolve, join, extname, dirname } = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);

function isEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

async function getFilePaths(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(
    subdirs.map(async subdir => {
      const foldersToExclude = ['node_modules', 'public'];
      if (foldersToExclude.includes(subdir)) return false;
      const res = resolve(dir, subdir);
      if ((await stat(res)).isDirectory()) {
        return getFilePaths(res);
      }
      const exts = ['.html', '.css', '.js', '.go', '.cpp', '.py'];
      if (exts.includes(extname(res))) {
        return res;
      }
      return false;
    })
  );
  return files.reduce((a, f) => (f ? a.concat(f) : a), []);
}

async function parseFiles(paths) {
  await Promise.all(
    paths.map(async p => {
      let fileToWrite = {};
      let fileExt = extname(p);
      let file = await readFile(p, 'utf8');
      let jsonFilePath = p
        .replace(/quickstarts.*/, 'data/quickstarts.json')
        .replace(/tutorials.*/, 'data/tutorials.json')
        .replace(/samples.*/, 'data/samples.json');
      let sectionNumber = 1;
      while (true) {
        let extractSectionPattern = new RegExp(
          `.+CODE:BEGIN:(\\S+${sectionNumber})\\n([\\s\\S]*)\n.+CODE:END:\\1`,
          'g'
        );
        let excludeTagsPattern = new RegExp(
          '^((?!CODE:BEGIN|CODE:END)[\\s\\S])+$',
          'gm'
        );
        let matches = extractSectionPattern.exec(file);
        if (!matches || matches.length <= 0) break;
        let cleanResults = matches[0].match(excludeTagsPattern);
        let sectionName = matches[1];
        if (!cleanResults || cleanResults.length <= 0) break;
        let section = {};
        section[sectionName] = '';
        cleanResults.forEach(
          codeBlock =>
            (section[sectionName] = section[sectionName].concat(codeBlock))
        );
        fileToWrite = { ...fileToWrite, ...section };
        sectionNumber++;
      }
      if (isEmpty(fileToWrite)) return;
      await mkdirp(dirname(jsonFilePath));
      fs.writeFile(jsonFilePath, JSON.stringify(fileToWrite, '', 2), err => {
        if (err) throw err;
      });
    })
  );
}

const foldersToExtract = ['quickstarts', 'tutorials', 'samples'];

foldersToExtract.forEach(folder => {
  getFilePaths(join(__dirname, folder))
    .then(filePaths => parseFiles(filePaths))
    .catch(e => console.error(e));
});
