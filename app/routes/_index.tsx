import type { MetaFunction } from "@remix-run/cloudflare";
import { useState, useEffect, useRef } from "react";
import { Navigation } from "~/components/Navigation";
import type { Language } from "~/utils/i18n";
import { getTranslations, getDefaultName } from "~/utils/i18n";

export const meta: MetaFunction = () => {
	return [
		{ title: "生日快乐 🎂" },
		{ name: "description", content: "温馨的生日祝福页面" },
	];
};

export default function Index() {
	const [lang, setLang] = useState<Language>(() => {
		if (typeof window !== "undefined") {
			return (localStorage.getItem("language") as Language) || "zh";
		}
		return "zh";
	});
	const [name, setName] = useState(() => {
		if (typeof window !== "undefined") {
			return localStorage.getItem("birthdayName") || getDefaultName("zh");
		}
		return getDefaultName("zh");
	});
	const [musicUrl, setMusicUrl] = useState(() => {
		if (typeof window !== "undefined") {
			return localStorage.getItem("birthdayMusic") || "";
		}
		return "";
	});
	const [showSettings, setShowSettings] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const audioRef = useRef<HTMLAudioElement>(null);

	const t = getTranslations(lang);

	useEffect(() => {
		if (typeof window !== "undefined") {
			localStorage.setItem("language", lang);
			// 如果name是默认值，根据语言更新
			const savedName = localStorage.getItem("birthdayName");
			if (!savedName || savedName === getDefaultName(lang === "zh" ? "en" : "zh")) {
				setName(getDefaultName(lang));
			}
		}
	}, [lang]);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const savedName = localStorage.getItem("birthdayName");
			const savedMusic = localStorage.getItem("birthdayMusic");
			const savedLang = localStorage.getItem("language") as Language;
			if (savedLang) setLang(savedLang);
			if (savedName) setName(savedName);
			else setName(getDefaultName(savedLang || lang));
			if (savedMusic) setMusicUrl(savedMusic);
		}
	}, []);

	useEffect(() => {
		if (musicUrl && audioRef.current) {
			audioRef.current.load();
		}
	}, [musicUrl]);

	const handleNameChange = (newName: string) => {
		setName(newName);
		if (typeof window !== "undefined") {
			localStorage.setItem("birthdayName", newName);
		}
	};

	const handleMusicChange = (newMusicUrl: string) => {
		setMusicUrl(newMusicUrl);
		if (typeof window !== "undefined") {
			localStorage.setItem("birthdayMusic", newMusicUrl);
		}
	};

	const togglePlay = () => {
		if (audioRef.current) {
			if (isPlaying) {
				audioRef.current.pause();
			} else {
				audioRef.current.play().catch((err) => {
					console.error("播放音乐失败:", err);
				});
			}
			setIsPlaying(!isPlaying);
		}
	};

	return (
		<div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-100 via-purple-100 to-pink-200 dark:from-pink-900 dark:via-purple-900 dark:to-pink-800">
			{/* 导航菜单 */}
			<Navigation lang={lang} onLanguageChange={setLang} />

			{/* 背景装饰 */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-30 animate-bounce" style={{ animationDelay: "0s", animationDuration: "3s" }}></div>
				<div className="absolute top-20 right-20 w-16 h-16 bg-pink-300 rounded-full opacity-30 animate-bounce" style={{ animationDelay: "1s", animationDuration: "4s" }}></div>
				<div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-300 rounded-full opacity-30 animate-bounce" style={{ animationDelay: "2s", animationDuration: "5s" }}></div>
				<div className="absolute bottom-10 right-10 w-18 h-18 bg-yellow-200 rounded-full opacity-30 animate-bounce" style={{ animationDelay: "0.5s", animationDuration: "3.5s" }}></div>
			</div>

			{/* 设置按钮 */}
			<button
				onClick={() => setShowSettings(!showSettings)}
				className="fixed top-20 right-4 z-50 p-3 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all"
				aria-label={t.birthday.settings}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 w-6 text-gray-700 dark:text-gray-200"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
					/>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
					/>
				</svg>
			</button>

			{/* 设置面板 */}
			{showSettings && (
				<div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
					<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl max-w-md w-full mx-4">
						<h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">{t.birthday.settings}</h2>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									{t.birthday.name}
								</label>
								<input
									type="text"
									value={name}
									onChange={(e) => handleNameChange(e.target.value)}
									className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
									placeholder={t.birthday.namePlaceholder}
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									{t.birthday.musicUrl}
								</label>
								<input
									type="text"
									value={musicUrl}
									onChange={(e) => handleMusicChange(e.target.value)}
									className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
									placeholder={t.birthday.musicUrlPlaceholder}
								/>
								<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
									{t.birthday.musicUrlHint}
								</p>
							</div>
							<button
								onClick={() => setShowSettings(false)}
								className="w-full py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors"
							>
								{t.birthday.done}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* 主内容 */}
			<div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-12 px-4 pt-24">
				{/* 滚动字幕 */}
				<div className="w-full max-w-4xl mb-8 overflow-hidden">
					<div className="marquee-container">
						<div className="marquee-text">
							{t.birthday.marquee.replace("{name}", name)} {t.birthday.marquee.replace("{name}", name)} {t.birthday.marquee.replace("{name}", name)} {t.birthday.marquee.replace("{name}", name)}
						</div>
					</div>
				</div>

				{/* 生日蛋糕 */}
				<div className="relative mb-8">
					<BirthdayCake />
				</div>

				{/* 祝福文字 */}
				<div className="text-center space-y-4">
					<h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 animate-pulse">
						{t.birthday.greeting}
					</h1>
					<p className="text-2xl md:text-3xl text-gray-700 dark:text-gray-200 font-medium">
						{t.birthday.wish}
					</p>
				</div>

				{/* 音乐控制 */}
				{musicUrl && (
					<div className="mt-8">
						<button
							onClick={togglePlay}
							className="flex items-center gap-2 px-6 py-3 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all"
						>
							{isPlaying ? (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6 text-pink-500"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
								</svg>
							) : (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6 text-pink-500"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M8 5v14l11-7z" />
								</svg>
							)}
							<span className="text-gray-700 dark:text-gray-200 font-medium">
								{isPlaying ? t.birthday.pause : t.birthday.play}
							</span>
						</button>
					</div>
				)}

				{/* 隐藏的音频元素 */}
				{musicUrl && (
					<audio
						ref={audioRef}
						loop
						onPlay={() => setIsPlaying(true)}
						onPause={() => setIsPlaying(false)}
						onEnded={() => setIsPlaying(false)}
					>
						<source src={musicUrl} type="audio/mpeg" />
						<source src={musicUrl} type="audio/ogg" />
						{t.birthday.audioNotSupported}
					</audio>
				)}
			</div>

			{/* 自定义样式 */}
			<style>{`
				@keyframes marquee {
					0% {
						transform: translateX(100%);
					}
					100% {
						transform: translateX(-100%);
					}
				}

				.marquee-container {
					overflow: hidden;
					white-space: nowrap;
					position: relative;
					width: 100%;
				}

				.marquee-text {
					display: inline-block;
					animation: marquee 20s linear infinite;
					font-size: 2rem;
					font-weight: bold;
					color: #ec4899;
					text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
				}

				@keyframes float {
					0%, 100% {
						transform: translateY(0px);
					}
					50% {
						transform: translateY(-20px);
					}
				}

				.cake-container {
					animation: float 3s ease-in-out infinite;
				}
			`}</style>
		</div>
	);
}

// 生日蛋糕组件
function BirthdayCake() {
	return (
		<div className="cake-container">
			<svg
				width="300"
				height="400"
				viewBox="0 0 300 400"
				xmlns="http://www.w3.org/2000/svg"
			>
				{/* 蛋糕底层 */}
				<ellipse cx="150" cy="320" rx="120" ry="30" fill="#8B4513" />
				<rect x="60" y="200" width="180" height="120" rx="10" fill="#FFB6C1" />
				<rect x="70" y="190" width="160" height="20" rx="10" fill="#FF69B4" />

				{/* 蛋糕中层 */}
				<ellipse cx="150" cy="200" rx="100" ry="25" fill="#8B4513" />
				<rect x="70" y="120" width="160" height="80" rx="10" fill="#FFC0CB" />
				<rect x="80" y="110" width="140" height="20" rx="10" fill="#FF1493" />

				{/* 蛋糕顶层 */}
				<ellipse cx="150" cy="120" rx="80" ry="20" fill="#8B4513" />
				<rect x="90" y="60" width="120" height="60" rx="10" fill="#FFB6C1" />
				<rect x="100" y="50" width="100" height="20" rx="10" fill="#FF69B4" />

				{/* 蜡烛 */}
				<rect x="145" y="20" width="10" height="40" fill="#FFD700" />
				<rect x="147" y="15" width="6" height="8" fill="#FF6347" rx="3" />

				{/* 火焰 */}
				<ellipse cx="150" cy="12" rx="4" ry="6" fill="#FF4500">
					<animate attributeName="cy" values="12;10;12" dur="0.5s" repeatCount="indefinite" />
					<animate attributeName="ry" values="6;8;6" dur="0.5s" repeatCount="indefinite" />
				</ellipse>
				<ellipse cx="150" cy="10" rx="3" ry="5" fill="#FFD700">
					<animate attributeName="cy" values="10;8;10" dur="0.5s" repeatCount="indefinite" />
					<animate attributeName="ry" values="5;7;5" dur="0.5s" repeatCount="indefinite" />
				</ellipse>

				{/* 装饰星星 */}
				<g opacity="0.8">
					<path
						d="M100 80 L105 95 L120 95 L108 105 L113 120 L100 110 L87 120 L92 105 L80 95 L95 95 Z"
						fill="#FFD700"
					>
						<animateTransform
							attributeName="transform"
							type="rotate"
							values="0 100 100;360 100 100"
							dur="3s"
							repeatCount="indefinite"
						/>
					</path>
					<path
						d="M200 80 L205 95 L220 95 L208 105 L213 120 L200 110 L187 120 L192 105 L180 95 L195 95 Z"
						fill="#FFD700"
					>
						<animateTransform
							attributeName="transform"
							type="rotate"
							values="360 200 100;0 200 100"
							dur="3s"
							repeatCount="indefinite"
						/>
					</path>
				</g>

				{/* 装饰点 */}
				<circle cx="120" cy="250" r="5" fill="#FF1493">
					<animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
				</circle>
				<circle cx="180" cy="250" r="5" fill="#FF1493">
					<animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
				</circle>
				<circle cx="100" cy="150" r="4" fill="#FF69B4">
					<animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
				</circle>
				<circle cx="200" cy="150" r="4" fill="#FF69B4">
					<animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" />
				</circle>
			</svg>
		</div>
	);
}
