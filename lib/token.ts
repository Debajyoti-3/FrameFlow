import jwt from "jsonwebtoken";

const secretA = process.env.ACCESS_TOKEN_SECRET_KEY;
const expiryA = process.env.ACCESS_TOKEN_EXPIRY;

const secretR = process.env.REFRESH_TOKEN_SECRET_KEY;
const expiryR = process.env.REFRESH_TOKEN_EXPIRY;

// doing this to prevent Typescript issues
if (!secretA || !expiryA || !secretR || !expiryR) {
  throw new Error("JWT Configuration is incomplete in .env");
}
export const generateAccessTokenForGoogleAuth = (id: string, email: string, name: string | null) => {
  const accessToken = jwt.sign({ id, email, name }, secretA, {
    expiresIn: expiryA as any,
  });

  return accessToken
};

export const generateRefreshTokenForGoogleAuth = (id: string) => {
  const refreshToken = jwt.sign({ id }, secretR, {
    expiresIn: expiryR as any,
  });

  return refreshToken;
};
