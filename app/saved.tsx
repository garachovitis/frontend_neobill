import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // Εικονίδια βελάκια

const months = [
  { name: 'Οκτώβριος 2024', companies: ['Cosmote', 'ΔΕΗ', 'ΔΕΥΑΠ'] },
  { name: 'Νοέμβριος 2024', companies: ['Cosmote', 'ΔΕΗ'] },
  { name: 'Δεκέμβριος 2024', companies: ['Cosmote', 'ΔΕΥΑΠ','Εθνική Ασφαλιστική'] },
  // Πρόσθεσε και άλλους μήνες
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
          {/* Header του Μήνα */}
          <TouchableOpacity style={styles.monthHeader} onPress={() => toggleMonth(month.name)}>
            <Text style={styles.monthText}>{month.name}</Text>
            <AntDesign
              name={openMonth === month.name ? 'up' : 'down'}
              size={20}
              color="#3b8193"
            />
          </TouchableOpacity>

          {/* Εταιρείες (Drop-down Links) */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#3b8193',
    marginVertical: 20,
  },
  monthContainer: {
    marginVertical: 10,
    marginHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  companyList: {
    paddingLeft: 15,
    paddingVertical: 5,
  },
  companyLink: {
    fontSize: 16,
    color: '#3b8193',
    textDecorationLine: 'underline',
    marginVertical: 3,
  },
});

export default Saved;