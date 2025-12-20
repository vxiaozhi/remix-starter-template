import { createCookieSessionStorage } from "@remix-run/cloudflare";

// 创建 session 存储
export function createSessionStorage(cookieSecret: string, isProduction = false) {
	return createCookieSessionStorage({
		cookie: {
			name: "__session",
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 30, // 30 days
			path: "/",
			sameSite: "lax",
			secrets: [cookieSecret],
			secure: isProduction,
		},
	});
}

// 用户信息类型
export interface User {
	id: string;
	email: string;
	name: string;
	avatar?: string;
	provider: "google" | "github";
}
