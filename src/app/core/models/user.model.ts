
import { BaseModel } from './base.model';
import { Person } from './person.model';

export interface AppUser extends BaseModel {
    name: string;
    email: string;
    personId: number;
    person?: Person;
    roles?: string[];
    isActive?: boolean;
}

export interface CreateAppUserRequest {
    name: string;
    email: string;
    password: string;
    personId: number;
}

export interface UpdateAppUserRequest {
    name?: string;
    email?: string;
    password?: string;
    personId?: number;
}
