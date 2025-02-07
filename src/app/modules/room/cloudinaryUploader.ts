import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

export const uploadToCloudinary = async (imageFiles: Express.Multer.File[]) => {
    //upload images to cloudinary
  
    const imagesPromises = imageFiles.map(async (image) => {
      const base64 = image.buffer.toString("base64");
      // const base64 = Buffer.from(image.buffer).toString("base64");
      const uploadedImage = await cloudinary.uploader.upload(
        `data:${image.mimetype};base64,${base64}`, //image Path (dynamicaly stores image in memory)
        {
          // format: "webp",
          folder: "HiveHaus", //cloudinary images folder name
        }
      );
      return uploadedImage.secure_url;
    });
  
    const imagesUrls = await Promise.all(imagesPromises);
    return imagesUrls;
  };

  const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5, //5mb file size
  },
});