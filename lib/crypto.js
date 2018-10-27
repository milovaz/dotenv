var fs = require('fs')
var CryptoJS = require('crypto-js')

const getKeyIV = () => {
  let params = process.env.PARAPHRASE
  params = params.split(' ')
  return {
    key: params[0],
    iv: params[1]
  }
}

// Convert hex string to ASCII.
// See https://stackoverflow.com/questions/11889329/word-array-to-string
const hex2a = (hex) => {
  var str = ''
  for (var i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
  }
  return str
}

function decrypt (content) {
  const { key, iv } = getKeyIV()

  var content = content.toString()

  // Decrypt...
  var plaintextArray = CryptoJS.AES.decrypt(
    {
      ciphertext: CryptoJS.enc.Base64.parse(content),
      salt: ''
    },
    CryptoJS.enc.Hex.parse(key),
    { iv: CryptoJS.enc.Hex.parse(iv) }
  )

  return hex2a(plaintextArray.toString())
}

module.exports.decrypt = decrypt
