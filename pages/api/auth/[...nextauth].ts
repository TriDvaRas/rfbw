import NextAuth, { NextAuthOptions } from "next-auth"
import DiscordProvider from "next-auth/providers/discord"
import SequelizeAdapter, { models } from "@next-auth/sequelize-adapter"
import { Sequelize, DataTypes } from 'sequelize';
import { env } from "process";


const sequelize = new Sequelize(`postgres://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:5432/${env.DB_DB}`, {
    logging: false
})




const adapter = SequelizeAdapter(sequelize, {
    models: {
        User: sequelize.define("user", {
            ...models.User,
            discordId: { type: DataTypes.STRING, allowNull: false },
            isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
            isPlayer: { type: DataTypes.BOOLEAN, defaultValue: false },
            displayName: { type: DataTypes.STRING },
        }),
    },
})

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            CLIENT_ID: string;
            CLIENT_SECRET: string;
            CLIENT_REDIRECT: string;
        }
    }
}
export const authOptions: NextAuthOptions = {
    providers: [
        DiscordProvider({
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            profile(profile, tokens) {
                return {
                    id: profile.id,
                    discordId: profile.id,
                    name: profile.username,
                    displayName: profile.username,
                    email: profile.email,
                    image: profile.avatar,
                }
            },
        })
    ],
    logger: {
        debug: () => { },
        warn: console.warn,
        error: console.error,
    },
    adapter,
    session: {
        strategy: "database",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 48 * 60 * 60, // 48 hours
    },
    callbacks: {
        session(params) {
            params.session.user = params.user as any
            return params.session
        },
    },

}
export default NextAuth(authOptions)