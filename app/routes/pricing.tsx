import type { MetaFunction } from "@remix-run/cloudflare";
import { useState, useEffect } from "react";
import { useSearchParams } from "@remix-run/react";
import { Navigation } from "~/components/Navigation";
import type { Language } from "~/utils/i18n";
import { getTranslations } from "~/utils/i18n";

export const meta: MetaFunction = () => {
	return [
		{ title: "价格" },
		{ name: "description", content: "查看我们的价格方案" },
	];
};

export default function Pricing() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [lang, setLang] = useState<Language>(() => {
		if (typeof window !== "undefined") {
			return (localStorage.getItem("language") as Language) || "zh";
		}
		return "zh";
	});
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState<{ type: "success" | "error" | null; text: string }>({
		type: null,
		text: "",
	});

	useEffect(() => {
		if (typeof window !== "undefined") {
			localStorage.setItem("language", lang);
		}
	}, [lang]);

	useEffect(() => {
		const success = searchParams.get("success");
		const canceled = searchParams.get("canceled");

		if (success === "true") {
			setMessage({
				type: "success",
				text: lang === "zh" ? "支付成功！感谢您的订阅。" : "Payment successful! Thank you for your subscription.",
			});
			// 清除 URL 参数
			const newSearchParams = new URLSearchParams(searchParams);
			newSearchParams.delete("success");
			newSearchParams.delete("session_id");
			setSearchParams(newSearchParams, { replace: true });
		} else if (canceled === "true") {
			setMessage({
				type: "error",
				text: lang === "zh" ? "支付已取消。" : "Payment canceled.",
			});
			// 清除 URL 参数
			const newSearchParams = new URLSearchParams(searchParams);
			newSearchParams.delete("canceled");
			setSearchParams(newSearchParams, { replace: true });
		}
	}, [searchParams, lang, setSearchParams]);

	const t = getTranslations(lang);

	const handleSubscribe = async (planType: "monthly" | "yearly") => {
		setIsLoading(true);
		try {
			const response = await fetch("/api/create-checkout-session", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ planType }),
			});

			if (!response.ok) {
				throw new Error("Failed to create checkout session");
			}

			const { url } = await response.json();
			if (url) {
				window.location.href = url;
			}
		} catch (error) {
			console.error("Error creating checkout session:", error);
			alert(lang === "zh" ? "创建支付会话失败，请稍后重试" : "Failed to create checkout session, please try again");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-pink-200 dark:from-pink-900 dark:via-purple-900 dark:to-pink-800">
			<Navigation lang={lang} onLanguageChange={setLang} />
			<div className="pt-16 pb-12 px-4">
				<div className="max-w-6xl mx-auto mt-12">
					{/* 消息提示 */}
					{message.type && (
						<div
							className={`mb-6 p-4 rounded-lg ${
								message.type === "success"
									? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
									: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
							}`}
						>
							<div className="flex items-center justify-between">
								<span>{message.text}</span>
								<button
									onClick={() => setMessage({ type: null, text: "" })}
									className="ml-4 text-current opacity-70 hover:opacity-100"
								>
									<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
										<path
											fillRule="evenodd"
											d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
											clipRule="evenodd"
										/>
									</svg>
								</button>
							</div>
						</div>
					)}

					<div className="text-center mb-12">
						<h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 mb-4">
							{t.pricing.title}
						</h1>
						<p className="text-lg md:text-xl text-gray-700 dark:text-gray-300">
							{t.pricing.content}
						</p>
					</div>

					<div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
						{/* 按月订阅 */}
						<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl p-8 md:p-10 hover:shadow-2xl transition-shadow">
							<div className="text-center mb-6">
								<h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
									{t.pricing.monthly}
								</h2>
								<div className="flex items-baseline justify-center">
									<span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
										{t.pricing.monthlyPrice}
									</span>
									<span className="text-gray-600 dark:text-gray-400 ml-2">
										{t.pricing.perMonth}
									</span>
								</div>
								<p className="text-gray-600 dark:text-gray-400 mt-2">
									{t.pricing.monthlyDesc}
								</p>
							</div>

							<ul className="space-y-3 mb-8">
								<li className="flex items-center text-gray-700 dark:text-gray-300">
									<svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
									</svg>
									{t.pricing.feature1}
								</li>
								<li className="flex items-center text-gray-700 dark:text-gray-300">
									<svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
									</svg>
									{t.pricing.feature2}
								</li>
								<li className="flex items-center text-gray-700 dark:text-gray-300">
									<svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
									</svg>
									{t.pricing.feature3}
								</li>
							</ul>

							<button
								onClick={() => handleSubscribe("monthly")}
								disabled={isLoading}
								className="w-full py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isLoading ? (lang === "zh" ? "处理中..." : "Processing...") : t.pricing.subscribe}
							</button>
						</div>

						{/* 年度订阅 */}
						<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl p-8 md:p-10 hover:shadow-2xl transition-shadow border-2 border-purple-500 relative">
							<div className="absolute top-0 right-0 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1 rounded-bl-lg rounded-tr-2xl text-sm font-semibold">
								{t.pricing.yearlySave}
							</div>
							<div className="text-center mb-6">
								<h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
									{t.pricing.yearly}
								</h2>
								<div className="flex items-baseline justify-center">
									<span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
										{t.pricing.yearlyPrice}
									</span>
									<span className="text-gray-600 dark:text-gray-400 ml-2">
										{t.pricing.perYear}
									</span>
								</div>
								<p className="text-gray-600 dark:text-gray-400 mt-2">
									{t.pricing.yearlyDesc}
								</p>
							</div>

							<ul className="space-y-3 mb-8">
								<li className="flex items-center text-gray-700 dark:text-gray-300">
									<svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
									</svg>
									{t.pricing.feature1}
								</li>
								<li className="flex items-center text-gray-700 dark:text-gray-300">
									<svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
									</svg>
									{t.pricing.feature2}
								</li>
								<li className="flex items-center text-gray-700 dark:text-gray-300">
									<svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
									</svg>
									{t.pricing.feature3}
								</li>
							</ul>

							<button
								onClick={() => handleSubscribe("yearly")}
								disabled={isLoading}
								className="w-full py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isLoading ? (lang === "zh" ? "处理中..." : "Processing...") : t.pricing.subscribe}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

