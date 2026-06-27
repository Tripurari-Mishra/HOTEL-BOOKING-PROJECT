import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config();

// 1. Cloudinary ko tumhare .env wale credentials de kar configure kar rahe hain
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Multer ko batana ki files ko kis folder mein aur kis format mein save karna hai
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "stayNest_listings", // Cloudinary par is naam ka folder automatic ban jayega
    allowedFormats: ["png", "jpg", "jpeg"], // Sirf yahi image formats upload honge
  },
});

// 3. Inko export kar rahe hain taaki Routes file mein use kar sakein
export { cloudinary, storage };
