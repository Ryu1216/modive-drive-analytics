// src/lib/authApi.ts
import axios from 'axios';

const authApi = axios.create({
  baseURL: 'http://localhost:8080', // 실제 주소로 변경
});

export default authApi;
