import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
  FlatList,
  Image,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScheduleItem } from './components/ScheduleItem';
import { morningSchedule, nightSchedule, ScheduleItem as ScheduleItemType } from './mocks/schedule';

function MainContent() {
    const insets = useSafeAreaInsets();
    const [isNightPeriod, setIsNightPeriod] = useState(false);
    const [search, setSearch] = useState('');

    const schedules = isNightPeriod ? nightSchedule : morningSchedule;

    const filteredSchedules = schedules.filter((item) =>
      item.subject.toLowerCase().includes(search.toLowerCase())
    );

    const renderItem = ({ item }: { item: ScheduleItemType }) => (
      <ScheduleItem item={item} />
    );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={[styles.statusBarBackground, { height: insets.top }]} />

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
      >
        <View style={styles.header}>
          <Image
            source={require('./assets/android-icon-background.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Horário de Aulas</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Pesquisar disciplina..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Manhã</Text>
          <Switch
            value={isNightPeriod}
            onValueChange={setIsNightPeriod}
            trackColor={{ false: '#ED145B', true: '#ED145B' }}
            thumbColor={isNightPeriod ? '#363131f1' : '#fff'}
          />
          <Text style={styles.switchLabel}>Noite</Text>
        </View>

        <Text style={styles.currentPeriod}>
          Período: {isNightPeriod ? 'Noite' : 'Manhã'}
        </Text>

        <FlatList
          data={filteredSchedules}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
          scrollEnabled={false}
          ListEmptyComponent={
            <Text style={styles.emptyMessage}>
              Nenhuma aula cadastrada no período
            </Text>
          }
        />

        <TouchableOpacity style={styles.button} onPress={() => setSearch('')}>
          <Text style={styles.buttonText}>Limpar pesquisa</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MainContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  statusBarBackground: {
    backgroundColor: '#ED145B',
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ED145B',
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#fff',
    borderWidth: 2,
    borderColor: '#ED145B',
    marginBottom: 15,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  switchLabel: {
    fontSize: 16,
    color: '#fff',
    marginHorizontal: 10,
  },
  currentPeriod: {
    fontSize: 18,
    color: '#ED145B',
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: 'bold',
  },
  list: {
    marginBottom: 10,
  },
  emptyMessage: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 30,
  },
  button: {
    backgroundColor: '#ED145B',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

