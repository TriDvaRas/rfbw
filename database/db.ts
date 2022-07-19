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
    declare createdAt: string
    declare updatedAt: string
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
    declare createdAt: string
    declare updatedAt: string
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
    declare maxWheels: number
    declare createdAt: string
    declare updatedAt: string
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
    maxWheels: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 2 },
}, {
    sequelize,
    modelName: 'players',
})


export class Audio extends Model {
    declare id: string
    declare addedById: string
    declare type: 'wheel' | 'other'
    declare filePath: string
    declare originalName: string
    declare mime: string
    declare createdAt: string
    declare updatedAt: string
}
Audio.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
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
    filePath: { type: DataTypes.TEXT, allowNull: false },
    originalName: { type: DataTypes.TEXT, allowNull: false },
}, {
    sequelize,
    modelName: 'audios',
})

export class Wheel extends Model {
    declare id: string
    declare ownedById: string
    declare addedById: string
    declare title: string
    declare borderColor: string
    declare pointerColor: string
    declare backgroundColor: string
    declare dotColor: string
    declare minimalSpin: number
    declare prespinDuration: number
    declare spinDuration: number
    declare audioVolume: number
    declare audioId?: string
    declare minSize: number
    declare maxSize: number
    declare size: number
    declare approved: boolean
    declare locked: boolean
    declare createdAt: string
    declare updatedAt: string
}
Wheel.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    addedById: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Player,
            key: 'id'
        }
    },
    ownedById: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Player,
            key: 'id'
        }
    },
    title: { type: DataTypes.STRING(64), allowNull: false, defaultValue: 'Колесо' },
    borderColor: { type: DataTypes.STRING(10), allowNull: false, defaultValue: '#ffffff' },
    pointerColor: { type: DataTypes.STRING(10), allowNull: false, defaultValue: '#ffffff' },
    backgroundColor: { type: DataTypes.STRING(10), allowNull: false, defaultValue: '#2b2744' },
    dotColor: { type: DataTypes.STRING(10), allowNull: false, defaultValue: '#ffffff' },
    minimalSpin: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 20 },
    prespinDuration: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 3 },
    spinDuration: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 60 },
    audioVolume: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0.05 },
    audioId: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    minSize: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 5 },
    maxSize: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 20 },
    size: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 5 },
    locked: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    approved: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, {
    sequelize,
    modelName: 'wheels',
})


export type WheelItemType = 'game' | 'movie' | 'anime' | 'series';

export type WheelItemImageMode = 'height' | 'width';

export class WheelItem extends Model {
    declare id: string
    declare wheelId: string
    declare addedById: string
    declare ownedById: string
    declare position: number
    declare label: string
    declare title: string
    declare altColor: string
    declare fontColor: string
    declare hours: number
    declare showText: boolean
    declare deleted: boolean
    declare imageId?: string
    declare imageMode: WheelItemImageMode
    declare type: WheelItemType
    declare comments: string
    declare hasCoop: boolean
    declare maxCoopPlayers: number
    declare hasDifficulty: boolean
    declare audioId?: string
    declare createdAt: string
    declare updatedAt: string
}


WheelItem.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    wheelId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Wheel,
            key: 'id'
        }
    },
    addedById: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Player,
            key: 'id'
        }
    },
    ownedById: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Player,
            key: 'id'
        }
    },
    position: { type: DataTypes.INTEGER, allowNull: false },
    label: { type: DataTypes.STRING(16), allowNull: false, defaultValue: 'Название' },
    title: { type: DataTypes.STRING(128), allowNull: false, defaultValue: 'Длинное название' },
    altColor: { type: DataTypes.STRING(10), allowNull: false, defaultValue: '#2b2744' },
    fontColor: { type: DataTypes.STRING(10), allowNull: false, defaultValue: '#ffffff' },
    hours: { type: DataTypes.DECIMAL(3, 1), allowNull: false, defaultValue: 0.0 },
    showText: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    imageId: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    imageMode: { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'width' },
    type: { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'game' },
    comments: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
    hasCoop: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    maxCoopPlayers: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    hasDifficulty: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    audioId: {
        type: DataTypes.UUID,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'wheelitems',
})


//TODO remove
export function syncTables() {
    if (process.env.DEV_DEV)
        return Promise.all([
            // User.sync({ force: true }),
            // Rules.sync({ force: true }),
            // Image.sync({ force: true }),
            // Player.sync({ force: true }),
            // Audio.sync({ alter: true }),
            Wheel.sync({ alter: true }),
            // WheelItem.sync({ force: true }),
        ])
}