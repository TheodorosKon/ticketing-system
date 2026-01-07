import * as SecureStore from 'expo-secure-store';

export const saveTokens = async (accessToken: string, refreshToken?: string) => {
  await SecureStore.setItemAsync('accessToken', accessToken);
  if (refreshToken) {
    await SecureStore.setItemAsync('refreshToken', refreshToken);
  }
};

export const getAccessToken = () =>
  SecureStore.getItemAsync('accessToken');

export const getRefreshToken = () =>
  SecureStore.getItemAsync('refreshToken');

export const clearTokens = async () => {
  await SecureStore.deleteItemAsync('accessToken');
  await SecureStore.deleteItemAsync('refreshToken');
};
