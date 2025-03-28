import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { deleteAllData } from '@/scripts/database';

interface DeleteConfirmationModalProps {
  isVisible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isVisible,
  onCancel,
  onConfirm,
}) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const xButton = require('@/assets/images/xButton.png');

  const handleDelete = async () => {
    try {
      await deleteAllData(); 
      console.log('All data successfully deleted');
      
      onCancel(); 
    } catch (error) {
      console.error('Error while deleting data:', error);
    } finally {
      console.log('Setting success modal state...');
      setTimeout(() => {
        setShowSuccessModal(true); 
      }, 100);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    onConfirm(); 
  };

  return (
    <>
      <Modal
        transparent
        animationType="fade"
        visible={isVisible}
        onRequestClose={onCancel}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
              <Image source={xButton} style={styles.closeButtonImage} />
            </TouchableOpacity>

            <View style={styles.iconContainer}>
              <Text style={styles.icon}>✖️</Text>
            </View>

            <Text style={styles.title}>Είστε σίγουροι;</Text>
            <Text style={styles.message}>
              Θέλετε σίγουρα να διαγράψετε όλα τα δεδομένα της εφαρμογής από τη συσκευή σας; 
              Αυτή η διαδικασία δεν μπορεί να αναιρεθεί.
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.cancelButtonText}>Ακύρο</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteButtonText}>Διαγραφή</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        transparent
        animationType="fade"
        visible={showSuccessModal}
        onRequestClose={handleCloseSuccessModal}
      >
        <View style={styles.overlay}>
          <View style={styles.successModalContainer}>
            <Text style={styles.successTitle}>Επιτυχής Διαγραφή</Text>
            <Text style={styles.successMessage}>
              Τα δεδομένα διαγράφηκαν με επιτυχία από τη συσκευή σας.
            </Text>
            <TouchableOpacity
              style={styles.successButton}
              onPress={handleCloseSuccessModal}
            >
              <Text style={styles.successButtonText}>Κλείσιμο</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  closeButtonImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  iconContainer: {
    backgroundColor: '#FEECEC',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 32,
    color: '#F44336',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#555',
    fontWeight: 'bold',
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#F44336',
    borderRadius: 20,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },

  successModalContainer: {
    backgroundColor: '#fff',
    width: '75%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  successButton: {
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
  },
  successButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DeleteConfirmationModal;