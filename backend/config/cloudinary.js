import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

// Cloudinary configuration - ek baar config karo, har baar nahi
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (filePath) => {
  try {
    // Check if file exists
    if (!filePath) {
      console.log("No file path provided");
      return null;
    }

    // Check if file exists on disk
    if (!fs.existsSync(filePath)) {
      console.log("File does not exist at path:", filePath);
      return null;
    }

    console.log("Uploading file to Cloudinary:", filePath);

    // Upload to Cloudinary with better options
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: "virtual_assistant", // Organize uploads in folders
      resource_type: "auto",
      transformation: [
        { width: 500, height: 500, crop: "limit" }, // Resize if needed
        { quality: "auto" } // Auto optimize quality
      ]
    });

    console.log("Cloudinary upload successful:", uploadResult.secure_url);

    // Clean up local file after successful upload
    try {
      fs.unlinkSync(filePath);
      console.log("Local file deleted successfully");
    } catch (unlinkError) {
      console.log("Error deleting local file:", unlinkError);
    }

    return uploadResult.secure_url;

  } catch (error) {
    console.error("Cloudinary upload error:", error);
    
    // Clean up local file even if upload fails
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("Local file deleted after failed upload");
      }
    } catch (unlinkError) {
      console.log("Error deleting local file after failed upload:", unlinkError);
    }
    
    return null;
  }
};

export default uploadOnCloudinary;