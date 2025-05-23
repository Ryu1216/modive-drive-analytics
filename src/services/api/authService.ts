import { TokenRefreshRequest, TokenRefreshResponse } from '../../types/user';
import authApi from '../../lib/authApi';

class AuthService {
  async kakaoLogin(accessToken: string) {
    const response = await authApi.post('/auth/kakao-login', { accessToken: accessToken });
    return response.data.data;
  }

  async refreshToken(data: TokenRefreshRequest): Promise<TokenRefreshResponse> {
    const response = await authApi.post('/auth/refresh', data);
    return response.data.data;
  }

  async logout(userId: string): Promise<void> {
    await authApi.post('/auth/logout', null, {
      params: { userId },
    });
  }

  async withdraw(userId: string): Promise<void> {
    await authApi.delete('/auth/withdraw', {
      params: { userId },
    });
  }
}

export const authService = new AuthService();