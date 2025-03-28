import { Model } from '@nozbe/watermelondb';
import { field, text } from '@nozbe/watermelondb/decorators';

export default class BillingInfo extends Model {
    static table = 'billing_info';

    @field('billing_id') billing_id;
    @text('service') service;
    @text('username') username;
    @field('categories') categories;
    @text('data') data;
}
