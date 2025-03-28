import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
    version: 1,
    tables: [
        tableSchema({
            name: 'billing_info',
            columns: [
                { name: 'billing_id', type: 'number', isIndexed: true },
                { name: 'service', type: 'string' },
                { name: 'username', type: 'string' },
                { name: 'categories', type: 'number' },
                { name: 'data', type: 'string' },
            ]
        }),
        tableSchema({
            name: 'categories',
            columns: [
                { name: 'category_id', type: 'number', isIndexed: true },
                { name: 'name', type: 'string'},
                { name: 'emoji', type: 'string' },
            ]
        }),
    ]
});