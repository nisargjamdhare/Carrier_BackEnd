export interface IUser {
    [x: string]: any;
    name: string;
    email: string;
    password: string;
    id?: string; // Add id as an optional property
  }
  