import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import NewAccount from '@/app/newacc'; 
import styles from '@/app/styles/settingsStyles';

const Settings = () => {
  const xButton = require('@/assets/images/xButton.png');

  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
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

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Image source={xButton} style={styles.closeButtonImage} />
            </TouchableOpacity>
          <NewAccount />
        </View>
      </Modal>
    </View>
  );
};


export default Settings;