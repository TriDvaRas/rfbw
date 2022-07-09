import NextAuth from "next-auth"
import { User } from "../database/db"
import { IncomingMessage } from "http";
import { Session } from 'next-auth';

declare module "next-auth" {
  interface Session {
    user: User
  }

}
declare module 'next' {
  export interface NextApiRequest extends IncomingMessage {
    session: Session
    params: any
    file?: {
      fieldname: string,
      originalname: string,
      encoding: string,
      mimetype: string,
      buffer: Buffer,
      size: number
    }
  }
}