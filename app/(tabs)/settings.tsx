import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import NewAccount from '@/app/newacc'; // Το αρχικό σου component

const Settings = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Πρώτη ομάδα */}
      <Text style={styles.groupTitle}>Γενικά</Text>
      <View style={styles.groupContainer}>
        <TouchableOpacity style={styles.option} onPress={openModal}>
          <Image source={{ uri: '@/assets/images/plus.png' }} style={styles.icon} />
          <Text style={styles.optionText}>Προσθήκη Λογαριασμού</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Image source={{ uri: 'image.png' }} style={styles.icon} />
          <Text style={styles.optionText}>Ο Λογαριασμός μου</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Image source={{ uri: 'image.png' }} style={styles.icon} />
          <Text style={styles.optionText}>Σκούρο Θέμα</Text>
        </TouchableOpacity>
      </View>

      {/* Δεύτερη ομάδα */}
      <Text style={styles.groupTitle}>Πληροφορίες</Text>
      <View style={styles.groupContainer}>
        <TouchableOpacity style={styles.option}>
          <Image source={{ uri: 'image.png' }} style={styles.icon} />
          <Text style={styles.optionText}>Σχετικά με εμάς</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Image source={{ uri: 'image.png' }} style={styles.icon} />
          <Text style={styles.optionText}>Επικοινωνία</Text>
        </TouchableOpacity>
      </View>

      {/* Modal για το NewAccount */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContent}>
          <NewAccount />
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>Κλείσιμο</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  groupContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    elevation: 2,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
  modalContent: {
    marginTop: 60,
    width: '99%',
    height: '65%',
    alignSelf: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  closeButton: {
    display: 'flex',
    height: 45,
    width: '70%', 
    padding: 10,
    backgroundColor: 'red', 
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
    
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    borderRadius: 18,
  },
});

export default Settings;
