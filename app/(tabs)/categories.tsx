import React, { useEffect, useState } from 'react';
import { 
    View, Text, StyleSheet, TouchableOpacity, Alert, Modal, 
    ScrollView, TextInput, RefreshControl, Image 
} from 'react-native';
import { getCategories, addCategory, getBillingInfoByCategoryId, deleteCategory } from '@/scripts/database';

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

interface BillData {
    paymentAmount?: number;
    totalAmount?: number;
    balance?: number;
    dueDate?: string;
    connection?: string;
    address?: string;
}

const cleanAmount = (amount: number | string): number => {
    if (typeof amount === 'string') {
        amount = amount.replace(',', '.');
    }
    return parseFloat(amount.toString().replace(/[^0-9.-]+/g, "")) || 0;
};

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

    const fetchCategories = async () => {
        try {
            const result = await getCategories() || [];
            console.log('Categories fetched from DB:', result);
            setCategories(result);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
            Alert.alert('Σφάλμα', 'Αποτυχία ανάκτησης κατηγοριών.');
        }
    };

    const cosmoteLogo = require('@/assets/images/cosmote2.png');
    const deiLogo = require('@/assets/images/dei.png');
    const deyapLogo = require('@/assets/images/eydap1.png');

    const fetchBillingInfo = async (categoryId: number) => {
        try {
            if (!categoryId) {
                console.warn('No categoryId provided for fetching billing info.');
                setBillingInfo([]);
                return;
            }
            const result = await getBillingInfoByCategoryId(categoryId) || [];
            setBillingInfo(result as BillingData[]);
            console.log('Billing info fetched:', result);
        } catch (error) {
            console.error('Error fetching billing info:', error);
            setBillingInfo([]);
        }
    };

    const handleShowCategories = (category: Category) => {
        setSelectedCategory(category);
        setShowCategoryModal(true);
    };

    const handleCategorySelection = (categoryId: number) => {
        console.log(`Κατηγορία επιλέχθηκε: ${categoryId}`);
        setShowCategoryModal(false);
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await fetchCategories();
        setIsRefreshing(false);
    };

    const handleCategoryPress = (category: Category) => {
        setSelectedCategory(category);
        fetchBillingInfo(category.categoryid);
        setShowCategoryModal(true);
    };

    const validBillingInfo = billingInfo.filter(item => item && item.id);

    const handleDeleteCategory = async (categoryId: number) => {
        try {
            await deleteCategory(categoryId);
            console.log(`Κατηγορία διαγράφηκε: ${categoryId}`);
            await fetchCategories();
        } catch (error) {
            console.error('Σφάλμα κατά τη διαγραφή της κατηγορίας:', error);
            Alert.alert('Σφάλμα', 'Δεν ήταν δυνατή η διαγραφή της κατηγορίας.');
        }
    };

    const handleAddCategory = async () => {
        const { emoji, name } = newCategory;
        if (!emoji || !name) {
            Alert.alert('Παρακαλώ συμπληρώστε όλα τα πεδία.');
            return;
        }
        try {
            await addCategory(emoji, name);
            console.log('Κατηγορία προστέθηκε! Επαναφόρτωση...');
            setNewCategory({ emoji: '', name: '' });
            await fetchCategories();
            setShowAddCategoryModal(false);
        } catch (error) {
            console.error('Error adding category:', error);
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
                        {isEditMode && (
                            <TouchableOpacity 
                                style={styles.deleteButton} 
                                onPress={() => handleDeleteCategory(category.categoryid)}
                            >
                                <Text style={styles.deleteText}>X</Text>
                            </TouchableOpacity>
                        )}
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


            <Modal visible={showAddCategoryModal} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Προσθήκη Κατηγορίας</Text>
                        <TextInput
                            style={styles.inputField}
                            placeholder="Emoji"
                            value={newCategory.emoji}
                            onChangeText={(text) => setNewCategory({ ...newCategory, emoji: text })}
                        />
                        <TextInput
                            style={styles.inputField}
                            placeholder="Όνομα κατηγορίας"
                            value={newCategory.name}
                            onChangeText={(text) => setNewCategory({ ...newCategory, name: text })}
                        />
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.btnCancel} onPress={() => setShowAddCategoryModal(false)}>
                                <Text style={styles.btnText}>Άκυρο</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnSave} onPress={handleAddCategory}>
                                <Text style={styles.btnText}>Αποθήκευση</Text>
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
                                    const billData: BillData = bill.data ? JSON.parse(bill.data) : {};
                        <Text style={styles.modalTitle}>
                            {selectedCategory ? selectedCategory.name : 'Λογαριασμοί'}
                        </Text>

                        {/* Λίστα Λογαριασμών */}
                        <ScrollView style={styles.billingList}>
                            {billingInfo.length > 0 ? (
                                billingInfo.map((bill) => {
                                    const billData: { address?: string; connection?: string; paymentAmount?: number; totalAmount?: number; balance?: number; dueDate?: string } = bill.data ? JSON.parse(bill.data) : {};

                                    // Logo ανάλογα με την υπηρεσία
                                    const logo = {
                                        cosmote: cosmoteLogo,
                                        dei: deiLogo,
                                        deyap: deyapLogo,
                                    }[bill.service?.toLowerCase()] || null;

                                    const connectionDetails =
                                        bill.service.toLowerCase() === 'cosmote'
                                            ? billData.connection || 'No Connection Info'
                                            : bill.service.toLowerCase() === 'dei'
                                            ? billData.address || 'No Address Info'
                                            : bill.service.toLowerCase() === 'deyap'
                                            ? billData.address || 'No Address Info'
                                            : 'No Data';

                                    const amount =
                                        bill.service.toLowerCase() === 'cosmote' || bill.service.toLowerCase() === 'dei'
                                            ? `${cleanAmount(billData.paymentAmount ?? billData.totalAmount ?? 0).toFixed(2)}€`
                                            : `${cleanAmount(billData.balance ?? 0).toFixed(2)}€`;

                                    const dueDate = billData.dueDate || 'N/A';

                                    return (
                                        <View key={bill.id} style={styles.billingCard}>
                                            {/* Service Header */}
                                            <Text style={styles.serviceTitle}>
                                                {bill.service.toUpperCase()}
                                            </Text>
                                            
                                            {/* Logo */}
                                            {logo ? (
                                                <Image source={logo} style={styles.accountLogo} />
                                            ) : (
                                                <Text>No Logo Available</Text>
                                            )}
                                            
                                            {/* Connection Details */}
                                            <Text style={styles.accountUsername}>
                                                {connectionDetails}
                                            </Text>

                                            {/* Ποσό */}
                                            <Text style={styles.accountAmount}>
                                                Ποσό: {amount}
                                            </Text>

                                            {/* Λήξη */}
                                            <Text style={styles.accountDueDate}>
                                                Λήξη: {dueDate}
                                            </Text>

                                            {/* Κουμπιά */}
                                            <View style={styles.accountButtons}>
                                                <TouchableOpacity style={styles.btnPay}>
                                                    <Text style={styles.btnText}>Pay</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.btnSchedule}>
                                                    <Text style={styles.btnText}>Schedule</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    );
                                })
                            ) : (
                                <Text style={styles.noBillingText}>
                                    Δεν βρέθηκαν λογαριασμοί για αυτήν την κατηγορία.
                                </Text>
                            )}
                        </ScrollView>

                        {/* Κουμπί Κλεισίματος */}
                        <TouchableOpacity
                            onPress={() => setShowCategoryModal(false)}
                            style={styles.closeButton}
                        >
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
        justifyContent: 'center',
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
        display: 'flex',
        justifyContent: 'center',
        padding: 5,
        width: '48%',
        height: 45,
        borderRadius: 20,
    },
    btnCancel: {
        backgroundColor: 'red',
        display: 'flex',
        justifyContent: 'center',
        padding: 5,
        width: '48%',
        height: 45,
        borderRadius: 20,
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


    billingItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        marginBottom: 10,
    },
    billingText: {
        fontSize: 16,
        color: '#333',
    },
    noDataText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginTop: 20,
    },
    billingCard: {
        width: '98%',
        backgroundColor: '#ffffff',
        borderRadius: 15,
        padding: 20,
        marginTop: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        alignItems: 'center',
        alignSelf: 'center',
    },
    serviceTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    accountLogo: {
        width: 50,
        height: 50,
        marginBottom: 10,
    },
    accountUsername: {
        fontSize: 16,
        color: '#555',
        marginBottom: 10,
    },
    accountAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    accountDueDate: {
        fontSize: 16,
        color: '#666',
        marginBottom: 15,
    },
    accountButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    btnPay: {
        backgroundColor: '#37B7C3',
        padding: 12,
        width: '48%',
        borderRadius: 20,
    },
    btnSchedule: {
        backgroundColor: '#071952',
        padding: 12,
        width: '48%',
        borderRadius: 20,
    },
    btnText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
    closeButton: {
        backgroundColor: '#D94C3D',
        padding: 10,
        width: '40%',
        borderRadius: 19,
        alignSelf: 'center',
        marginTop: 10,
    },
    closeButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
    noBillingText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginTop: 20,
    },
    billingList: {
        maxHeight: 400, // Καλύτερο height για να μην κόβεται το scroll
    },
});

export default Categories;