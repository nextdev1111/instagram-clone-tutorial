// 👇 Notice that cloudinary is important from local file.
import cloundinary from "./cloundinary";
import type { uploadCloudinaryOptions } from "../typing.d";
import type { UploadApiResponse } from "cloudinary";

export class CloudinaryFunctions {
  constructor() {}

  uploadImage(
    file: string,
    options: uploadCloudinaryOptions
  ): Promise<UploadApiResponse> {
    return new Promise(async (resolve, reject) => {
      try {
        const result: UploadApiResponse = await cloundinary.uploader.upload(
          file,
          options
        );

        resolve(result);
      } catch (error: any) {
        throw error;
      }
    });
  }
}

// instance of CloudinaryFunctions class
const cloudinaryFunctions = new CloudinaryFunctions();

export default cloudinaryFunctions;
