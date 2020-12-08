const app = getApp();

import md5 from 'md5.js';

function toBase64(data) {
  var toBase64Table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  var base64Pad = '=';
  var result = '';
  var length = data.length;
  var i;
  // Convert every three bytes to 4 ascii characters.                                                 
  for (i = 0; i < (length - 2); i += 3) {
    result += toBase64Table[data.charCodeAt(i) >> 2];
    result += toBase64Table[((data.charCodeAt(i) & 0x03) << 4) + (data.charCodeAt(i + 1) >> 4)];
    result += toBase64Table[((data.charCodeAt(i + 1) & 0x0f) << 2) + (data.charCodeAt(i + 2) >> 6)];
    result += toBase64Table[data.charCodeAt(i + 2) & 0x3f];
  }
  // Convert the remaining 1 or 2 bytes, pad out to 4 characters.                                     
  if (length % 3) {
    i = length - (length % 3);
    result += toBase64Table[data.charCodeAt(i) >> 2];
    if ((length % 3) == 2) {
      result += toBase64Table[((data.charCodeAt(i) & 0x03) << 4) + (data.charCodeAt(i + 1) >> 4)];
      result += toBase64Table[(data.charCodeAt(i + 1) & 0x0f) << 2];
      result += base64Pad;
    } else {
      result += toBase64Table[(data.charCodeAt(i) & 0x03) << 4];
      result += base64Pad + base64Pad;
    }
  }
  return result;
}
//-------------------

function srcHost(src) {
  var domain = src.split('/'); //以“/”进行分割

  domain = domain[0] + '//' + domain[2];

  return domain
}
//-------------------

function toThumbsimg(path, type, width, height) {
  // console.log(path)
  var str_md5 = md5.md5(path);
  var str_base64 = toBase64(path);
  var fileext = path.substring(path.lastIndexOf('.') + 1);
  type = type ? type : 37;
  var thumbs_path = '/thumbimg/' + str_md5[0] + '/' + str_md5[3] + '/' + width + '/' + height + '/' + type + '/' + str_base64 + '.auto.' + fileext;
  // console.log(thumbs_path)
  return srcHost(path) + thumbs_path;

}



module.exports = {
  toThumbsimg: toThumbsimg,
  toBase64: toBase64,
  srcHost: srcHost,
}
