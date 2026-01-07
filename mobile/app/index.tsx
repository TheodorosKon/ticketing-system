import { View, Text } from 'react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { getAccessToken } from '../src/auth/tokenStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function Login() {
  useEffect(() => {
    const autoLogin = async () => {
      const token = await getAccessToken();
      if (token) {
        router.replace('/tickets');
      }
    };
    autoLogin();
  }, []);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: '#5e5e5eff' }}>
      <StatusBar style="dark" />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Login Screen</Text>
      </View>
    </SafeAreaView>
  );
}
