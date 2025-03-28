import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import styles from '@/app/(tabs)/(categories)/StylesCategories';

interface Props {
    visible: boolean;
    onClose: () => void;
    onAddCategory: (emoji: string, name: string) => void;
    newCategory: { emoji: string; name: string };
    setNewCategory: (category: { emoji: string; name: string }) => void;
}

const AddCategoryModal: React.FC<Props> = ({ visible, onClose, onAddCategory, newCategory, setNewCategory }) => {
    
    const handleSave = () => {
        const { emoji, name } = newCategory;

        if (!emoji || !name) {
            Alert.alert('Παρακαλώ συμπληρώστε όλα τα πεδία.');
            return;
        }
        onAddCategory(emoji, name);
        setNewCategory({ emoji: '', name: '' });
    };

    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Προσθήκη Κατηγορίας</Text>
                    
                    <TextInput
                        style={styles.inputField}
                        placeholder="Emoji"
                        value={newCategory.emoji}
                        onChangeText={(text) => setNewCategory({ ...newCategory, emoji: text })}
                        autoCapitalize="none"
                        autoComplete="off"
                        autoCorrect={false}
                    />
                    
                    <TextInput
                        style={styles.inputField}
                        placeholder="Όνομα κατηγορίας"
                        value={newCategory.name}
                        onChangeText={(text) => setNewCategory({ ...newCategory, name: text })}
                        autoCapitalize="none"
                        autoComplete="off"
                        autoCorrect={false}
                    />

                    <View style={styles.modalActions}>
                        <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
                            <Text style={styles.btnText}>Άκυρο</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
                            <Text style={styles.btnText}>Αποθήκευση</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default AddCategoryModal;