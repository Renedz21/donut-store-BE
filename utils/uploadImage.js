import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';

dotenv.config();

const cloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
}

cloudinary.config(cloudinaryConfig);

export const uploadImage = async (url, folderName) => {
    try {

        const options = {
            folder: folderName,
            use_filename: true,
        }

        const photoUrl = await cloudinary.uploader.upload(url, options);
        return photoUrl.url;

    } catch (error) {
        throw new Error(error);
    }
};