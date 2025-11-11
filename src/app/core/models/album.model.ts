import { BaseGenericModel } from './base.model';

export interface Album extends BaseGenericModel {
  description: string;
  releaseDate: Date | string;
  coverImageUrl: string;
  artistId: number;
  artistName?: string;
}

export interface CreateAlbumDto {
  id?: number;
  name: string;
  description: string;
  releaseDate: string;
  coverImageUrl: string;
  artistId: number;
}
