import * as jwt from 'jsonwebtoken';
import { User } from '../entity/User';

export class AuthService {
  private secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  async createToken(user: User): Promise<string> {
    return jwt.sign(user, this.secret);
  }
}