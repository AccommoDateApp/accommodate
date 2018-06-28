import { Request } from "express";
import { BodyParam, JsonController, Post, Req, UploadedFile } from "routing-controllers";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { BaseController } from ".";
import { LandlordBiography } from "../entity/LandlordBiography";
import { TenantBiography } from "../entity/TenantBiography";
import { User, UserMode } from "../entity/User";
import { CloudinaryProvider } from "../providers/cloudinary";

@JsonController("/images")
export class ImagesController extends BaseController {
  constructor(
    @InjectRepository(User)
    protected readonly users: Repository<User>,
    private readonly cloudinary: CloudinaryProvider,
  ) {
    super(users);
  }

  @Post("/profile")
  public async uploadProfileImage(@Req() request: Request, @UploadedFile("image") uploadedImage: any) {
    const user = await this.getUserFromRequest(request);

    if (user.mode === UserMode.Tenant) {
      const image = await this.uploadImage(uploadedImage);
      const bio = user.bio as TenantBiography;

      bio.images.push(image.url);
      await this.users.save(user);

      return image.url;
    }

    throw new Error("not a tenant");
  }

  @Post("/accommodation")
  public async uploadAccommodationImage(@Req() request: Request, @UploadedFile("image") uploadedImage: any, @BodyParam("id") id: string) {
    const user = await this.getUserFromRequest(request);

    if (user.mode === UserMode.Landlord) {
      const bio = user.bio as LandlordBiography;

      for (const estate of bio.realEstates) {
        if (estate.id.toHexString() === id) {
          const image = await this.uploadImage(uploadedImage);

          estate.images.push(image.url);
          await this.users.save(user);

          return image.url;
        }
      }

      throw new Error("no such real estate");
    }

    throw new Error("not a landlord");
  }

  private async uploadImage(image: any) {
    const { buffer } = image;

    return await this.cloudinary.upload(buffer);
  }
}
