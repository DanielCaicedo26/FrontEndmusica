import { BaseModel } from './base.model';

export interface Person extends BaseModel {
    firstName: string;
    lastName: string;
    identification: string;
    phoneNumber: string;
    address: string;
}

export interface CreatePersonRequest {
    firstName: string;
    lastName: string;
    identification: string;
    phoneNumber: string;
    address: string;
}

export interface UpdatePersonRequest {
    firstName?: string;
    lastName?: string;
    identification?: string;
    phoneNumber?: string;
    address?: string;
}
