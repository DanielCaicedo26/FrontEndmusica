export interface BaseModel {
  id: number;
}

export interface BaseGenericModel extends BaseModel {
  name: string;
  description: string;
}
