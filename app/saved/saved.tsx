import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import styles from '@/app/saved/savedStyles';

const months = [
  { name: 'Οκτώβριος 2024', companies: ['Cosmote', 'ΔΕΗ', 'ΔΕΥΑΠ'] },
  { name: 'Νοέμβριος 2024', companies: ['Cosmote', 'ΔΕΗ'] },
  { name: 'Δεκέμβριος 2024', companies: ['Cosmote', 'ΔΕΥΑΠ','Εθνική Ασφαλιστική'] },
];

const Saved: React.FC = () => {
  const [openMonth, setOpenMonth] = useState<string | null>(null);

  const toggleMonth = (month: string) => {
    setOpenMonth((prev) => (prev === month ? null : month));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Αποθηκευμένοι Λογαριασμοί</Text>
      {months.map((month) => (
        <View key={month.name} style={styles.monthContainer}>
          <TouchableOpacity style={styles.monthHeader} onPress={() => toggleMonth(month.name)}>
            <Text style={styles.monthText}>{month.name}</Text>
            <AntDesign
              name={openMonth === month.name ? 'up' : 'down'}
              size={20}
              color="#3b8193"
            />
          </TouchableOpacity>

          {openMonth === month.name && (
            <View style={styles.companyList}>
              {month.companies.map((company, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => Linking.openURL('https://www.linkedin.com/company/billy-pays/')}
                >
                  <Text style={styles.companyLink}>{company}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

export default Saved;