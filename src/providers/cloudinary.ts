import { CloudinaryApiConfiguration, config, uploader } from "cloudinary";
import { PassThrough } from "stream";
import { Service } from "typedi";
import { Provider } from ".";

class CloudinaryImage {
  constructor(
    private readonly imageId: string,
    private readonly cloudName: string,
  ) { }

  public get url() : string {
    return `http://res.cloudinary.com/${this.cloudName}/image/upload/${this.imageId}`;
  }

  public squaredUrl(size: number) : string {
    return `http://res.cloudinary.com/${this.cloudName}/image/upload/w_${size},h_${size},c_fill/${this.imageId}`;
  }
}

@Service()
export class CloudinaryProvider implements Provider {
  private readonly cloudinaryConfig: CloudinaryApiConfiguration;

  constructor() {
    this.cloudinaryConfig = {
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    };
  }

  public async bootstrap() : Promise<void> {
    config(this.cloudinaryConfig);
  }

  public async shutdown() : Promise<void> {
    return;
  }

  public upload(imageBuffer: Buffer) : Promise<CloudinaryImage> {
    return new Promise((resolve, reject) => {
      const imageStream = new PassThrough();
      const uploadStream = uploader.upload_stream((result) => {
        if (result.error) {
          reject(new Error(result.error.message));
          return;
        }

        const imageName = result.public_id;
        const cloudName = this.cloudinaryConfig.cloud_name;
        const image = new CloudinaryImage(imageName, cloudName);

        resolve(image);
      });

      imageStream.end(imageBuffer);
      imageStream.pipe(uploadStream);
    });
  }
}
