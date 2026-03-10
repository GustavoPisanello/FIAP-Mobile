import { View, Text, StyleSheet } from 'react-native';
import { ScheduleItem as ScheduleItemType } from '../mocks/schedule';

interface ScheduleItemProps {
  item: ScheduleItemType;
}

export function ScheduleItem({ item }: ScheduleItemProps) {
  return (
    <View style={[styles.container, item.subject === 'Intervalo' && styles.breakItem]}>
      <View style={styles.info}>
        <Text style={styles.subject}>{item.subject}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      <Text style={styles.room}>{item.room}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#ED145B',
  },
  breakItem: {
    backgroundColor: '#2a2a2a',
    borderLeftColor: '#666',
  },
  info: {
    flex: 1,
  },
  subject: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  time: {
    fontSize: 14,
    color: '#ED145B',
  },
  room: {
    fontSize: 14,
    color: '#fff',
    backgroundColor: '#ED145B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    overflow: 'hidden',
  },
});