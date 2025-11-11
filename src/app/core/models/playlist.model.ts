import { BaseGenericModel } from './base.model';

export interface Playlist extends BaseGenericModel {
  userId: number;
  userName?: string;
  isPublic: boolean;
}
