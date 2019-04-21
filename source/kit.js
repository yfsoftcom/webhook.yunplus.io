const crypto = require('crypto')

const randomStr = (bytes = 4) => {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * AES encode 
 * @param { srouce content } src 
 * @param { seed } seed 
 */
const encodePassword = (src, seed = 'fpm') => {
  const cipher = crypto.createCipher('aes-256-cbc', seed)
  var crypted = cipher.update(src, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

const comparePassword = (password, encodedPassword) => {
  return (encodePassword(password) == encodedPassword)
}

exports.comparePassword = comparePassword
exports.encodePassword = encodePassword