export const RES_IMAGES = '/resources/images';

export function img(name) {
  return `${RES_IMAGES}/${name}`;
}

export const assetUrl = img;