var fs = require('fs')

const log = (message /*: string */) => {
  console.log(`[dotenv][DEBUG] ${message}`)
}

const getLatestFile = (path) => {
  const pathParts = path.split('/');
  const dir = pathParts.map(p => {
    return p.indexOf('.') > 0 ? '' : p
  }).join('/');

  try {
    const filenames = fs.readdirSync(dir)

    let latestVersion = -1
    let latestFile
    filenames.forEach(function(filename) {
      if(filename.indexOf('.env') >= 0) {
        const fileParts = filename.split('.')
        const fileIndex = fileParts[fileParts.length - 1] | 0
        if(fileIndex > latestVersion) {
          latestVersion = fileIndex
          latestFile = filename
        }
      }
    });

    return fs.readFileSync(dir + '/' + latestFile, 'utf-8');
  } catch (e) {
    return { error: e }
  }
}

function readEnvFile(path, latest, encoding) {
  if(latest) {
    return getLatestFile(path)
  } else {
    return fs.readFileSync(path, { encoding })
  }
}

module.exports.readEnvFile = readEnvFile;