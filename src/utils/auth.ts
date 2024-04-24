import { JwtSecret } from "@/config";
import { sign, SignOptions, verify, VerifyOptions } from "jsonwebtoken";
import crypto from "node:crypto";

export type AuthJwtPayload = {
  id: string;
};

export function jwtSign(payload: AuthJwtPayload, opts: SignOptions = {}) {
  const options: SignOptions = { expiresIn: "30d", ...opts };
  return sign(payload, JwtSecret, options);
}

export function jwtVerify(token: string, opts: VerifyOptions = {}) {
  return verify(token, JwtSecret, opts) as AuthJwtPayload;
}

export async function hashPassword(plainPassword: string): Promise<string> {
  const iterations = 10000;
  const keylen = 64;

  return new Promise(resolve =>
    crypto.pbkdf2(
      plainPassword,
      "fake salt",
      iterations,
      keylen,
      "sha512",
      (err, derivedKey) => {
        if (err) {
          throw err;
        }
        resolve(derivedKey.toString("hex"));
      },
    )
  );
}

export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string,
) {
  return hashedPassword === (await hashPassword(plainPassword));
}
