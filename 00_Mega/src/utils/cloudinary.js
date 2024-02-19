import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
//fs means file system -read write unlink-to remove
 
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadoncloudinary=async(localfilepath)=>{
    try {
        if(!localfilepath) return null
        //upload the file on cloudinary
        const response= await cloudinary.uploader.upload(localfilepath,{
            resource_type:"auto"
         })
         //file has been uploaded successfully
        //  console.log("file is uploaded on cloudinary: ",response.url)
        fs.unlinkSync(localfilepath)//after successfully upload remove the file
         return response
        } catch (error) {
        fs.unlinkSync(localfilepath)//remove the locally saved temp file as the 
        //upload got fail
        return null;
    }
}

export{uploadoncloudinary}
