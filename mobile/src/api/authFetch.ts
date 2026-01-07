import { router } from 'expo-router';
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens
} from '../auth/tokenStore';
import { refreshToken } from '../auth/refresh';

export const authFetch = async (url: string, options: any = {}) => {
  let token = await getAccessToken();

  let res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (res.status === 401) {
    const refreshed = await refreshToken();

    if (!refreshed) {
      // 🔴 session is dead
      await clearTokens();
      router.replace('/'); // back to login
      throw new Error('Session expired');
    }

    // retry with new token
    token = await getAccessToken();

    res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  return res;
};
