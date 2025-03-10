import { openDatabaseSync } from 'expo-sqlite';
import axios from 'axios';


export const fetchBillingDataFromBackend = async () => {
  try {
    const response = await axios.get('https://backend-billy.onrender.com/billing-info');

    if (response.data.status === 'success') {
      const billingData = response.data.data;
      console.log('✅ Fetched billing data from backend:', billingData);

      for (const bill of billingData) {
        let billDataArray;
        try {
          billDataArray = JSON.parse(bill.data);
        } catch (error) {
          console.error('❌ Error parsing bill data JSON:', bill.data);
          continue; // Αν υπάρχει πρόβλημα στην ανάλυση, προχωράμε στην επόμενη εγγραφή
        }

        if (!Array.isArray(billDataArray)) {
          billDataArray = [billDataArray];
        }

        console.log('🧐 Parsed billDataArray:', billDataArray);

        for (const billData of billDataArray) {
          // ✅ Καθαρισμός `dueDate`
          if (bill.service === "cosmote" && billData.dueDate) {
            billData.dueDate = billData.dueDate.replace(/^Ο λογαριασμός λήγει /i, "").trim();
          }

          // ✅ Ελέγχουμε αν υπάρχει ήδη εγγραφή για αυτό το `connection`
          const exists = await checkIfBillingExistsByConnection(
            bill.service,
            bill.username,
            billData.connection
          );

          if (!exists) {
            // ✅ Αποθήκευση ως νέα ξεχωριστή εγγραφή (νέο billingid)
            await addBillingInfo(
              bill.service,
              bill.username,
              bill.categories,
              JSON.stringify(billData) // Αποθηκεύουμε **μόνο το συγκεκριμένο connection**
            );
            console.log(`✅ Stored new billing info for: ${bill.username} - ${bill.service} - ${billData.connection}`);
          } else {
            console.log(`⚠️ Billing data already exists for: ${bill.username} - ${bill.service} - ${billData.connection}, skipping...`);
          }
        }
      }

      console.log('✅ All new billing info stored locally.');
    } else {
      console.warn('⚠️ No billing data found in backend.');
    }
  } catch (error) {
    console.error('❌ Error fetching billing info from backend:', error);
  }
};


export const checkIfBillingExistsByConnection = async (service: string, username: string, connection: string): Promise<boolean> => {
  if (!db) return false;

  try {
    const query = `SELECT COUNT(*) as count FROM billing_info WHERE service = ? AND username = ? AND data LIKE ?;`;
    const params = [service, username, `%${connection}%`];
    const result = await db.getFirstAsync(query, params);

    return (result as { count: number }).count > 0;
  } catch (error) {
    console.error('❌ Error checking billing info by connection:', error);
    return false;
  }
};


type Category = {
  categoryid: number;
  name: string;
  emoji: string;
};

