var fs = require('fs')

const log = (message /*: string */) => {
  console.log(`[dotenv][DEBUG] ${message}`)
}

const getLatestFile = (path, name, encoding) => {
  const pathParts = path.split('/');
  const dir = pathParts.map(p => {
    return p.indexOf('.') > 0 ? '' : p
  }).join('/');

  try {
    const filenames = fs.readdirSync(dir)

    let latestVersion = -1
    let latestFile
    filenames.forEach(function(filename) {
      if((name && filename.indexOf(name)) || (!name && filename.indexOf('.env') >= 0)) {
        const fileParts = filename.split('.')
        const fileIndex = fileParts[fileParts.length - 1] | 0
        if(fileIndex > latestVersion) {
          latestVersion = fileIndex
          latestFile = filename
        }
      }
    });

    console.log(`Reading ${dir}/${latestFile}`)

    return fs.readFileSync(`${dir}/${latestFile}`, { encoding });
  } catch (e) {
    return { error: e }
  }
}

const getMultipleFiles = (path, encoding) => {
  const pathParts = path.split('/');
  const dir = pathParts.map(p => {
    return p.indexOf('.') > 0 ? '' : p
  }).join('/')

  if(dir[dir.length - 1] === '/') {
    dir = dir.subscrint(0, dir.length - 1)
  }
  
  const filenames = fs.readdirSync(dir)
  let envFiles = []
  filenames.forEach(function(filename) {
    const fileParts = filename.split('.')
    const fileIndex = fileParts[fileParts.length - 1] | 0
    const latestVersionIndex = envFiles.length > 0 ? envFiles.findIndex(e => e.name === fileParts[0]) : -1

    if(latestVersionIndex >= 0) {
      if(fileIndex > envFiles[latestVersionIndex].index) {
        envFiles[latestVersionIndex] = {name: fileParts[0], index: fileIndex}
      }
    } else {
      envFiles.push({name: fileParts[0], index: fileIndex});
    }
  });

  if(envFiles.length > 0) {
    let aggregatedEnvContent = ''
    envFiles.forEach(env => {
      const content = fs.readFileSync(`${dir}/${env.name}`, { encoding })
      aggregatedEnvContent += `${content}`
    })

    return aggregatedEnvContent
  }

  return ''
}

function readEnvFile(path, multiple, encoding) {
  if(multiple) {
    return getMultipleFiles(path, encoding)
  } else {
    return getLatestFile(path, multiple, encoding)
  }
}

module.exports.readEnvFile = readEnvFile;