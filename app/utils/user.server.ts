import type { AppLoadContext, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { createAuthenticator, getRequestOrigin } from "./auth.server";
import type { User } from "./session.server";

export async function getCurrentUser(request: Request, context: AppLoadContext): Promise<User | null> {
	try {
		const origin = getRequestOrigin(request);
		const authenticator = createAuthenticator(context, origin);
		return await authenticator.isAuthenticated(request);
	} catch {
		return null;
	}
}