export const logBillingInfo = async () => {
  if (!db) return;

  try {
    const result = await db.getAllAsync('SELECT DISTINCT * FROM billing_info;');
    console.log('📌 Billing Info from Local DB:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('❌ Error fetching billing info:', error);
  }
};

// ✅ Άνοιγμα βάσης δεδομένων με έλεγχο σφαλμάτων
const getDatabase = () => {
  try {
    const db = openDatabaseSync('billingApp.db');
    console.log('✅ Database opened successfully');
    return db;
  } catch (error) {
    console.error('❌ Error opening database:', error);
    return null;
  }
};

const db = getDatabase();

if (!db) {
  console.error('❌ Database is null. Check expo-sqlite installation.');
}

// ✅ Δημιουργία πινάκων
export const setupDatabase = () => {
    if (!db) return;
  
    try {
      db.execAsync(
        `CREATE TABLE IF NOT EXISTS categories (
          categoryid INTEGER PRIMARY KEY AUTOINCREMENT, 
          name TEXT NOT NULL, 
          emoji TEXT NOT NULL
        );`
      );
  
      db.execAsync(
        `CREATE TABLE IF NOT EXISTS billing_info (
          billingid INTEGER PRIMARY KEY AUTOINCREMENT, 
          service TEXT NOT NULL, 
          username TEXT NOT NULL, 
          categories INTEGER, 
          data TEXT NOT NULL
        );`
      );
      console.log('✅ Database and tables initialized successfully.');
    } catch (error) {
      console.error('❌ Error setting up database:', error);
    }
  };



// ✅ Ανάκτηση κατηγοριών
export const getCategories = async (): Promise<Category[]> => {
    if (!db) {
      console.error('❌ Database is null. Cannot fetch categories.');
      return [];
    }
  
    try {
      const result: any = await db.getAllAsync('SELECT categoryid, name, emoji FROM categories;');
  
      console.log('✅ Raw SQL result:', JSON.stringify(result, null, 2));
  
      if (!Array.isArray(result) || result.length === 0) {
        console.warn('⚠️ No categories found in DB.');
        return [];
      }
  
      console.log('✅ Processed categories:', result);
      return result; // Σωστή επιστροφή αποτελεσμάτων
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      return [];
    }
  };

// ✅ Προσθήκη κατηγορίας
export const addCategory = async (emoji: string, name: string) => {
  if (!db) return;

  try {
    await db.execAsync(`INSERT INTO categories (emoji, name) VALUES ('${emoji}', '${name}')`);
    console.log(`✅ Category added: ${name} (${emoji})`);

    const checkResult = await db.execAsync('SELECT * FROM categories');
    console.log('🧐 Categories after insert:', JSON.stringify(checkResult, null, 2));
  } catch (error) {
    console.error('❌ Error adding category:', error);
  }
};


export const getBillingInfo = async (service: string | null = null) => {
  if (!db) return [];

  try {
    let query;
    let params: any[] = [];

    if (service) {
      query = `SELECT * FROM billing_info WHERE service = ?;`;
      params.push(service);
    } else {
      query = `SELECT * FROM billing_info;`;
    }

    const result = await db.getAllAsync(query, params);
    
    console.log('🧐 Local DB Billing Info:', JSON.stringify(result, null, 2)); // ✅ Δες τι φέρνει από τη βάση
    
    return result.length > 0 ? result : [];
  } catch (error) {
    console.error('❌ Error fetching billing info:', error);
    return [];
  }
};


export const getBillingInfoByCategoryId = async (categoryId: number) => {
  if (!db) return [];

  try {
      const query = `SELECT * FROM billing_info WHERE categories = ?;`;
      const params = [categoryId];
      const result = await db.getAllAsync(query, params);

      console.log('🧐 Fetched billing info by categoryId:', JSON.stringify(result, null, 2));
      return result.length > 0 ? result : [];
  } catch (error) {
      console.error('❌ Error fetching billing info by categoryId:', error);
      return [];
  }
};

export const addBillingInfo = async (service: string, username: string, categoryId: number | null, data: string) => {
  if (!db) return;

  try {
    // 🔹 Μετατροπή του JSON `data` σε array αν δεν είναι ήδη
    let billDataArray;
    try {
      billDataArray = JSON.parse(data);
    } catch (error) {
      console.error('❌ Error parsing bill data JSON:', data);
      return;
    }

    if (!Array.isArray(billDataArray)) {
      billDataArray = [billDataArray]; // Αν είναι object, το κάνουμε array
    }

    for (const billData of billDataArray) {
      // ✅ Καθαρισμός `dueDate`
      if (billData.dueDate) {
        billData.dueDate = billData.dueDate.replace(/^Ο λογαριασμός λήγει /i, "").trim();
      }

      // ✅ Ελέγχουμε αν υπάρχει ήδη εγγραφή για το `connection`
      const exists = await checkIfBillingExistsByConnection(service, username, billData.connection);

      if (!exists) {
        // ✅ Χρησιμοποιούμε **inline SQL** αντί για `?`
        await db.execAsync(
          `INSERT INTO billing_info (service, username, categories, data) 
          VALUES ('${service}', '${username}', ${categoryId}, '${JSON.stringify(billData)}')`
        );

        console.log(`✅ Stored new billing info for: ${username} - ${service} - ${billData.connection}`);
      } else {
        console.log(`⚠️ Billing data already exists for: ${username} - ${service} - ${billData.connection}, skipping...`);
      }
    }
  } catch (error) {
    console.error('❌ Error adding billing info:', error);
  }
};



export const deleteCategory = async (categoryId: number) => {
    if (!db) return;

    try {
        await db.execAsync(`DELETE FROM categories WHERE categoryid = ${categoryId}`);
        console.log(`✅ Κατηγορία διαγράφηκε: ${categoryId}`);
    } catch (error) {
        console.error('❌ Σφάλμα διαγραφής κατηγορίας:', error);
    }
};




  export const deleteBillingInfo = async (billingId: number) => {
    if (!db) return;
  
    try {
      db.execAsync(`DELETE FROM billing_info WHERE billingid = ${billingId};`);
      console.log(`✅ Billing info deleted: ${billingId}`);
    } catch (error) {
      console.error('❌ Error deleting billing info:', error);
    }
  };
  export const updateBillingInfo = async (billingId: number, newData: string) => {
    if (!db) return;
  
    try {
      db.execAsync(`UPDATE billing_info SET data = '${newData}' WHERE billingid = ${billingId};`);
      console.log(`✅ Billing info updated: ${billingId}`);
    } catch (error) {
      console.error('❌ Error updating billing info:', error);
    }
  };

  export const updateBillingCategoryLocal = async (billingId: number, categoryId: number) => {
    if (!db) return;

    try {
        await db.execAsync(
            `UPDATE billing_info SET categories = ${categoryId} WHERE billingid = ${billingId};`
        );
        console.log(`✅ Updated category in local DB for billingid: ${billingId}`);
    } catch (error) {
        console.error('❌ Error updating category in local DB:', error);
    }
};