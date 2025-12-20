import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { createAuthenticator, getRequestOrigin } from "~/utils/auth.server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
	const origin = getRequestOrigin(request);
	const authenticator = createAuthenticator(context, origin);
	return authenticator.authenticate("google", request, {
		successRedirect: "/",
		failureRedirect: "/login?error=google",
	});
};

export const action = async ({ request, context }: ActionFunctionArgs) => {
	const origin = getRequestOrigin(request);
	const authenticator = createAuthenticator(context, origin);
	return authenticator.authenticate("google", request, {
		successRedirect: "/",
		failureRedirect: "/login?error=google",
	});
};
