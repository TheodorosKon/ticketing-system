import { getRefreshToken, saveTokens } from './tokenStore';

export const refreshToken = async (): Promise<boolean> => {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return false;

  const res = await fetch('http://192.168.178.50:3000/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });

  if (!res.ok) return false;

  const data = await res.json();
  await saveTokens(data.accessToken, refreshToken);
  return true;
};
