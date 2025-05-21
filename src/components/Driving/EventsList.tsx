import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { TimeEvent } from '../../types/driving';

interface EventsListProps {
  events: TimeEvent[];
  title: string;
  showDuration?: boolean;
}

const EventsList: React.FC<EventsListProps> = ({
  events,
  title,
  showDuration = true,
}) => {
  return (
    <View style={styles.eventsListContainer}>
      <Text style={styles.eventsListTitle}>{title}</Text>
      <View style={styles.eventsList}>
        {events.map((event: any, index) => (
          <View key={index} style={styles.eventItem}>
            <Text style={styles.eventIndex}>#{index + 1}</Text>
            <Text style={styles.eventTime}>
              {event.formattedTime}
              {event.formattedEndTime && ` ~ ${event.formattedEndTime}`}
            </Text>
            {showDuration && event.duration ? (
              <Text style={styles.eventDuration}>{event.duration}초</Text>
            ) : (
              <Icon name="alert-triangle" size={16} color="#E53E3E" />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  eventsListContainer: {
    marginTop: 24,
    width: '100%',
    padding: 16,
    backgroundColor: 'rgba(187, 39, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(187, 39, 255, 0.2)',
  },
  eventsListTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 12,
    textAlign: 'center',
  },
  eventsList: {
    width: '100%',
  },
  eventItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(203, 213, 224, 0.3)',
  },
  eventIndex: {
    fontSize: 14,
    fontWeight: '600',
    color: '#BB27FF',
    width: 30,
  },
  eventTime: {
    fontSize: 14,
    color: '#2D3748',
    flex: 1,
  },
  eventDuration: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E53E3E',
    marginLeft: 8,
  },
});

export default EventsList;