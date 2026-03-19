import jwt, { type Secret } from "jsonwebtoken";

export type JwtPayload = {
	id: string;
	email: string;
};

export const signJwt = (
	payload: JwtPayload,
	expiresIn: Parameters<typeof jwt.sign>[2]["expiresIn"] = "1h",
): string => {
	const secret: Secret = Bun.env.JWT_SECRET;
	return jwt.sign(payload, secret, { expiresIn });
};

export const verifyJwt = (token: string): JwtPayload => {
	const secret: Secret = Bun.env.JWT_SECRET;
	return jwt.verify(token, secret) as JwtPayload;
};
