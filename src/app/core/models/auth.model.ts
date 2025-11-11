export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  documentNumber: string;
  phone: string;
  address: string;
  birthDate: Date;
}

export interface AuthResponse {
  token: string;
  firstName?: string;
  lastName?: string;
  refreshToken?: string;
  user?: User;
}

export interface User {
  id: number;
  username: string;
  email: string;
  personId: number;
  roles: string[];
}
