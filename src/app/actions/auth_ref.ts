// // Authentication Service

// import { api, markAuthSessionPresent, hasAuthSessionHint } from '../api-client';
// import { transformUser } from '../transformers';
// import type { User } from '../../types';
// import type {
//   BackendUser,
//   BackendUserLoginRequest,
//   BackendUserRegisterRequest,
//   BackendAuthResponse,
// } from '../backend-types';

// export interface LoginCredentials {
//   email: string;
//   password: string;
// }

// export interface RegisterData {
//   email: string;
//   password: string;
//   name: string;
// }

// export interface AuthResult {
//   user: User;
//   accessToken: string;
//   refreshToken: string;
//   expiresIn: number;
// }

// export const authService = {
//   /**
//    * Register a new user
//    */
//   async register(data: RegisterData): Promise<AuthResult> {
//     const payload: BackendUserRegisterRequest = {
//       email: data.email,
//       password: data.password,
//       name: data.name,
//     };

//     const response = await api.post<BackendAuthResponse>('/auth/register', payload, {
//       skipAuth: true,
//     });

//     api.clearLegacyClientTokens();
//     markAuthSessionPresent();

//     return {
//       user: transformUser(response.user),
//       accessToken: response.tokens.access_token,
//       refreshToken: response.tokens.refresh_token,
//       expiresIn: response.tokens.expires_in,
//     };
//   },

//   /**
//    * Login with email and password
//    */
//   async login(credentials: LoginCredentials): Promise<AuthResult> {
//     const payload: BackendUserLoginRequest = {
//       email: credentials.email,
//       password: credentials.password,
//     };

//     const response = await api.post<BackendAuthResponse>('/auth/login', payload, {
//       skipAuth: true,
//     });

//     api.clearLegacyClientTokens();
//     markAuthSessionPresent();

//     return {
//       user: transformUser(response.user),
//       accessToken: response.tokens.access_token,
//       refreshToken: response.tokens.refresh_token,
//       expiresIn: response.tokens.expires_in,
//     };
//   },

//   /**
//    * Logout current user
//    */
//   async logout(): Promise<void> {
//     try {
//       await api.post('/auth/logout');
//     } finally {
//       // Always clear tokens, even if the API call fails
//       api.clearTokens();
//     }
//   },

//   /**
//    * Get current authenticated user
//    */
//   async getCurrentUser(): Promise<User> {
//     const data = await api.get<BackendUser>('/auth/me');
//     return transformUser(data);
//   },

//   /**
//    * Update current user profile
//    */
//   async updateProfile(updates: { name?: string; avatar?: string }): Promise<User> {
//     const data = await api.put<BackendUser>('/auth/me', updates);
//     return transformUser(data);
//   },

//   /**
//    * Check if user is authenticated
//    */
//   isAuthenticated(): boolean {
//     return hasAuthSessionHint();
//   },

//   /**
//    * Get all registered users matching query
//    */
//   async getAllUsers(): Promise<User[]> {
//     const data = await api.get<BackendUser[]>('/auth/users');
//     // Ensure data is array
//     const users = Array.isArray(data) ? data : [];
//     return users.map(transformUser);
//   },
// };
