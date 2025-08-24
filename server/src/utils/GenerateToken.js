import jwt from "jsonwebtoken";

export function GenerateAccessToken(email) {
    if (!process.env.ACCESS_TOKEN_KEY) {
        throw new Error("ACCESS_SECRET_TOKEN is not defined in environment variables");
    }

    return jwt.sign(
        { email: email },
        process.env.ACCESS_TOKEN_KEY,
        { expiresIn: '30d' }
    );
}
export function GenerateRefreshToken(email) {
    if (!process.env.REFRESH_TOKEN_KEY) {
        throw new Error("REFRESH_SECRET_TOKEN is not defined in environment variables");
    }

    return jwt.sign(
        { email: email },
        process.env.REFRESH_TOKEN_KEY,
        { expiresIn: '30d' }
    );
}
