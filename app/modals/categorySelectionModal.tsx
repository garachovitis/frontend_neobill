import React from 'react';
import { Modal, View, Text, FlatList, TouchableOpacity } from 'react-native';
import styles from '@/app/styles/indexStyles';

interface Category {
    categoryid: number;
    name: string;
    emoji: string;
}

interface Props {
    visible: boolean;
    categories: Category[];
    onSelectCategory: (categoryId: number) => void;
    onClose: () => void;
}

const CategorySelectionModal: React.FC<Props> = ({
    visible,
    categories,
    onSelectCategory,
    onClose,
}) => {
    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Επιλογή Κατηγορίας</Text>
                    <FlatList
                        data={categories}
                        keyExtractor={(item) => item.categoryid.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => onSelectCategory(item.categoryid)}
                                style={styles.categoryItem}
                            >
                                <Text>
                                    {item.emoji} {item.name}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Κλείσιμο</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default CategorySelectionModal;