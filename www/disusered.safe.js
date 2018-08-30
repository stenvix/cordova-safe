/**
 * disusered.safe.js
 *
 * @overview Easy to use cryptographic operations for Cordova.
 * @author Carlos Antonio
 * @license MIT
*/

var exec = require('cordova/exec');

var safe = {
  /**
   * encrypt
   * 
   * @param {DirEntry} sourceDir File source dir
   * @param {DirEntry} destDir File destination dir
   * @param {String} path File name
   * @param {String} password Password for encryption
   * @param {Function} success Success callback
   * @param {Function} error Failure callback
   * @returns {void}
   */
  encrypt: function(sourceDir, destDir, path, password, success, error) {
    var encryptSuccess, encryptError;
    var dirEntry = destDir;
    var fileName = getFileName(path);

    if (!sourceDir || !destDir || !fileName || arguments.length === 0) return;
    
    encryptSuccess = onSuccess.bind(null, success, dirEntry);
    encryptError = onError.bind(null, error, dirEntry);
    
    copyFile(sourceDir, destDir, fileName, function(fileEntry){
      var uri = cleanPath(fileEntry.nativeURL);
      exec(encryptSuccess, encryptError, 'Safe', 'encrypt', [uri, password]);
    }, encryptError)    
  },

  /**
   * decrypt
   *
   * @param {DirEntry} sourceDir File source dir
   * @param {DirEntry} destDir File destination dir
   * @param {String} path File name
   * @param {String} password Password for encryption
   * @param {Function} success Success callback
   * @param {Function} error Failure callback
   * @returns {void}
   */
  decrypt: function(sourceDir, destDir, path, password, success, error) {
    var decryptSuccess, decryptError;
    var dirEntry = destDir;
    var fileName = getFileName(path);

    if (!sourceDir || !destDir || !fileName || arguments.length === 0) return;
    
    decryptSuccess = onSuccess.bind(null, success, dirEntry);
    decryptError = onError.bind(null, error, dirEntry);

    copyFile(sourceDir, destDir, fileName, function(fileEntry){
      var uri = cleanPath(fileEntry.nativeURL);
      exec(decryptSuccess, decryptError, 'Safe', 'decrypt', [uri, password]);
    }, decryptError)
  }
};

/**
 * onSuccess
 *
 * @param {Function} success Success callback
 * @param {String} path Encrypted file URI
 * @param {DirEntry} dirEntry File system dir entry
 * @returns {String} Encrypted file URI
 */
function onSuccess(success, dirEntry, path) {
  if (typeof success === 'function') {
    dirEntry.getFile(getFileName(path), {create: false}, function(file) {
      success(file);
    }, onError);
  }
}

/**
 * onError
 *
 * @param {String} error Error callback
 * @param {Function} code Error code
 * @returns {String} Decrypted file URI
 * @param {DirEntry} dirEntry File system dir entry
 */
function onError(error, dirEntry, code) {
  if (typeof error === 'function') error(code);
  return code;
}

/**
 * getFileName
 *
 * @param {String} path File path
 * @returns {String} File name
 */
function getFileName(path){
  return path.split('/').pop();
}

/**
 * getFileName
 *
 * @param {String} path File path
 * @returns {String} Clean file path
 */
function cleanPath(path){
  return path.split('file://').pop();
}

/**
 * copyFile
 * @param {DirEntry} sourceDir File source dir
 * @param {DirEntry} destDir File destination dir
 * @param {Function} success Success callback
 * @param {Function} error Failure callback
 * @returns {void}
 */
function copyFile(sourceDir, destDir, fileName, success, error){
  sourceDir.getFile(fileName, {create: false} ,function(fileEntry){
    console.log("File founded "+ fileEntry.nativeURL);
    fileEntry.copyTo(destDir, fileEntry.name, function(destFile){
      console.log("File successfully copied " + destFile.nativeURL);
      success(destFile);
    }, error)
  }, error)    
}

exports.safe = safe;
