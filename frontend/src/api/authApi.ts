import axiosClient from './axiosClient';

const authApi = {
  login: (data: { email: string; password: string }) => axiosClient.post('/auth/login', data),
  register: (data: { email: string; username: string; password: string }) => axiosClient.post('/auth/register', data),
};

export default authApi;

