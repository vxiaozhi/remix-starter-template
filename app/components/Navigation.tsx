import React from "react";
import { Link, useLocation, Form, useOutletContext } from "@remix-run/react";
import type { Language } from "~/utils/i18n";
import { getTranslations } from "~/utils/i18n";
import type { User } from "~/utils/session.server";

interface NavigationProps {
	lang: Language;
	onLanguageChange: (lang: Language) => void;
	user?: User | null;
}

interface AppContext {
	user?: User | null;
}

export function Navigation({ lang, onLanguageChange, user: userProp }: NavigationProps) {
	const location = useLocation();
	const context = useOutletContext<AppContext>();
	const user = userProp ?? context?.user;
	const t = getTranslations(lang);

	const isActive = (path: string) => {
		return location.pathname === path;
	};

	return (
		<nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo/Brand */}
					<Link
						to="/"
						className="flex items-center space-x-2 text-xl font-bold text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors"
					>
						<span>🎂</span>
						<span>Birthday</span>
					</Link>

					{/* Navigation Links */}
					<div className="hidden md:flex items-center space-x-1">
						<NavLink to="/" isActive={isActive("/")}>
							{t.nav.home}
						</NavLink>
						<NavLink to="/about" isActive={isActive("/about")}>
							{t.nav.about}
						</NavLink>
						<NavLink to="/help" isActive={isActive("/help")}>
							{t.nav.help}
						</NavLink>
						<NavLink to="/pricing" isActive={isActive("/pricing")}>
							{t.nav.pricing}
						</NavLink>
					</div>

					{/* User Menu / Login */}
					<div className="flex items-center space-x-2">
						{user ? (
							<div className="flex items-center space-x-3">
								{user.avatar && (
									<img
										src={user.avatar}
										alt={user.name}
										className="w-8 h-8 rounded-full"
									/>
								)}
								<span className="hidden md:block text-sm text-gray-700 dark:text-gray-300">
									{user.name}
								</span>
								<Form action="/auth/logout" method="post">
									<button
										type="submit"
										className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
									>
										{t.nav.logout}
									</button>
								</Form>
							</div>
						) : (
							<Link
								to="/login"
								className="px-4 py-2 rounded-md text-sm font-medium bg-pink-500 text-white hover:bg-pink-600 transition-colors"
							>
								{t.nav.login}
							</Link>
						)}
						<div className="flex items-center space-x-1 ml-2 border-l border-gray-300 dark:border-gray-700 pl-2">
							<button
								onClick={() => onLanguageChange("zh")}
								className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
									lang === "zh"
										? "bg-pink-500 text-white"
										: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
								}`}
							>
								中文
							</button>
							<button
								onClick={() => onLanguageChange("en")}
								className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
									lang === "en"
										? "bg-pink-500 text-white"
										: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
								}`}
							>
								English
							</button>
						</div>
					</div>

					{/* Mobile Menu Button */}
					<div className="md:hidden">
						<MobileMenu lang={lang} onLanguageChange={onLanguageChange} />
					</div>
				</div>
			</div>
		</nav>
	);
}

function NavLink({
	to,
	isActive,
	children,
}: {
	to: string;
	isActive: boolean;
	children: React.ReactNode;
}) {
	return (
		<Link
			to={to}
			className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
				isActive
					? "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300"
					: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
			}`}
		>
			{children}
		</Link>
	);
}

function MobileMenu({
	lang,
	onLanguageChange,
}: {
	lang: Language;
	onLanguageChange: (lang: Language) => void;
}) {
	const [isOpen, setIsOpen] = React.useState(false);
	const location = useLocation();
	const t = getTranslations(lang);

	const isActive = (path: string) => {
		return location.pathname === path;
	};

	return (
		<>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
				aria-label="菜单"
			>
				<svg
					className="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					{isOpen ? (
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					) : (
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M4 6h16M4 12h16M4 18h16"
						/>
					)}
				</svg>
			</button>

			{isOpen && (
				<div className="absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-700">
					<div className="px-4 py-2 space-y-1">
						<MobileNavLink to="/" isActive={isActive("/")} onClick={() => setIsOpen(false)}>
							{t.nav.home}
						</MobileNavLink>
						<MobileNavLink to="/about" isActive={isActive("/about")} onClick={() => setIsOpen(false)}>
							{t.nav.about}
						</MobileNavLink>
						<MobileNavLink to="/help" isActive={isActive("/help")} onClick={() => setIsOpen(false)}>
							{t.nav.help}
						</MobileNavLink>
						<MobileNavLink to="/pricing" isActive={isActive("/pricing")} onClick={() => setIsOpen(false)}>
							{t.nav.pricing}
						</MobileNavLink>
						<div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center space-x-2">
							<button
								onClick={() => {
									onLanguageChange("zh");
									setIsOpen(false);
								}}
								className={`px-3 py-1 rounded-md text-sm font-medium ${
									lang === "zh"
										? "bg-pink-500 text-white"
										: "text-gray-700 dark:text-gray-300"
								}`}
							>
								中文
							</button>
							<button
								onClick={() => {
									onLanguageChange("en");
									setIsOpen(false);
								}}
								className={`px-3 py-1 rounded-md text-sm font-medium ${
									lang === "en"
										? "bg-pink-500 text-white"
										: "text-gray-700 dark:text-gray-300"
								}`}
							>
								English
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

function MobileNavLink({
	to,
	isActive,
	onClick,
	children,
}: {
	to: string;
	isActive: boolean;
	onClick: () => void;
	children: React.ReactNode;
}) {
	return (
		<Link
			to={to}
			onClick={onClick}
			className={`block px-4 py-2 rounded-md text-base font-medium ${
				isActive
					? "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300"
					: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
			}`}
		>
			{children}
		</Link>
	);
}

