import type { AppLoadContext } from "@remix-run/cloudflare";
import { Authenticator } from "remix-auth";
import { OAuth2Strategy } from "remix-auth-oauth2";
import { createSessionStorage, type User } from "./session.server";

// 获取环境变量
function getEnv(context: AppLoadContext) {
	const env = context.cloudflare.env;
	return {
		GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET,
		GITHUB_CLIENT_ID: env.GITHUB_CLIENT_ID,
		GITHUB_CLIENT_SECRET: env.GITHUB_CLIENT_SECRET,
		SESSION_SECRET: env.SESSION_SECRET || "default-secret-change-in-production",
		NODE_ENV: env.NODE_ENV || "development",
	};
}

// 判断是否为生产环境
export function isProduction(context: AppLoadContext): boolean {
	const env = getEnv(context);
	return env.NODE_ENV === "production";
}

// 创建 Authenticator
export function createAuthenticator(context: AppLoadContext, requestOrigin: string) {
	const env = getEnv(context);
	const sessionStorage = createSessionStorage(env.SESSION_SECRET, env.NODE_ENV === "production");

	const authenticator = new Authenticator<User>(sessionStorage);

	// Google OAuth 策略
	if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
		authenticator.use(
			new OAuth2Strategy(
				{
					authorizationURL: "https://accounts.google.com/o/oauth2/v2/auth",
					tokenURL: "https://oauth2.googleapis.com/token",
					clientID: env.GOOGLE_CLIENT_ID,
					clientSecret: env.GOOGLE_CLIENT_SECRET,
					callbackURL: new URL("/auth/google/callback", requestOrigin).toString(),
					scope: "openid email profile",
				},
				async ({ accessToken }) => {
					// 获取用户信息
					const userInfoResponse = await fetch(
						`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`,
					);
					const userInfo = await userInfoResponse.json();

					return {
						id: userInfo.id,
						email: userInfo.email,
						name: userInfo.name,
						avatar: userInfo.picture,
						provider: "google" as const,
					};
				},
			),
			"google",
		);
	}

	// GitHub OAuth 策略（仅在非生产环境启用）
	if (!isProduction(context) && env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
		authenticator.use(
			new OAuth2Strategy(
				{
					authorizationURL: "https://github.com/login/oauth/authorize",
					tokenURL: "https://github.com/login/oauth/access_token",
					clientID: env.GITHUB_CLIENT_ID,
					clientSecret: env.GITHUB_CLIENT_SECRET,
					callbackURL: new URL("/auth/github/callback", requestOrigin).toString(),
					scope: "user:email",
				},
				async ({ accessToken }) => {
					// 获取用户信息
					const userResponse = await fetch("https://api.github.com/user", {
						headers: {
							Authorization: `Bearer ${accessToken}`,
							Accept: "application/vnd.github.v3+json",
						},
					});
					const user = await userResponse.json();

					// 获取用户邮箱
					const emailResponse = await fetch("https://api.github.com/user/emails", {
						headers: {
							Authorization: `Bearer ${accessToken}`,
							Accept: "application/vnd.github.v3+json",
						},
					});
					const emails = await emailResponse.json();
					const primaryEmail = emails.find((e: { primary: boolean }) => e.primary) || emails[0];

					return {
						id: user.id.toString(),
						email: primaryEmail?.email || user.email || "",
						name: user.name || user.login,
						avatar: user.avatar_url,
						provider: "github" as const,
					};
				},
			),
			"github",
		);
	}

	return authenticator;
}

// 从 request 中获取 origin 的辅助函数
export function getRequestOrigin(request: Request): string {
	const url = new URL(request.url);
	return `${url.protocol}//${url.host}`;
}
