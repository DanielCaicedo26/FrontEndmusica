import { BaseGenericModel } from './base.model';

export interface Artist extends BaseGenericModel {
  country: string;
  debutDate?: Date;
}
