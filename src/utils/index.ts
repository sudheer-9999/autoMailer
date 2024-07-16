import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const hash = (password: string) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const compare = (password: string, hash: string) =>
  bcrypt.compareSync(password, hash);

export const sign = (claims: object) => {
  const secret = process.env.PRIVATE_KEY!;

  let token = jwt.sign(claims, secret, {
    expiresIn: "120d",
  });
  return token;
};
