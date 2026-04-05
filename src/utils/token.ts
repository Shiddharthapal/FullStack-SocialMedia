import type { Token } from '@/types/token';
import jwt from 'jsonwebtoken';

// Small server-side helper for routes that need to trust a bearer token and
// extract the user id from it.
export const verifyToken = async (token: string) => {
  let verifyToken = jwt.verify(
    token,
    import.meta.env.JWT_SECRET || '',
  ) as Token;
  
  return verifyToken;
};
