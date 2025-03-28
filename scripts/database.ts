import { openDatabaseSync } from 'expo-sqlite';
import { deleteItemAsync } from "expo-secure-store";


const db = openDatabaseSync('neobill.db');
console.log('✅ Database opened successfully');

export const setupDatabase = () => {
      db.execSync(`CREATE TABLE IF NOT EXISTS categories (
        categoryid INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT NOT NULL, 
        emoji TEXT NOT NULL);`
      );
  
      db.execSync(`CREATE TABLE IF NOT EXISTS billing_info (
        billingid INTEGER PRIMARY KEY AUTOINCREMENT, 
        service TEXT NOT NULL, 
        username TEXT NOT NULL, 
        categories INTEGER, 
        data TEXT NOT NULL);`
      );
  };


export const getCategories = async () => {
    return await db.getAllAsync('SELECT categoryid, name, emoji FROM categories;');
};

export const addCategory = async (emoji: string, name: string) => {
    return await db.runAsync(`INSERT INTO categories (emoji, name) VALUES (?, ?)`, [emoji, name]);
};

export const getBillingInfo = async (service: string | null = null) => {
    return service?
        await db.getAllAsync(`SELECT * FROM billing_info WHERE service = ?;`, [service])
        :
        await db.getAllAsync(`SELECT * FROM billing_info;`);
};

export const getBillingInfoByCategoryId = async (categoryId: number) => {
    return await db.getAllAsync(`SELECT * FROM billing_info WHERE categories = ?;`, [categoryId]);
};

export const addBillingInfo = async (service: string, username: string, categoryId: number | null, data: string) => {
  const billDataArray:[any] = JSON.parse(data);

  for (const billData of billDataArray) {
    if (billData.dueDate) {
      billData.dueDate = billData.dueDate.replace(/^Ο λογαριασμός λήγει /i, "").trim();
    }

    const exists = true;

    if (!exists) {
      await db.execAsync(
        `INSERT INTO billing_info (service, username, categories, data) 
        VALUES ('${service}', '${username}', ${categoryId}, '${JSON.stringify(billData)}')`
      );

      console.log(`✅ Stored new billing info for: ${username} - ${service} - ${billData.connection}`);
    } else {
      console.log(`⚠️ Billing data already exists for: ${username} - ${service} - ${billData.connection}, skipping...`);
    }
  }
};


export const deleteCategory = async (categoryId: number) => {
    return await db.runAsync(`DELETE FROM categories WHERE categoryid = ?`, [categoryId]);
};

export const updateBillingInfo = async (billingId: number, newData: string) => {
    return await db.runAsync(`UPDATE billing_info SET data = ? WHERE billingid = ?;`, [newData, billingId]);
};

export const updateBillingCategoryLocal = async (billingId: number, categoryId: number) => {
    return await db.runAsync(`UPDATE billing_info SET categories = ? WHERE billingid = ?;`, [categoryId, billingId]);
};

export const deleteAllData = async () => {
    await db.execAsync(`DELETE FROM billing_info;`);
    await db.execAsync(`DELETE FROM categories;`);

    console.log('✅ All data deleted from local database.');

    await deleteItemAsync('username');
    await deleteItemAsync('password');
    console.log('✅ All credentials deleted from Expo SecureStore.');
};