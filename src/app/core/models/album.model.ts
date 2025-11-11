import { BaseGenericModel } from './base.model';

export interface Album extends BaseGenericModel {
  releaseDate?: Date;
  coverImageUrl: string;
  artistId: number;
  artistName?: string;
}
