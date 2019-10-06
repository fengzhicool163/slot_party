/**
 * Created by lixiaodong on 16/12/24.
 */

var crypto = require('crypto');
var encoding = require('encoding');
var constants = require('constants');

var privateKey = "-----BEGIN PRIVATE KEY-----\n\
MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAOOV6/9CfczqtwgW\n\
Y77n9dnnLMft7wDVGR6fxWVckDOcS3X4l3FklXzXYb8aBYNzgthY//9a3SfWtd4M\n\
SSerFOkwfNHzw1ZXEHgo5Jv2ttvlhEyvJhq/MACGotzkGEDinM/D3xUSLX+pxZgB\n\
Fr11Tqtzr8S7lm7YOg03CZh1EMDbAgMBAAECgYEAuQdQoW1LnehN+pNJcRJhfVFH\n\
xRwarlCSZaV79Ra2Xl95smXzqksehisN2zKqvN6SyJZDOzaCizszDV5rs4aSLiNk\n\
wQHWgMa4KhGvutZTbVBIz+G8xSq2LtnXBLHMumGzM8OJ9fMZGYfJR9VQmF4PgCgO\n\
/U68nDdqo8/oeWLW/YECQQD7IJAMRDwIqkeD0QFqCrTlNztq0eut4f2ePv/esL7S\n\
58CgOqZasAKuXFK+BFVV9BdS/vBmuRoFmHTTG7hgbyDhAkEA6ABrf/gDUxzglM8g\n\
LOo/wYhnXPa9OrRaGhvlql577biqSV6awq4PWIy9eIkj39tGNVrPeurnla9tO4pH\n\
YiDNOwJAI6LXTiZQrpobU+VQ4g9q5CwWTm5Dl4U+TDp8bMmACsXAW/x2pt/bQYrw\n\
Yu6SfYQJ20k6LBmQS8L6sQp5+5VJgQJAHZDwIj7ZLZ5ggJZk41R3C5L2mUJYm0Kg\n\
uPMVMcEYyhLeoLsNvgGwsvg8rT/M8ppfOC16g4+sM8dHhG766eaEQQJASpzhGNIW\n\
Z5kl+mb7w0NJCY8C0pHFGaiTXlUqG/MSeviwBp4Pctt4fuLdnGsJiqlykRRPuPC2\n\
cGEA2neH9XcB8Q==\n\
-----END PRIVATE KEY-----";


var privateKeyObj = {
    key :   privateKey,
    padding:constants.RSA_PKCS1_PADDING
}

function encrypt(formData){
    var encrypted = crypto.privateEncrypt(privateKeyObj,new Buffer(JSON.stringify(formData))).toString('base64');
    return encrypted;
}

//字节分组 128
function byte_split(buffer, number) {
    var bufferArray = [];

    for (var i = 0; i < buffer.length; i += number) {
        var temp = buffer.slice(i, i + number);
        bufferArray.push(temp);
    }
    return bufferArray;
}

function decrypt(encrypted) {
    //base64 解码
    var decrypted = new Buffer(encrypted,'base64');
    var bufferArray = byte_split(decrypted, 128);
    var final = '';

    for(var i = 0 ; i < bufferArray.length; i++){
        var decryptedFrag = crypto.privateDecrypt(privateKeyObj,bufferArray[i]);
        var decryptedStr = decryptedFrag.toString('utf8');
        for (var j = 0; j < decryptedStr.length; j++) {
            if (decryptedStr.charCodeAt(j)) {
                final += decryptedStr[j];
            }
        }
    }

    return JSON.parse(final);
}

module.exports = {
    encrypt :   encrypt,
    decrypt :   decrypt
}
