declare module "sha.js" {
  type ShaAlgorithm = "sha" | "sha1" | "sha224" | "sha256" | "sha384" | "sha512";
  type DigestMethod = "hex";

  class sha {
    update(data: any) : this;
    digest(method: DigestMethod) : string;
  }

  export class sha1 extends sha { }
  export class sha224 extends sha { }
  export class sha256 extends sha { }
  export class sha384 extends sha { }
  export class sha512 extends sha { }

  export default function (algorithm: ShaAlgorithm) : sha;
}
