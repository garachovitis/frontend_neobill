import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal, FlatList, RefreshControl } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { getBillingInfo, getCategories, updateBillingInfo, updateBillingCategoryLocal } from '@/scripts/database';

NetInfo.fetch().then(state => {
  console.log('Is connected?', state.isConnected);
});

interface BillingData {
    id: number; // Added to use for category update
    service: string;
    data: string;
    billingid: number; // Added to fix the error
}
interface Category {
    name: string;
    emoji: string;
    categoryid: number; // Added to fix the error
}


interface CosmoteData {
    connection: string;
    totalAmount: string;
    dueDate?: string;
}

interface DeiData {
    address: string;
    paymentAmount: string;
    dueDate?: string;
}

interface DeyapData {
    address: string;
    balance: string;
    dueDate?: string; // Updated to replace 'status'
}

const cleanAmount = (amount: string): number => {
    const cleanedAmount = amount.replace(/[^\d,.]/g, '').replace(/,+/g, '.'); // Καθαρισμός δεδομένων
    return parseFloat(cleanedAmount) || 0; // Μετατροπή σε αριθμό ή επιστροφή 0
};
const cosmoteLogo = require('@/assets/images/cosmote.png');
const deiLogo = require('@/assets/images/dei.png');
const deyapLogo = require('@/assets/images/eydap1.png');

