import {Sequelize} from 'sequelize';

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    pool: { max: 1, idle: Infinity, maxUses: Infinity },
    storage: './webscrDB.sqlite',
    logging: false,
});

export async function initDatabase() {
    await sequelize.sync();
}