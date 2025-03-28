import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import schema from '@/model/schema';
import migrations from '@/model/migrations';
import Category from "@/model/Category";
import BillingInfo from "@/model/BillingInfo";

const adapter = new SQLiteAdapter({
    schema,
    migrations,
    dbName: 'neobill',
    onSetUpError: error => {
        console.error("There was an error while trying to connect to the Database:", error)
    }
});

export const database = new Database({
    adapter,
    modelClasses: [BillingInfo, Category],
});
