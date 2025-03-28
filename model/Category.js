import { Model } from '@nozbe/watermelondb';
import { field, text } from '@nozbe/watermelondb/decorators';

export default class Category extends Model {
    static table = 'categories';

    @field('category_id') category_id;
    @text('name') name;
    @text('emoji') emoji;
}
