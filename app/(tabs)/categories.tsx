import React, { useEffect, useState } from 'react';
import { 
    View, Text, StyleSheet, TouchableOpacity, Alert, Modal, 
    ScrollView, TextInput, RefreshControl, FlatList 
} from 'react-native';
import { getCategories, addCategory, getBillingInfo, deleteCategory } from '@/scripts/database';

interface Category {
    categoryid: number;
    name: string;
    emoji: string;
}

interface BillingData {
    id: number;
    service: string;
    username: string;
    categories: number | null;
    data: string;
}

const Categories = () => {
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [billingInfo, setBillingInfo] = useState<BillingData[]>([]);
    const [showAddCategoryModal, setShowAddCategoryModal] = useState<boolean>(false);
    const [newCategory, setNewCategory] = useState<{ emoji: string, name: string }>({ emoji: '', name: '' });
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    useEffect(() => {
        fetchCategories();
    }, []);

    // ✅ Ανάκτηση κατηγοριών από την τοπική βάση SQLite
    const fetchCategories = async () => {
        try {
            const result = await getCategories() || [];
            console.log('✅ Categories fetched from DB:', result);
            setCategories(result); // Ενημέρωση της κατάστασης
        } catch (error) {
            console.error('❌ Error fetching categories:', error);
            setCategories([]); // Σε περίπτωση σφάλματος, κενό array
            Alert.alert('Σφάλμα', 'Αποτυχία ανάκτησης κατηγοριών.');
        }
    };

    // ✅ Ανάκτηση πληροφοριών τιμολογίων από την τοπική βάση SQLite
    const fetchBillingInfo = async (categoryId: number) => {
        try {
            const result = await getBillingInfo(categoryId.toString()) || [];
            setBillingInfo(result as BillingData[]);
            console.log('✅ Billing info fetched:', result);
        } catch (error) {
            console.error('❌ Error fetching billing info:', error);
            setBillingInfo([]);
        }
    };
    const handleShowCategories = (category: Category) => {
        setSelectedCategory(category);
        setShowCategoryModal(true);
    };
    const handleCategorySelection = (categoryId: number) => {
        console.log(`Κατηγορία επιλέχθηκε: ${categoryId}`);
        setShowCategoryModal(false); // Κλείνει το modal μετά την επιλογή
    };

    // ✅ Ανανεώνει τις κατηγορίες (Pull to Refresh)
    const handleRefresh = async () => {
        setIsRefreshing(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await fetchCategories();
        setIsRefreshing(false);
    };

    // ✅ Επιλογή κατηγορίας και άνοιγμα modal με τα τιμολόγια της κατηγορίας
    const handleCategoryPress = (category: Category) => {
        setSelectedCategory(category);
        fetchBillingInfo(category.categoryid);
        setShowCategoryModal(true);
    };

    const handleDeleteCategory = async (categoryId: number) => {
        try {
            await deleteCategory(categoryId);
            console.log(`✅ Κατηγορία διαγράφηκε: ${categoryId}`);
            await fetchCategories(); // Επαναφόρτωση μετά τη διαγραφή
        } catch (error) {
            console.error('❌ Σφάλμα κατά τη διαγραφή της κατηγορίας:', error);
            Alert.alert('Σφάλμα', 'Δεν ήταν δυνατή η διαγραφή της κατηγορίας.');
        }
    };

    // ✅ Προσθήκη κατηγορίας στην τοπική βάση
    const handleAddCategory = async () => {
        const { emoji, name } = newCategory;
        if (!emoji || !name) {
            Alert.alert('Παρακαλώ συμπληρώστε όλα τα πεδία.');
            return;
        }
    
        try {
            await addCategory(emoji, name);
            setNewCategory({ emoji: '', name: '' });
            setShowAddCategoryModal(false);
            console.log('✅ Κατηγορία προστέθηκε! Επαναφόρτωση...');
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await fetchCategories(); // Επαναφόρτωση μετά την προσθήκη
        } catch (error) {
            console.error('❌ Error adding category:', error);
            Alert.alert('Σφάλμα', 'Αποτυχία προσθήκης κατηγορίας.');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.categoryList}
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
            >
                {categories.map((category) => (
                    <View key={category.categoryid} style={styles.categoryBox}>
                        {/* Εάν είμαστε σε edit mode, δείξε το X */}
                        {isEditMode && (
                            <TouchableOpacity 
                                style={styles.deleteButton} 
                                onPress={() => handleDeleteCategory(category.categoryid)}
                            >
                                <Text style={styles.deleteText}>X</Text>
                            </TouchableOpacity>
                        )}
                        
                        {/* Εάν δεν είμαστε σε edit mode, τότε μπορεί να γίνει επιλογή */}
                        <TouchableOpacity 
                            onPress={() => !isEditMode && handleCategoryPress(category)}
                            style={{ alignItems: 'center' }}
                        >
                            <Text style={styles.icon}>{category.emoji}</Text>
                            <Text style={styles.categoryName}>{category.name}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            {/* Modal για προσθήκη νέας κατηγορίας */}
            <Modal visible={showAddCategoryModal} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Προσθήκη Νέας Κατηγορίας</Text>
                        <TextInput
                            style={styles.inputField}
                            placeholder="Emoji"
                            value={newCategory.emoji}
                            onChangeText={(text) => setNewCategory({ ...newCategory, emoji: text })}
                        />
                        <TextInput
                            style={styles.inputField}
                            placeholder="Όνομα"
                            value={newCategory.name}
                            onChangeText={(text) => setNewCategory({ ...newCategory, name: text })}
                        />
                        <View style={styles.modalActions}>
                            <TouchableOpacity onPress={handleAddCategory} style={styles.btnSave}>
                                <Text style={styles.btnText}>Αποθήκευση</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowAddCategoryModal(false)} style={styles.btnCancel}>
                                <Text style={styles.btnText}>Ακύρωση</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Κουμπί προσθήκης κατηγορίας */}
            <TouchableOpacity onPress={() => setShowAddCategoryModal(true)} style={styles.addCategoryButton}>
                <Text style={styles.addCategoryText}>+</Text>
            </TouchableOpacity>
            {/* Κουμπί για ενεργοποίηση του Edit Mode */}
            <TouchableOpacity 
                style={styles.editModeButtonFixed} 
                onPress={() => setIsEditMode(!isEditMode)}
            >
                <Text style={styles.editModeText}>{isEditMode ? 'Τέλος' : 'Επεξεργασία'}</Text>
            </TouchableOpacity>
            <Modal visible={showCategoryModal} transparent={true} animationType="slide">
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>
                                    {selectedCategory ? selectedCategory.emoji + ' ' + selectedCategory.name : 'Κατηγορία'}
                                </Text>

                                {/* Εμφάνιση τιμολογίων που ανήκουν σε αυτή την κατηγορία */}
                                {billingInfo.length > 0 ? (
                                    <FlatList
                                        data={billingInfo}
                                        keyExtractor={(item) => item.id.toString()}
                                        renderItem={({ item }) => (
                                            <View style={styles.billingItem}>
                                                <Text style={styles.billingText}>Υπηρεσία: {item.service}</Text>
                                                <Text style={styles.billingText}>Δεδομένα: {item.data}</Text>
                                            </View>
                                        )}
                                    />
                                ) : (
                                    <Text style={styles.noDataText}>Δεν υπάρχουν δεδομένα για αυτή την κατηγορία.</Text>
                                )}

                                <TouchableOpacity onPress={() => setShowCategoryModal(false)} style={styles.closeButton}>
                                    <Text style={styles.closeButtonText}>Κλείσιμο</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                        </View>
                        );
                    };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        alignItems: 'center',
    },
    categoryList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 10,
    },
    categoryBox: {
        width: '48%',
        backgroundColor: '#ffffff',
        borderRadius: 15,
        padding: 20,
        marginBottom: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    icon: {
        fontSize: 40,
        marginBottom: 10,
    },
    categoryName: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    inputField: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 15,
        padding: 10,
        fontSize: 16,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    btnSave: {
        backgroundColor: '#37B7C3',
        padding: 12,
        borderRadius: 20,
    },
    btnCancel: {
        backgroundColor: '#D94C3D',
        padding: 12,
        borderRadius: 20,
    },
    btnText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
    addCategoryButton: {
        position: 'absolute',
        bottom: 90, // Αυξάνουμε το bottom για να δημιουργήσουμε χώρο
        right: 20,
        backgroundColor: '#37B7C3',
        width: 50,
        height: 50,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },

    addCategoryText: {
        fontSize: 40,
        color: '#fff',
    },
    editModeButtonFixed: {
        position: 'absolute',
        bottom: 30, // ✅ Τοποθετούμε το "Επεξεργασία" πιο κάτω από το "+"
        right: 20,
        backgroundColor: '#37B7C3',
        padding: 12,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

    editModeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    deleteButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'red',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },

    categoryItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    closeButton: {
        backgroundColor: '#37B7C3',
        padding: 10,
        borderRadius: 10,
        alignSelf: 'center',
        marginTop: 10,
    },
    closeButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
});

export default Categories;