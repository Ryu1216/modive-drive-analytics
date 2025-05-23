import api from '../../lib/axios';
import { UserResponse } from '../../types/user';

export const userService = {
  async getMyInfo(): Promise<UserResponse> {
    const response = await api.get('/user/me');
    return response.data.data;
  },

  async deleteMyAccount(): Promise<void> {
    await api.delete('/user/me');
  },

  async getUserByNickname(nickname: string): Promise<UserResponse[]> {
    const response = await api.get('/user', { params: { search: nickname } });
    return response.data.data;
  },

  async getUserById(userId: string): Promise<UserResponse> {
    const response = await api.get(`/user/${userId}`);
    return response.data.data;
  },

  async deleteUserById(userId: string): Promise<void> {
    await api.delete(`/user/${userId}`);
  },

  async getUserList(): Promise<UserResponse[]> {
    const response = await api.get('/user/list');
    return response.data.data;
  },

  async checkDuplicateNickname(nickname: string): Promise<boolean> {
    const response = await api.get('/user/nickname', {
      params: { search: nickname },
    });
    return response.data.data;
  },

  async updateNickname(nickname: string): Promise<void> {
    await api.patch('/user/nickname', { nickname });
  },

  async updateAlarm(userId: number, alarm: boolean): Promise<void> {
    await api.patch(`/user/${userId}/alarm`, { alarm });
  },

  async updateReward(userId: string, reward: number): Promise<void> {
    await api.post(`/user/${userId}/reward`, { reward });
  },

  async getMyCars(): Promise<string[]> {
    const response = await api.get('/user/car');
    return response.data.data.numbers;
  },

  async registerCar(number: string): Promise<void> {
    await api.post('/user/car', { number });
  },

  async deleteCar(number: string): Promise<void> {
    await api.delete('/user/car', { data: { number } });
  }
};