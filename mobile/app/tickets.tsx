import { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { authFetch } from '../src/api/authFetch';
import { API_URL } from '../src/config/api';
import { getAccessToken } from '../src/auth/tokenStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function Tickets() {
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await authFetch(`${API_URL}/tickets`);
      const data = await res.json();
      setTickets(data);
    };

    load();
  }, []);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: '#4b4b4bff' }}>
      <StatusBar style="dark" />
      <FlatList
        data={tickets}
        keyExtractor={(item) => String(item.ticket_id)}
        renderItem={({ item }) => (
          <View style={{ padding: 10 }}>
            <Text>{item.title}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
