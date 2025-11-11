import { BaseGenericModel } from './base.model';

export interface Song extends BaseGenericModel {
  durationSeconds: number;
  audioUrl: string;
  albumId: number;
  albumName?: string;
  genreId: number;
  genreName?: string;
}
