import dotenv from 'dotenv'
dotenv.config({ path: __dirname + '/.env.local' })
import { Sequelize, DataTypes, Model } from 'sequelize';
import { env } from "process";
import { models } from "@next-auth/sequelize-adapter"
const sequelize = new Sequelize(`postgres://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:5432/${env.DB_DB}`, {
    logging: false
})



export class User extends Model {
    declare id: string
    declare address: string
    declare name: string
    declare email: string
    declare emailVerified?: boolean
    declare image?: string
    declare discordId: string
    declare isAdmin: boolean
    declare isPlayer: boolean
    declare displayName: string
    declare createdAt: string
    declare updatedAt: string
}
User.init({
    ...models.User,
    discordId: { type: DataTypes.STRING, allowNull: false, unique: true },
    isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
    isPlayer: { type: DataTypes.BOOLEAN, defaultValue: false },
    displayName: { type: DataTypes.STRING(64), allowNull: false },
}, {
    sequelize,
    modelName: 'users',
})



export class Rules extends Model {
    declare id: number;
    declare markdown: string;
    declare timestamp: string;
    declare savedById: string;
    declare savedBy: string;
    declare savedByAvatar?: string;
}
Rules.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    markdown: { type: DataTypes.TEXT, allowNull: false },
    timestamp: { type: DataTypes.DATE, allowNull: false },
    savedById: {
        type: DataTypes.UUID, allowNull: false, references: {
            model: User,
            key: 'id'
        }
    },
}, {
    sequelize,
    modelName: 'rules',
})



export class Image extends Model {
    declare id: string
    declare addedById: string
    declare type: 'player' | 'wheelitem' | 'other'
    declare imageData: string
    declare preview: boolean
    declare mime: string
}
Image.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    preview: { type: DataTypes.BOOLEAN, allowNull: false, primaryKey: true },
    addedById: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    type: { type: DataTypes.STRING(64), allowNull: false },
    mime: { type: DataTypes.STRING(64), allowNull: false },
    imageData: { type: DataTypes.TEXT, allowNull: false },
}, {
    sequelize,
    modelName: 'images',
})



export class Player extends Model {
    declare id: string
    declare addedById: string
    declare points: number
    declare about: string
    declare name: string
    declare imageId?: string
    declare ended: number
    declare dropped: number
    declare rerolled: number
}
Player.init({
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
            model: User,
            key: 'id'
        }
    },
    addedById: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    points: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    about: { type: DataTypes.TEXT, allowNull: false, defaultValue: 'Я уже человек человек' },
    name: { type: DataTypes.STRING(64), allowNull: false },
    imageId: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    ended: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    dropped: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    rerolled: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
}, {
    sequelize,
    modelName: 'players',
})




//TODO remove
export function syncTables() {
    return Promise.all([
        // User.sync({ alter: true }),
        // Rules.sync({ alter: true }),
        Image.sync({ force: true }),
        // Player.sync({ force: true }),
    ])
}