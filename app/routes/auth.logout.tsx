import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { createSessionStorage } from "~/utils/session.server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
	return redirect("/");
};

export const action = async ({ request, context }: ActionFunctionArgs) => {
	const env = context.cloudflare.env;
	const sessionSecret = env.SESSION_SECRET || "default-secret-change-in-production";
	const isProduction = env.NODE_ENV === "production";
	const sessionStorage = createSessionStorage(sessionSecret, isProduction);
	const session = await sessionStorage.getSession(request.headers.get("Cookie"));

	return redirect("/", {
		headers: {
			"Set-Cookie": await sessionStorage.destroySession(session),
		},
	});
};
