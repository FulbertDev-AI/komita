// resources/js/Components/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import useDarkMode from '@/hooks/useDarkMode';
import {
    SunIcon,
    MoonIcon,
    Bars3Icon,
    XMarkIcon,
    ChevronDownIcon,
    UserCircleIcon,
    ArrowRightStartOnRectangleIcon,
    Squares2X2Icon,
    BellIcon,
} from '@heroicons/react/24/outline';

export default function Navbar() {
    const { t, i18n } = useTranslation();
    const { auth, canLogin, canRegister, notifications } = usePage().props;
    const user = auth?.user;
    const unread = notifications?.unread_count ?? 0;
    const [isDark, toggleDark] = useDarkMode();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 16);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleLang = () => {
        i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr');
    };

    const handleLogout = () => {
        router.post(route('logout'));
    };

    const navLinks = user
        ? [
              { href: route('home'), label: t('nav.home') },
              ...(user.role !== 'admin' ? [{ href: route('dashboard'), label: t('nav.dashboard') }] : []),
              { href: route('notifications.index'), label: `Notifications${unread > 0 ? ` (${unread})` : ''}` },
              ...(user.role === 'admin'
                  ? [{ href: route('admin.panel'), label: t('nav.admin') }]
                  : []),
          ]
        : [
              { href: '#features', label: t('nav.features'), anchor: true },
              { href: '#about', label: t('nav.about'), anchor: true },
          ];

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    isScrolled
                        ? 'backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-gray-200/50 dark:border-slate-700/50'
                        : 'bg-transparent'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-18">
                        {/* Logo */}
                        <Link href={user ? (user.role === 'admin' ? route('admin.panel') : route('dashboard')) : '/'} className="flex items-center gap-2">
                            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                                Komita
                            </span>
                        </Link>

                        {/* Desktop nav links */}
                        <div className="hidden lg:flex items-center gap-8">
                            {navLinks.map((link) =>
                                link.anchor ? (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                ) : (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                ),
                            )}
                        </div>

                        {/* Right side */}
                        <div className="hidden lg:flex items-center gap-3">
                            {/* Lang toggle */}
                            <button
                                onClick={toggleLang}
                                className="px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
                            >
                                {i18n.language === 'fr' ? 'EN' : 'FR'}
                            </button>

                            {/* Dark mode toggle */}
                            <button
                                onClick={toggleDark}
                                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
                            >
                                {isDark ? (
                                    <SunIcon className="h-5 w-5" />
                                ) : (
                                    <MoonIcon className="h-5 w-5" />
                                )}
                            </button>

                            {user && (
                                <Link
                                    href={route('notifications.index')}
                                    className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
                                >
                                    <BellIcon className="h-5 w-5" />
                                    {unread > 0 && (
                                        <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] leading-4 text-center">
                                            {unread > 99 ? '99+' : unread}
                                        </span>
                                    )}
                                </Link>
                            )}

                            {/* Auth buttons or avatar dropdown */}
                            {user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                    >
                                        <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                                            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                                                {user.name?.charAt(0)?.toUpperCase()}
                                            </span>
                                        </div>
                                        <span className="max-w-[120px] truncate">{user.name}</span>
                                        <ChevronDownIcon className="h-4 w-4 opacity-50" />
                                    </button>

                                    <AnimatePresence>
                                        {dropdownOpen && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-40"
                                                    onClick={() => setDropdownOpen(false)}
                                                />
                                                <motion.div
                                                    initial={{ opacity: 0, y: 4, scale: 0.97 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 4, scale: 0.97 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden z-50"
                                                >
                                                    <Link
                                                        href={route('profile.edit')}
                                                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                                                        onClick={() => setDropdownOpen(false)}
                                                    >
                                                        <UserCircleIcon className="h-4 w-4 opacity-60" />
                                                        {t('nav.profile')}
                                                    </Link>
                                                    <Link
                                                        href={route('home')}
                                                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                                                        onClick={() => setDropdownOpen(false)}
                                                    >
                                                        <Squares2X2Icon className="h-4 w-4 opacity-60" />
                                                        {t('nav.home')}
                                                    </Link>
                                                    <Link
                                                        href={route('notifications.index')}
                                                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                                                        onClick={() => setDropdownOpen(false)}
                                                    >
                                                        <BellIcon className="h-4 w-4 opacity-60" />
                                                        Notifications
                                                    </Link>
                                                    {user.role !== 'admin' && (
                                                        <Link
                                                            href={route('dashboard')}
                                                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                                                            onClick={() => setDropdownOpen(false)}
                                                        >
                                                            <Squares2X2Icon className="h-4 w-4 opacity-60" />
                                                            {t('nav.dashboard')}
                                                        </Link>
                                                    )}
                                                    {user.role === 'admin' && (
                                                        <Link
                                                            href={route('admin.panel')}
                                                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                                                            onClick={() => setDropdownOpen(false)}
                                                        >
                                                            <Squares2X2Icon className="h-4 w-4 opacity-60" />
                                                            {t('nav.admin')}
                                                        </Link>
                                                    )}
                                                    <div className="border-t border-gray-200 dark:border-slate-700" />
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                                                    >
                                                        <ArrowRightStartOnRectangleIcon className="h-4 w-4 opacity-60" />
                                                        {t('nav.logout')}
                                                    </button>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    {canLogin && (
                                        <Link
                                            href={route('login')}
                                            className="border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200"
                                        >
                                            {t('nav.login')}
                                        </Link>
                                    )}
                                    {canRegister && (
                                        <Link
                                            href={route('register')}
                                            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200"
                                        >
                                            {t('nav.register')}
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Mobile hamburger */}
                        <div className="flex items-center gap-2 lg:hidden">
                            <button
                                onClick={toggleDark}
                                className="p-2 text-gray-600 dark:text-gray-400 rounded-lg"
                            >
                                {isDark ? (
                                    <SunIcon className="h-5 w-5" />
                                ) : (
                                    <MoonIcon className="h-5 w-5" />
                                )}
                            </button>
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="p-2 text-gray-600 dark:text-gray-400 rounded-lg"
                            >
                                {mobileOpen ? (
                                    <XMarkIcon className="h-6 w-6" />
                                ) : (
                                    <Bars3Icon className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 lg:hidden"
                    >
                        <div
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
                            onClick={() => setMobileOpen(false)}
                        />
                        <div className="fixed top-16 left-0 right-0 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 shadow-sm">
                            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
                                {navLinks.map((link) =>
                                    link.anchor ? (
                                        <a
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setMobileOpen(false)}
                                            className="block px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                        >
                                            {link.label}
                                        </a>
                                    ) : (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setMobileOpen(false)}
                                            className="block px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    ),
                                )}

                                <div className="border-t border-gray-200 dark:border-slate-700 pt-2 mt-2">
                                    <button
                                        onClick={() => {
                                            toggleLang();
                                            setMobileOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                    >
                                        {i18n.language === 'fr' ? 'English' : 'Français'}
                                    </button>
                                </div>

                                {user ? (
                                    <div className="border-t border-gray-200 dark:border-slate-700 pt-2 mt-2 space-y-1">
                                        <Link
                                            href={route('home')}
                                            className="block px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            {t('nav.home')}
                                        </Link>
                                        <Link
                                            href={route('notifications.index')}
                                            className="block px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            Notifications
                                        </Link>
                                        <Link
                                            href={route('profile.edit')}
                                            className="block px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            {t('nav.profile')}
                                        </Link>
                                        {user.role === 'admin' && (
                                            <Link
                                                href={route('admin.panel')}
                                                className="block px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                                onClick={() => setMobileOpen(false)}
                                            >
                                                {t('nav.admin')}
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                        >
                                            {t('nav.logout')}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="border-t border-gray-200 dark:border-slate-700 pt-3 mt-2 flex flex-col gap-2">
                                        {canLogin && (
                                            <Link
                                                href={route('login')}
                                                className="block text-center border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
                                                onClick={() => setMobileOpen(false)}
                                            >
                                                {t('nav.login')}
                                            </Link>
                                        )}
                                        {canRegister && (
                                            <Link
                                                href={route('register')}
                                                className="block text-center bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
                                                onClick={() => setMobileOpen(false)}
                                            >
                                                {t('nav.register')}
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
