interface StaticImageAsset {
  src: string;
  height: number;
  width: number;
  blurDataURL?: string;
  blurWidth?: number;
  blurHeight?: number;
}

declare module "*.webp" {
  const source: StaticImageAsset;
  export default source;
}

declare module "*.jpg" {
  const source: StaticImageAsset;
  export default source;
}

declare module "*.jpeg" {
  const source: StaticImageAsset;
  export default source;
}

declare module "*.webp" {
  const source: StaticImageAsset;
  export default source;
}

declare module "*.avif" {
  const source: StaticImageAsset;
  export default source;
}

declare module "*.svg" {
  const source: string;
  export default source;
}
