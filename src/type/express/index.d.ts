declare namespace Express {
  export interface Request {
    currentUser: object | null;
    token: string | null;
  }
}