const BillingInfoScreen: React.FC = () => {
    const [billingInfo, setBillingInfo] = useState<BillingData[]>([]);
    const [expandedMonths, setExpandedMonths] = useState<Record<number, boolean>>({});
    const [ currentMonthExpenses, setCurrentMonthExpenses] = useState<number>(0);
    const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
    const [selectedBill, setSelectedBill] = useState<BillingData | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [refreshing, setRefreshing] = useState<boolean>(false);


    const fetchData = useCallback(async () => {
        try {
            setRefreshing(true);
            const bills = await fetchBillingInfo(null);
            const categoriesData = await getCategories();
    
            // Map για αποφυγή διπλότυπων καταχωρήσεων
            const uniqueBills = new Map();
            (bills as BillingData[]).forEach((bill) => {
                const uniqueKey = `${bill.service}-${bill.billingid}-${bill.data}`; // Δημιουργούμε ένα μοναδικό κλειδί για κάθε εγγραφή
                if (!uniqueBills.has(uniqueKey)) {
                    uniqueBills.set(uniqueKey, bill);
                }
            });
    
            setBillingInfo(Array.from(uniqueBills.values()) as BillingData[]);
            setCategories(categoriesData);
    
            calculateCurrentMonthExpenses(Array.from(uniqueBills.values()) as BillingData[]);
        } catch (error) {
            console.error('Error fetching data:', error);
            Alert.alert('Error', 'Failed to fetch billing info or categories.');
        } finally {
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        console.log('BillingInfoScreen mounted', billingInfo);
    }, [fetchData]);




    const calculateCurrentMonthExpenses = (data: BillingData[]) => {
        const currentMonth = new Date().getMonth() + 1; // Ο μήνας κυμαίνεται από 1 έως 12
        let total = 0;
    
        data.forEach((item) => {
            let billDataArray;
            try {
                billDataArray = JSON.parse(item.data);
            } catch (error) {
                console.error('Invalid JSON in item.data:', item.data);
                return;
            }
    
            if (!Array.isArray(billDataArray)) {
                billDataArray = [billDataArray]; // Αν δεν είναι πίνακας, τυλίγουμε σε πίνακα
            }
    
            billDataArray.forEach((billData: any) => {
                const amount = cleanAmount(billData.balance || billData.totalAmount || '0');
                if (amount === 0) return; // Αγνοούμε μηδενικά ποσά
    
                let dueDate = billData.dueDate?.toLowerCase().trim() || 'ο λογαριασμός έχει λήξει';
                let monthFromData = currentMonth; // Default στον τρέχοντα μήνα
    
                // Ελέγχουμε αν το dueDate είναι έγκυρο (π.χ. "15/02/2024")
                const dateMatch = dueDate.match(/(\d{2})\/(\d{2})\/(\d{4})/);
                if (dateMatch) {
                    monthFromData = parseInt(dateMatch[2], 10); // Εξάγουμε τον μήνα
                }
    
                // Προσθέτουμε το ποσό μόνο αν είναι για τον τρέχοντα μήνα
                if (monthFromData === currentMonth) {
                    total += amount;
                }
            });
        });
    
        setCurrentMonthExpenses(total);
    };

    const formatAmount = (amount: string): string => {
        const cleanedAmount = cleanAmount(amount);
        return cleanedAmount.toFixed(2) + '€'; // Μορφοποίηση ποσού
    };
    const formatConnection = (connection: string | undefined) => connection || "No data";
    const formatAddress = (address: string | undefined) => address || "No data";

    const toggleMonth = (monthIndex: number) => {
        setExpandedMonths((prevState) => ({
            ...prevState,
            [monthIndex]: !prevState[monthIndex],
        }));
    };

    const groupBillsByMonth = () => {
        const billsByMonth: Record<number, Array<JSX.Element>> = {};
        const seenBills = new Set(); // ✅ Αποθήκευση μοναδικών στοιχείων
        
        billingInfo.forEach((item) => {
            let billDataArray;
            try {
                billDataArray = JSON.parse(item.data);
            } catch (error) {
                console.error('Invalid JSON in item.data:', item.data);
                return;
            }
    
            if (!Array.isArray(billDataArray)) {
                billDataArray = [billDataArray]; // Αν δεν είναι array, το μετατρέπουμε
            }
    
            billDataArray.forEach((billData: any) => {
                if (!billData) return;
    
                const amount = cleanAmount(billData.balance || billData.totalAmount || '0');
                if (amount === 0) return;
    
                const dateMatch = billData.dueDate?.match(/(\d{2})\/(\d{2})\/(\d{4})/);
                let billMonth = dateMatch ? parseInt(dateMatch[2], 10) - 1 : new Date().getMonth();
    
                // ✅ Μοναδικό κλειδί για κάθε εγγραφή (βάσει billingid και data)
                const uniqueKey = `${item.service}-${item.billingid}-${billData.connection}-${billData.billNumber}`;
    
                if (seenBills.has(uniqueKey)) return; // ✅ Αν υπάρχει ήδη, το αγνοούμε
                seenBills.add(uniqueKey);
    
                if (!billsByMonth[billMonth]) {
                    billsByMonth[billMonth] = [];
                }
    
                let component: JSX.Element | null = null;
                if (item.service === 'cosmote') {
                    component = <>{displayCosmoteData(item.data, item)}</>;
                } else if (item.service === 'deyap') {
                    component = displayDeyapData(item.data, item);
                } else if (item.service === 'dei') {
                    component = displayDEIData(JSON.parse(item.data), item);
                }
    
                if (component) {
                    billsByMonth[billMonth].push(component);
                }
            });
        });
    
        return billsByMonth;
    };
    

    const getPreviousMonth = (monthIndex: number) => {
        return monthIndex === 0 ? 11 : monthIndex - 1;
    };

    const displayDropdownMenu = (bill: BillingData) => (
        <View style={styles.dropdownContainer}>
            <TouchableOpacity onPress={() => handleShowCategories(bill)}>
                <Text style={styles.moreOptions}>⋮</Text>
            </TouchableOpacity>
        </View>
    );

    const handleShowCategories = (bill: BillingData) => {
        setSelectedBill(bill);
        setShowCategoryModal(true);
    };

    const fetchBillingInfo = async (service: string | null = null) =>
        await getBillingInfo(service);


    const handleCategorySelection = async (categoryId: number) => {
        if (!selectedBill) return;
    
        try {
            // ✅ Ενημέρωση του categoryid στην τοπική βάση
            await updateBillingCategoryLocal(selectedBill.billingid, categoryId);
    
            // ✅ Ενημέρωση του UI ώστε να εμφανίζει τη νέα κατηγορία
            setBillingInfo((prevBillingInfo) =>
                prevBillingInfo.map((bill) =>
                    bill.billingid === selectedBill.billingid ? { ...bill, categories: categoryId } : bill
                )
            );
    
            Alert.alert('Category updated successfully!');
            setShowCategoryModal(false);
        } catch (error) {
            console.error('❌ Error updating category:', error);
            Alert.alert('Error updating category');
        }
    };



    const handleComingSoon = () => {
        Alert.alert('Function coming 🔜 \nStay tuned 😄');
    };



    const displayCosmoteData = (data: string, bill: BillingData) => {
        let parsedData;
        try {
            parsedData = JSON.parse(data);
        } catch (error) {
            console.error('Invalid JSON in data:', data);
            return <Text style={styles.errorText}>Invalid Data</Text>;
        }
    
        if (!Array.isArray(parsedData)) {
            parsedData = [parsedData]; // Αν είναι αντικείμενο, το βάζουμε σε array
        }
    
        const seenBills = new Set(); // ✅ Δημιουργία τοπικού συνόλου για αποφυγή διπλότυπων
    
        return parsedData.map((billData: any, index: number) => {
            if (!billData) return null;
    
            const uniqueKey = `${bill.billingid}-${billData.connection}-${billData.billNumber}`;
            
            if (seenBills.has(uniqueKey)) return null; // Αποφυγή διπλότυπων
            seenBills.add(uniqueKey);
    
            return (
                <View key={uniqueKey} style={styles.accountCard}>
                    <View style={styles.accountHeaderBox}>
                        <Text style={styles.accountName}>{billData.connection || 'No Connection'}</Text>
                    </View>
                    <Image source={cosmoteLogo} style={styles.accountLogo} />
                    <View style={styles.billingInfo}>
                        <Text style={styles.accountAmount}>{cleanAmount(billData.totalAmount).toFixed(2)}€</Text>
                        <Text style={styles.accountDueDate}>Λήξη: {billData.dueDate || 'Ο λογαριασμός έχει λήξει'}</Text>
                    </View>
                    {displayDropdownMenu(bill)}
                    <View style={styles.accountButtons}>
                        <TouchableOpacity style={styles.btnPay} onPress={handleComingSoon}>
                            <Text style={styles.btnText}>Pay</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnSchedule} onPress={handleComingSoon}>
                            <Text style={styles.btnText}>Schedule</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        });
    };


    const displayDEIData = (data: { accountNumber: string; address: string; totalAmount: string; dueDate: string }, bill: BillingData) => (
        <View style={styles.accountCard}>
  
            <View style={styles.accountHeaderBox}>
                <Text style={styles.accountName}>{formatAddress(data.address)}</Text>
            </View>
 
            <Image source={deiLogo} style={styles.accountLogo} />

            <View style={styles.billingInfo}>
                <Text style={styles.accountAmount}>{formatAmount(data.totalAmount)}</Text>
                <Text style={styles.accountDueDate}>Λήξη: {data.dueDate || 'No data'}</Text>
            </View>

            {displayDropdownMenu(bill)}
            <View style={styles.accountButtons}>
                <TouchableOpacity style={styles.btnPay} onPress={handleComingSoon}>
                    <Text style={styles.btnText}>Pay</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnSchedule} onPress={handleComingSoon}>
                    <Text style={styles.btnText}>Schedule</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const displayDeyapData = (data: string, bill: BillingData) => {
        let parsedData: DeyapData;
        try {
            parsedData = JSON.parse(data);
        } catch (error) {
            console.error('Invalid JSON in DEYAP data:', data);
            return <Text style={styles.errorText}>Invalid Data</Text>;
        }
    
        const dueDate = parsedData.dueDate?.toLowerCase().trim() || 'ο λογαριασμός έχει λήξει';
        const isInvalidDueDate = !dueDate.match(/\d{2}\/\d{2}\/\d{4}/); // Ελέγχει αν είναι έγκυρο
        const finalDueDate = isInvalidDueDate ? 'Ο λογαριασμός έχει λήξει' : dueDate;
        const dueDateStyle = finalDueDate === 'Ο λογαριασμός έχει λήξει' ? styles.overdueText : styles.accountDueDate;
    
        return (
            <View style={styles.accountCard}>
                <View style={styles.accountHeaderBox}>
                    <Text style={styles.accountName}>{parsedData.address || 'No Address'}</Text>
                </View>
                <Image source={deyapLogo} style={styles.accountLogo} />
                <View style={styles.billingInfo}>
                    <Text style={styles.accountAmount}>{formatAmount(parsedData.balance)}</Text>
                    <Text style={dueDateStyle}>Λήξη: {finalDueDate}</Text>
                </View>
                {displayDropdownMenu(bill)}
                <View style={styles.accountButtons}>
                    <TouchableOpacity style={styles.btnPay} onPress={handleComingSoon}>
                        <Text style={styles.btnText}>Pay</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnSchedule} onPress={handleComingSoon}>
                        <Text style={styles.btnText}>Schedule</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const billsByMonth = groupBillsByMonth();

    const monthNames = [
        'Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μάιος', 'Ιούνιος',
        'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος',
    ];

    const handleRefresh = () => {
        fetchData();
    };

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
        >
            <View style={styles.progressSummaryWrapper}>
                <Text style={styles.summaryHeader}>Μηνιαία έξοδα: {currentMonthExpenses.toFixed(2)}€</Text>
                <View style={styles.progressBarWrapper}>
                    <Text style={styles.progressLabel}>Πληρωμένοι</Text>
                    <View style={styles.progressBar}>
                        <View style={styles.progressBarFilled} />
                        <Text style={styles.progressBarLabel}>3/4</Text>
                    </View>
                </View>
            </View>

            {Object.entries(billsByMonth).map(([monthIndex, bills]) => {
                if (bills.length === 0) {
                    return null; // Αν δεν υπάρχουν λογαριασμοί για τον μήνα, παραλείπουμε την κατηγορία
                }
                const month = parseInt(monthIndex);
                const isExpanded = expandedMonths[month];
                return (
                    <View key={monthIndex} style={styles.categorySection}>
                        <TouchableOpacity onPress={() => toggleMonth(month)} style={styles.categoryHeaderContainer}>
                            <Text style={styles.categoryHeader}>{monthNames[month]}</Text>
                            <Text style={styles.arrow}>{isExpanded ? '▲' : '▼'}</Text>
                        </TouchableOpacity>
                        {isExpanded && <View style={styles.accountsContainer}>{bills}</View>}
                    </View>
                );
            })}

            <Modal visible={showCategoryModal} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Επιλογή Κατηγορίας</Text>
                        <FlatList
                            data={categories}
                            keyExtractor={(item) => item.categoryid.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => handleCategorySelection(item.categoryid)}
                                    style={styles.categoryItem}
                                >
                                    <Text>{item.emoji} {item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity onPress={() => setShowCategoryModal(false)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Κλείσιμο</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    
    },
    progressSummaryWrapper: {
        backgroundColor: '#FFFFFF',
        padding: 21,
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        borderBottomRightRadius: 29,
        borderBottomLeftRadius: 29,
        marginBottom: 26,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 10,
    },
    summaryHeader: {
        alignSelf: 'center',
        fontSize: 22,
        color: '#333',
        fontWeight: 'bold',
    },
    progressBarWrapper: {
        marginTop: 16,
    },
    progressLabel: {
        alignItems: 'center',
        fontSize: 18,
        color: '#606060',
    },
    progressBar: {
        backgroundColor: '#f0f0f0',
        height: 20,
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
    },
    progressBarFilled: {
        backgroundColor: '#37B7C3',
        height: '100%',
        width: '75%',
    },
    progressBarLabel: {
        position: 'absolute',
        right: 10,
        top: '10%',
        transform: [{ translateY: -8 }],
        fontSize: 14,
        color: '#333',
    },
    categorySection: {
        marginBottom: 20,
        backgroundColor: '#f8f9fa',
        borderRadius: 13,
        padding: 10,
        alignItems: 'center',
        shadowOpacity: 0.1,
    },
    categoryHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 15,
    },
    categoryHeader: {
        fontSize: 20,
        color: '#333',
        padding: 15,
        borderRadius: 15,
    },
    arrow: {
        fontSize: 20,
        color: '#333',
    },
    accountsContainer: {
        marginTop: 10,
    },
    accountCard: {
        backgroundColor: '#f8f9fa',
        padding: 20,
        borderRadius: 15,
        marginBottom: 10,
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    accountHeaderBox: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: '#fff',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 15,
        elevation: 2,
        zIndex: 1,
    },
    accountLogo: {
        marginTop: 25,
        width: 70,
        height: 70,
        alignSelf: 'center',
        marginVertical: 10,
    },
    billingInfo: {
        alignItems: 'center',
        marginBottom: 15,
    },
    accountAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    accountDueDate: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 10,
    },
    accountButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
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
    accountName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    dropdownContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 2,
    },
    moreOptions: {
        fontSize: 24,
        color: '#333',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 15,
        textAlign: 'center',
    },
    categoryItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    closeButton: {
        backgroundColor: 'red',
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
    overdueText: {
        fontSize: 16,
        color: 'red', // Κόκκινο κείμενο για λογαριασμούς που έχουν λήξει
        textAlign: 'center',
        marginBottom: 10,
        fontWeight: 'bold',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
});

export default BillingInfoScreen;