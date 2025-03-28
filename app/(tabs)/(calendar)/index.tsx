import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';

const { width } = Dimensions.get('window');

export default function CalendarScreen() {
  const onDayPress = (day: { dateString: string; day: number; month: number; year: number }) => {
    console.log('Selected day:', day);
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={onDayPress}

        markedDates={{
          '2025-04-01': { selected: true, marked: true, selectedColor: '#37B7C3' },
        }}

        theme={{
          selectedDayBackgroundColor: '#37B7C3',
          todayTextColor: '#3b8193',
          dayTextColor: '#071952',
          arrowColor: '#3b8193',
          monthTextColor: '#071952',
          indicatorColor: '#37B7C3',
          textSectionTitleColor: '#3b8193',
          textDayFontWeight: 'bold',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: 'bold',
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
        // Style για να ταιριάζει στην οθόνη του κινητού
        style={styles.calendar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  calendar: {
    width: width * 0.9, 
    borderRadius: 10,   
    elevation: 3,       
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});