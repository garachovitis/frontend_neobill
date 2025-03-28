import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, ScrollView, TextInput, RefreshControl, Image } from 'react-native';
import { getCategories, addCategory, getBillingInfoByCategoryId, deleteCategory } from '@/scripts/database';
import styles from '@/app/styles/categoriesStyles';
import AddCategoryModal from '@/app/modals/addCategoryModal';
import CategoryModal from '@/app/modals/categoryModal';

interface Category {
    categoryid: number;
    name: string;
    emoji: string;
}

interface BillingData {
    billingid: number;
    service: string;
    username: string;
    categories: number | null;
    data: string;
}



const cleanAmount = (amount: number | string): number => {
    if (typeof amount === 'string') {
        amount = amount.replace(',', '.');
    }
    return parseFloat(amount.toString().replace(/[^0-9.-]+/g, "")) || 0;
};

export default function CategoriesScreen() {
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
            setCategories(result);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
            Alert.alert('Σφάλμα', 'Αποτυχία ανάκτησης κατηγοριών.');
        }
    };

    const fetchBillingInfo = async (categoryId: number) => {
        try {
            if (!categoryId) {
                console.warn('No categoryId provided for fetching billing info.');
                setBillingInfo([]);
                return;
            }
            const result = await getBillingInfoByCategoryId(categoryId) || [];
            setBillingInfo(result as BillingData[]);
        } catch (error) {
            console.error('Error fetching billing info:', error);
            setBillingInfo([]);
        }
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
                    <View key={`category-${category.categoryid}`} style={styles.categoryBox}>
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

            <AddCategoryModal
                visible={showAddCategoryModal}
                onClose={() => setShowAddCategoryModal(false)}
                onAddCategory={handleAddCategory}
                newCategory={newCategory}
                setNewCategory={setNewCategory}
            />

            <TouchableOpacity onPress={() => setShowAddCategoryModal(true)} style={styles.addCategoryButton}>
                <Text style={styles.addCategoryText}>+</Text>
            </TouchableOpacity>



            <TouchableOpacity 
                style={styles.editModeButtonFixed} 
                onPress={() => setIsEditMode(!isEditMode)}
            >
                <Text style={styles.editModeText}>{isEditMode ? 'Τέλος' : 'Επεξεργασία'}</Text>
            </TouchableOpacity>


            <CategoryModal
                visible={showCategoryModal}
                onClose={() => setShowCategoryModal(false)}
                selectedCategory={selectedCategory}
                cleanAmount={cleanAmount}
                billingInfo={billingInfo}
            />
        </View>
    );
};
