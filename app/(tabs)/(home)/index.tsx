import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert, Modal, FlatList, RefreshControl } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { getBillingInfo, getCategories, updateBillingInfo, updateBillingCategoryLocal } from '@/scripts/database';
import { useFocusEffect } from '@react-navigation/native';
import styles from '@/app/(tabs)/(home)/StylesIndex';
import CategorySelectionModal from '@/app/(tabs)/(home)/categorySelectionModal'; 


NetInfo.fetch().then(state => {
  console.log('Is connected?', state.isConnected);
});

interface BillingData {
    id: number;  
    service: string;
    data: string;
    billingid: number; 
}
interface Category {
    name: string;
    emoji: string;
    categoryid: number; 
}



interface DeyapData {
    address: string;
    balance: string;
    dueDate?: string; 
}

const cleanAmount = (amount: string): number => {
    const cleanedAmount = amount.replace(/[^\d,.]/g, '').replace(/,+/g, '.'); 
    return parseFloat(cleanedAmount) || 0; 
};
const cosmoteLogo = require('@/assets/images/cosmote.png');
const deiLogo = require('@/assets/images/dei.png');
const deyapLogo = require('@/assets/images/eydap1.png');

export default function BillingInfoScreen() {
    const [billingInfo, setBillingInfo] = useState<BillingData[]>([]);
    const [expandedMonths, setExpandedMonths] = useState<Record<number, boolean>>({});
    const [ currentMonthExpenses, setCurrentMonthExpenses] = useState<number>(0);
    const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
    const [selectedBill, setSelectedBill] = useState<BillingData | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [refreshKey, setRefreshKey] = useState(0);



    const fetchData = useCallback(async () => {
        let isActive = true; 
    
        try {
            setRefreshing(true);
            
            const bills = await fetchBillingInfo(null);
            const categoriesData = await getCategories();
    
            if (!isActive) return; 
    
            const uniqueBills = new Map();
            (bills as BillingData[]).forEach((bill) => {
                const uniqueKey = `${bill.service}-${bill.billingid}-${bill.data}`;
                if (!uniqueBills.has(uniqueKey)) {
                    uniqueBills.set(uniqueKey, bill);
                }
            });
    
            setBillingInfo(Array.from(uniqueBills.values()) as BillingData[]);
            setCategories(categoriesData);
            calculateCurrentMonthExpenses(Array.from(uniqueBills.values()) as BillingData[]);
        } catch (error) {
            console.error('❌ Error fetching data:', error);
            Alert.alert('Error', 'Failed to fetch billing info or categories.');
        } finally {
            setRefreshing(false);
        }
    
        return () => {
            isActive = false; 
        };
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData, refreshKey]);

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );




    const calculateCurrentMonthExpenses = (data: BillingData[]) => {
        const currentMonth = new Date().getMonth() + 1; 
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
                billDataArray = [billDataArray]; 
            }
    
            billDataArray.forEach((billData: any) => {
                const amount = cleanAmount(billData.balance || billData.totalAmount || '0');
                if (amount === 0) return; 
    
                let dueDate = billData.dueDate?.toLowerCase().trim() || 'ο λογαριασμός έχει λήξει';
                let monthFromData = currentMonth; 
    
                const dateMatch = dueDate.match(/(\d{2})\/(\d{2})\/(\d{4})/);
                if (dateMatch) {
                    monthFromData = parseInt(dateMatch[2], 10); 
                }
    
                if (monthFromData === currentMonth) {
                    total += amount;
                }
            });
        });
    
        setCurrentMonthExpenses(total);
    };

    const formatAmount = (amount: string): string => {
        const cleanedAmount = cleanAmount(amount);
        return cleanedAmount.toFixed(2) + '€'; 
    };
    const formatAddress = (address: string | undefined) => address || "No data";

    const toggleMonth = (monthIndex: number) => {
        setExpandedMonths((prevState) => ({
            ...prevState,
            [monthIndex]: !prevState[monthIndex],
        }));
    };

    const groupBillsByMonth = () => {
        const billsByMonth: Record<number, Array<JSX.Element>> = {};
        const seenBills = new Set(); 
        
        billingInfo.forEach((item) => {
            let billDataArray;
            try {
                billDataArray = JSON.parse(item.data);
            } catch (error) {
                console.error('Invalid JSON in item.data:', item.data);
                return;
            }
    
            if (!Array.isArray(billDataArray)) {
                billDataArray = [billDataArray]; 
            }
    
            billDataArray.forEach((billData: any) => {
                if (!billData) return;
    
                const amount = cleanAmount(billData.balance || billData.totalAmount || '0');
                if (amount === 0) return;
    
                const dateMatch = billData.dueDate?.match(/(\d{2})\/(\d{2})\/(\d{4})/);
                let billMonth = dateMatch ? parseInt(dateMatch[2], 10) - 1 : new Date().getMonth();
    
                const uniqueKey = `${item.service}-${item.billingid}-${billData.connection}-${billData.billNumber}`;
    
                if (seenBills.has(uniqueKey)) return; 
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
            await updateBillingCategoryLocal(selectedBill.billingid, categoryId);
    
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
            parsedData = [parsedData]; 
        }
    
        const seenBills = new Set(); 
    
        return parsedData.map((billData: any, index: number) => {
            if (!billData) return null;
    
            const uniqueKey = `${bill.billingid}-${billData.connection}-${billData.billNumber}`;
            
            if (seenBills.has(uniqueKey)) return null; 
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
        const isInvalidDueDate = !dueDate.match(/\d{2}\/\d{2}\/\d{4}/); 
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
        setRefreshKey((prevKey) => prevKey + 1);
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
                    return null; 
                }
                const month = parseInt(monthIndex);
                const isExpanded = expandedMonths[month];
                return (
                    <View key={monthIndex} style={styles.categorySection}>
                        <TouchableOpacity onPress={() => toggleMonth(month)} style={styles.categoryHeaderContainer}>
                            <Text style={styles.categoryHeader}>{monthNames[month]}</Text>
                            <Text style={styles.arrow}>{isExpanded ? '▲' : '▼'}</Text>
                        </TouchableOpacity>
                        {isExpanded && (
                            <View style={styles.accountsContainer}>
                                {bills.map((bill, index) => (
                                    <View key={bill.key || index}> 
                                        {bill}
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                );
            })}

            <CategorySelectionModal
                visible={showCategoryModal}
                categories={categories}
                onSelectCategory={handleCategorySelection}
                onClose={() => setShowCategoryModal(false)}
            />
        </ScrollView>
    );
};
