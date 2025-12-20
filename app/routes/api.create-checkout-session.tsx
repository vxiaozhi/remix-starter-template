import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import Stripe from "stripe";

export const action = async ({ request, context }: ActionFunctionArgs) => {
	if (request.method !== "POST") {
		return json({ error: "Method not allowed" }, { status: 405 });
	}

	try {
		const { planType } = await request.json();

		if (!planType || (planType !== "monthly" && planType !== "yearly")) {
			return json({ error: "Invalid plan type" }, { status: 400 });
		}

		// 从环境变量获取 Stripe 密钥
		const stripeSecretKey = context.cloudflare.env.STRIPE_SECRET_KEY;
		if (!stripeSecretKey) {
			console.error("STRIPE_SECRET_KEY is not set");
			return json({ error: "Stripe configuration error" }, { status: 500 });
		}

		const stripe = new Stripe(stripeSecretKey, {
			httpClient: Stripe.createFetchHttpClient(),
		});

		// 获取请求的 origin 用于构建成功和取消 URL
		const origin = new URL(request.url).origin;

		// 定义价格 ID（这些需要在 Stripe Dashboard 中创建）
		// 这里使用占位符，实际使用时需要替换为真实的 Price ID
		const priceIds: Record<string, string> = {
			monthly: context.cloudflare.env.STRIPE_PRICE_ID_MONTHLY || "price_monthly_placeholder",
			yearly: context.cloudflare.env.STRIPE_PRICE_ID_YEARLY || "price_yearly_placeholder",
		};

		const priceId = priceIds[planType];
		if (!priceId || priceId.includes("placeholder")) {
			return json(
				{
					error: "Price ID not configured. Please set STRIPE_PRICE_ID_MONTHLY and STRIPE_PRICE_ID_YEARLY in environment variables.",
				},
				{ status: 500 },
			);
		}

		// 创建 Checkout Session
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: [
				{
					price: priceId,
					quantity: 1,
				},
			],
			mode: "subscription",
			success_url: `${origin}/pricing?success=true&session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${origin}/pricing?canceled=true`,
			metadata: {
				planType,
			},
		});

		return json({ url: session.url });
	} catch (error) {
		console.error("Error creating checkout session:", error);
		return json(
			{ error: error instanceof Error ? error.message : "Failed to create checkout session" },
			{ status: 500 },
		);
	}
};
