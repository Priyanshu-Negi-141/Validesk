const {S3Client, GetObjectCommand, PutObjectCommand} = require("@aws-sdk/client-s3")
const {getSignedUrl} = require("@aws-sdk/s3-request-presigner")


const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: "AKIAZZQYAT4GWMMHNTIT",
        secretAccessKey:"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",
    }
}) 

const getObjectURL = async(key) => {
    const command = new GetObjectCommand({
        Bucket:'star-calibration', Key : key
    })
    const signedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 60, // URL expires in 1 hour
        responseContentDisposition: undefined, // Exclude Content-Disposition header
        responseContentType: 'image/png' // Set appropriate Content-Type
    });
    return signedUrl    
}

const putObject = async(fileName, contentType) => {
    const command = new PutObjectCommand({
        Bucket: 'star-calibration',
        Key: `/uploads/employee/check-in/${fileName}`, // File name you want to save as in your bucket.
        ContentType:`${contentType}` ,// file type of the uploaded file
    })
    const url = await getSignedUrl(s3Client, command)
    console.log(command)
    return url 
}
// /uploads/employee/check-in/image-1693468762430.png
// https://star-calibration.s3.ap-south-1.amazonaws.com//uploads/employee/check-in/image-1693468762430.png?X-Amz-Algorith20230831T075923Z&X-Amz-Expires=900&X-Amz-Signature=f0fd0bf40011a5ed3fe8371c65740ca15e0fe9cb95624f0bbb51651a5ee497cd&X-Amz-SignedHeaders=host&x-id=PutObject
async function init(){
    console.log("URL for Saved Image", await getObjectURL('/uploads/employee/check-in/image-1693469097001.png'))
    // console.log("URL for uploading", await putObject(`image-${Date.now()}.png`, "image/png"))
}

// async function init() {
//     try {
//         const imageUrl = await getObjectURL('/uploads/employee/check-in/image-1693399637829.jpeg');
//         console.log("URL for Saved Image:", imageUrl);
//     } catch (err) {
//         console.error("Error:", err);
//     }
// }

// init()
 
module.exports = {putObject}


