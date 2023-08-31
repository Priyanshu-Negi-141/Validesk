const AWS = require('aws-sdk')
const multer = require('multer')
const fs = require('fs')
const sharp = require('sharp')


AWS.config.update({
    accessKeyId: 'AKIAZZQYAT4GWMMHNTIT',
    secretAccessKey: 'sSxc5ulSHh9ynPrZB4Ar6D8d4GXhL6mJgr9',
    region: 'ap-south-1'
  });


//   Upload photo









  const s3 = new AWS.S3()
const bucketName = "star-calibration"




module.exports = {}