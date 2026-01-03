import axiosInstance from './axios';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types/auth.types';

export const authApi = {
  // Register new user
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  // Login user
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await axiosInstance.get<User>('/users/me');
    return response.data;
  },
};