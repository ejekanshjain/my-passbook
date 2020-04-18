const cryptr = require('cryptr')

const encrypt = (text, key) => {
    const cryptrObj = new cryptr(key)
    const encrypted = cryptrObj.encrypt(text)
    return encrypted
}

const decrypt = (text, key) => {
    const cryptrObj = new cryptr(key)
    const decrypted = cryptrObj.decrypt(text)
    return decrypted
}

module.exports = {
    encrypt,
    decrypt
}