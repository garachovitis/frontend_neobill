import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, Image } from 'react-native';
import styles from '@/app/styles/categoriesStyles';

interface BillData {
    address?: string;
    connection?: string;
    paymentAmount?: number;
    totalAmount?: number;
    balance?: number;
    dueDate?: string;
}

interface BillingData {
    billingid: number;
    service: string;
    username: string;
    categories: number | null;
    data: string;
}

interface Props {
    visible: boolean;
    onClose: () => void;
    selectedCategory: { categoryid: number; name: string; emoji: string } | null;
    billingInfo: BillingData[]; 
    cleanAmount: (amount: number | string) => number;
}

const cosmoteLogo = require('@/assets/images/cosmote2.png');
const deiLogo = require('@/assets/images/dei.png');
const deyapLogo = require('@/assets/images/eydap1.png');

const CategoryModal: React.FC<Props> = ({ visible, onClose, selectedCategory, billingInfo, cleanAmount }) => {
    const validBillingInfo = billingInfo.filter(item => item && item.billingid);

    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>
                        {selectedCategory ? selectedCategory.name : 'Λογαριασμοί'}
                    </Text>

                    <ScrollView style={styles.billingList}>
                        {validBillingInfo.length > 0 ? (
                            validBillingInfo.map((bill) => {
                                let billData: BillData = {};
                                try {
                                    billData = bill.data ? JSON.parse(bill.data) : {};
                                } catch (error) {
                                    console.error('Invalid bill data:', error);
                                }

                                const serviceKey = bill.service?.toLowerCase() || '';
                                const logo = {
                                    cosmote: cosmoteLogo,
                                    dei: deiLogo,
                                    deyap: deyapLogo,
                                }[serviceKey] || null;

                                const connectionDetails =
                                    serviceKey === 'cosmote'
                                        ? billData.connection || 'No Connection Info'
                                        : serviceKey === 'dei'
                                            ? billData.address || 'No Address Info'
                                            : serviceKey === 'deyap'
                                                ? billData.address || 'No Address Info'
                                                : 'No Data';

                                const amount =
                                    serviceKey === 'cosmote' || serviceKey === 'dei'
                                        ? `${cleanAmount(billData.paymentAmount ?? billData.totalAmount ?? 0).toFixed(2)}€`
                                        : `${cleanAmount(billData.balance ?? 0).toFixed(2)}€`;

                                const dueDate = billData.dueDate || 'N/A';

                                return (
                                    <View key={bill.billingid || Math.random()} style={styles.billingCard}>
                                        <Text style={styles.serviceTitle}>
                                            {bill.service ? bill.service.toUpperCase() : 'Unknown Service'}
                                        </Text>

                                        {logo ? (
                                            <Image source={logo} style={styles.accountLogo} />
                                        ) : (
                                            <Text>No Logo Available</Text>
                                        )}

                                        <Text style={styles.accountUsername}>
                                            {connectionDetails || 'No Connection Info'}
                                        </Text>

                                        <Text style={styles.accountAmount}>
                                            Ποσό: {amount ?? 'N/A'}
                                        </Text>

                                        <Text style={styles.accountDueDate}>
                                            Λήξη: {dueDate ?? 'N/A'}
                                        </Text>

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

                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Κλείσιμο</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default CategoryModal;