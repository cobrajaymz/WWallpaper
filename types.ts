export type AspectRatio = '16:9' | '9:16' | '4:3' | 'any';

export interface Wallpaper {
  id: string;
  previewUrl: string;
  sampleUrl: string;
  fileUrl: string;
  tags: string;
}