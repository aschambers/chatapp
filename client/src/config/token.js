import secret from '../config/secret';
import jwt from 'jsonwebtoken';

const token = jwt.sign({ website: 'chattersanctum' }, secret);
export const config = {
  headers: { 'Authorization': 'bearer ' + token }
}
export const authToken = 'bearer ' + token;