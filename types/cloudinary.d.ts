declare module "cloudinary" {
  import { Writable } from "stream";

  export interface CloudinaryApiConfiguration {
    cloud_name: string;
    api_key: string;
    api_secret: string;
  }

  export interface CloudinaryUploadError {
    message: string;
    http_code: number;
  }

  export interface CloudinaryUploadResult {
    public_id: string;
    format: string;
    url: string;
    error?: CloudinaryUploadError;
  }

  export interface CloudinaryStreamUploadConfiguration { }

  interface CloudinaryUploader {
    upload_stream(callback: (result: CloudinaryUploadResult) => void, config?: CloudinaryStreamUploadConfiguration) : Writable;
  }

  export function config(config: CloudinaryApiConfiguration) : void;
  export const uploader: CloudinaryUploader;
}
