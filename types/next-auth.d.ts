import NextAuth from "next-auth"
import { User } from "../database/db"
import { IncomingMessage, ServerResponse } from "http";
import { Session } from 'next-auth';
import { NextApiResponse } from 'next';
import { Server as NetServer, Socket } from "net";
import { Server as SocketIOServer } from "socket.io";
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
  export type NextApiResponse<T = any> = NextApiResponse<T> & {
    socket: Socket & {
      server: NetServer & {
        io?: SocketIOServer;
      };
    };
  }
}