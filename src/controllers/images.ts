import { Request } from "express";
import { JsonController, Post, Req, UploadedFile } from "routing-controllers";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { BaseController } from ".";
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
  public async upload(@Req() request: Request, @UploadedFile("image") uploadedImage: any) {
    const user = await this.getUserFromRequest(request);

    const { buffer, originalname } = uploadedImage;
    const image = await this.cloudinary.upload(buffer);

    if (user.mode === UserMode.Tenant) {
      user.bio.images.push(image.url);
      await this.users.save(user);
    }

    return {
      name: originalname,
      url: image.url,
    };
  }
}
