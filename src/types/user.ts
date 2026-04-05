// Minimal authenticated user shape stored in Redux and reused by the UI.
export interface UserDetails {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: Date;
}
