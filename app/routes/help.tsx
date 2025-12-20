import type { MetaFunction } from "@remix-run/cloudflare";
import { useState, useEffect } from "react";
import { Navigation } from "~/components/Navigation";
import type { Language } from "~/utils/i18n";
import { getTranslations } from "~/utils/i18n";

export const meta: MetaFunction = () => {
	return [
		{ title: "帮助" },
		{ name: "description", content: "使用帮助和常见问题" },
	];
};

export default function Help() {
	const [lang, setLang] = useState<Language>(() => {
		if (typeof window !== "undefined") {
			return (localStorage.getItem("language") as Language) || "zh";
		}
		return "zh";
	});

	useEffect(() => {
		if (typeof window !== "undefined") {
			localStorage.setItem("language", lang);
		}
	}, [lang]);

	const t = getTranslations(lang);

	return (
		<div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-pink-200 dark:from-pink-900 dark:via-purple-900 dark:to-pink-800">
			<Navigation lang={lang} onLanguageChange={setLang} />
			<div className="pt-16 pb-12 px-4">
				<div className="max-w-4xl mx-auto mt-12">
					<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl p-8 md:p-12">
						<h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 mb-6">
							{t.help.title}
						</h1>
						<p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
							{t.help.content}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

