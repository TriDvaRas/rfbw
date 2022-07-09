import { Session } from "next-auth";

export interface NextApiRequestWithSession extends NextApiRequest {
    session: Session
}
export interface ApiError {
    error: string,
    status: number,
}