import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image, Button } from 'react-native';
import NewAccount from '@/app/modals/newAccountModal'; 
import styles from '@/app/styles/settingsStyles';
import DeleteConfirmationModal from '@/app/modals/deleteDataModal';

export default function SettingsScreen() {
  const xButton = require('@/assets/images/xButton.png');

  const [modalVisible, setModalVisible] = useState(false);
  const [newAccountModalVisible, setNewAccountModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);


  const openNewAccountModal = () => {
    setNewAccountModalVisible(true);
  };

  const closeNewAccountModal = () => {
    setNewAccountModalVisible(false);
  };

  const openDeleteModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleDelete = () => {
    console.log('Delete confirmed');
  };


  return (
    <View style={styles.container}>
      <Text style={styles.groupTitle}>Γενικά</Text>
      <View style={styles.groupContainer}>
        <TouchableOpacity style={styles.option} onPress={openNewAccountModal}>
          <Text style={styles.optionText}>Προσθήκη Λογαριασμού</Text>


        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Image source={{ uri: 'image.png' }} style={styles.icon} />
          <Text style={styles.optionText}>Ο Λογαριασμός μου</Text>
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
      <Text style={styles.groupTitle}>Επαναφορά</Text>
      <View style={styles.groupContainer}>
          <TouchableOpacity style={styles.option} onPress={() => setDeleteModalVisible(true)}>
            <Image source={{ uri: 'image.png' }} style={styles.icon} />
            <Text style={styles.optionText}>Διαγραφή Δεδομένων</Text>
        </TouchableOpacity>
      </View> 

            <Modal
        visible={newAccountModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={closeNewAccountModal}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={closeNewAccountModal}>
            <Image source={xButton} style={styles.closeButtonImage} />
          </TouchableOpacity>
          <NewAccount 
            isVisible={newAccountModalVisible} 
            onRequestClose={closeNewAccountModal} 
          />
        </View>
      </Modal>
      <DeleteConfirmationModal
        isVisible={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={handleDelete}
      />
      



    </View>
  );
};
