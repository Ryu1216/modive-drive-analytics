export type UserResponse = {
  userId: number;
  reward: number;
  nickname: string;
  name: string;
  email: string | null;
  birthdate: string | null;
  licenseDate: string | null;
  alarm: boolean;
  gender: 'male' | 'female' | null;
  phone: string | null;
};

export interface LoginWithKakaoRequest {
  accessToken: string;
}

export interface TokenRefreshRequest {
  accessToken: string;
  refreshToken: string;
}

export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
}