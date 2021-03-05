import JWT from 'jsonwebtoken';

const SECRET = 'pineapple-admin-jwt-secret';
const expiresIn = '1h';

export interface IJWT {
  sign(payload: string | object | Buffer): string;
  verify(token: string): string | object;
}

const JWTutil: IJWT = {
  sign(payload: string | object | Buffer) {
    const token = JWT.sign(payload, SECRET, { expiresIn });
    return token;
  },
  verify(token: string) {
    try {
      const result: string | object = JWT.verify(token, SECRET);
      return result;
    } catch (e) {
      throw e;
    }
  }
}

export default JWTutil;