const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.cloudName,
    api_key: process.env.apikey,
    api_secret: process.env.apiSecret

});

const storage = new CloudinaryStorage({
cloudinary,
params:{
    folder: 'FOOTY',
    allowedFormats: ['jpeg', 'png', 'jpg']
}
});
module.exports={
    cloudinary,
    storage
}