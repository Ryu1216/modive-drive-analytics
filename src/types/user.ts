export type UserResponse = {
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
