// resources/js/Pages/Welcome.jsx
import { useState, useEffect, useRef } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { pageTransition, listContainer, listItem, slideUp } from '@/config/animations';
import GuestLayout from '@/Components/GuestLayout';
import Button from '@/Components/Button';
import Card from '@/Components/Card';
import {
    RocketLaunchIcon,
    CalendarDaysIcon,
    ChartBarIcon,
    ClockIcon,
    LinkIcon,
    ShieldCheckIcon,
    ChevronDownIcon,
} from '@heroicons/react/24/outline';

function AnimatedCounter({ target, suffix = '', duration = 2 }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const count = useMotionValue(0);
    const rounded = useTransform(count, (val) => Math.floor(val));
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (isInView) {
            const controls = animate(count, target, { duration });
            const unsub = rounded.on('change', (v) => setDisplay(v));
            return () => {
                controls.stop();
                unsub();
            };
        }
    }, [isInView, target, count, duration, rounded]);

    return (
        <span ref={ref}>
            {display}
            {suffix}
        </span>
    );
}

function HeroSvgUnderline() {
    return (
        <svg
            className="absolute -bottom-2 left-0 w-full"
            viewBox="0 0 200 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
        >
            <path
                d="M2 8.5C30 2 70 2 100 5.5C130 9 170 9.5 198 4"
                stroke=""
                strokeWidth="3"
                strokeLinecap="round"
                className="opacity-80"
            />
        </svg>
    );
}

export default function Welcome() {
    const { t } = useTranslation();
    const { canLogin, canRegister } = usePage().props;

    const features = [
        {
            icon: RocketLaunchIcon,
            title: t('welcome.features.challenge.title'),
            desc: t('welcome.features.challenge.desc'),
        },
        {
            icon: CalendarDaysIcon,
            title: t('welcome.features.event.title'),
            desc: t('welcome.features.event.desc'),
        },
        {
            icon: ChartBarIcon,
            title: t('welcome.features.tracking.title'),
            desc: t('welcome.features.tracking.desc'),
        },
    ];

    const institutions = [
        'Université de Lomé',
        'École Polytechnique de Lomé',
        'Université de Kara',
        'Institut Defitech',
        'Ecole Supérieure des Affaires (ESA)',
    ];

    return (
        <GuestLayout>
            <Head title={t('nav.home')} />

            <motion.div
                initial={pageTransition.initial}
                animate={pageTransition.animate}
                transition={pageTransition.transition}
            >
                {/* ─── HERO ─── */}
                <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                    {/* Background gradient shapes */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-radial from-indigo-500/20 to-transparent rounded-full blur-3xl" />
                        <div className="absolute top-1/3 right-0 w-80 h-80 bg-gradient-radial from-violet-500/15 to-transparent rounded-full blur-3xl" />
                        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-radial from-indigo-400/10 to-transparent rounded-full blur-3xl" />
                    </div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16 lg:pt-32 lg:pb-24">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                        >
                            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-none text-gray-900 dark:text-white">
                                {t('welcome.hero.title1')}
                                <br />
                                <span className="relative inline-block">
                                    {t('welcome.hero.title2')}
                                    <HeroSvgUnderline />
                                </span>
                            </h1>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
                            className="mt-8 text-lg lg:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto"
                        >
                            {t('welcome.hero.subtitle')}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.35, ease: 'easeOut' }}
                            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            {canRegister && (
                                <Link
                                    href={route('register')}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-8 py-3.5 font-medium transition-all duration-200 text-sm"
                                >
                                    {t('welcome.hero.cta1')}
                                </Link>
                            )}
                            <a
                                href="#features"
                                className="border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl px-8 py-3.5 font-medium transition-all duration-200 text-sm"
                            >
                                {t('welcome.hero.cta2')}
                            </a>
                        </motion.div>
                    </div>

                    {/* Scroll indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                    >
                        <span className="text-xs text-gray-400 dark:text-gray-500 tracking-wide">
                            {t('welcome.hero.scroll')}
                        </span>
                        <ChevronDownIcon className="h-4 w-4 text-gray-400 dark:text-gray-500 animate-bounce" />
                    </motion.div>
                </section>

                {/* ─── SOCIAL PROOF ─── */}
                <section className="py-16 lg:py-20 border-t border-gray-200/50 dark:border-slate-700/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-10">
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1 rounded-full">
                                {t('welcome.social.badge')}
                            </span>
                            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                                {t('welcome.social.text')}
                            </p>
                        </div>
                        <div className="flex items-center justify-center gap-8 lg:gap-16 flex-wrap opacity-40 dark:opacity-30">
                            {institutions.map((name) => (
                                <span
                                    key={name}
                                    className="text-sm lg:text-base font-semibold text-gray-900 dark:text-white whitespace-nowrap"
                                >
                                    {name}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── FEATURES ─── */}
                <section id="features" className="py-24 lg:py-32">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16 lg:mb-20">
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1 rounded-full">
                                {t('welcome.features.badge')}
                            </span>
                            <h2 className="mt-6 text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                                {t('welcome.features.title')}
                            </h2>
                            <p className="mt-4 text-base lg:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
                                {t('welcome.features.subtitle')}
                            </p>
                        </div>

                        {/* 3 feature cards */}
                        <motion.div
                            variants={listContainer}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: '-80px' }}
                            className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-24"
                        >
                            {features.map((feature) => (
                                <motion.div key={feature.title} variants={listItem}>
                                    <Card hover className="h-full">
                                        {/* <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 mb-5">
                                            <feature.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                        </div> */}
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {feature.desc}
                                        </p>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Alternating rows */}
                        <div className="space-y-24">
                            {/* Row 1: text left, visual right */}
                            <motion.div
                                initial={slideUp.initial}
                                whileInView={slideUp.animate}
                                viewport={{ once: true, margin: '-100px' }}
                                transition={slideUp.transition}
                                className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
                            >
                                <div>
                                    {/* <div className="flex items-center gap-2 mb-4">
                                        <ClockIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                        <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                                            {t('welcome.features.badge')}
                                        </span>
                                    </div> */}
                                    <h3 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                                        {t('welcome.features.alt1.title')}
                                    </h3>
                                    <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {t('welcome.features.alt1.desc')}
                                    </p>
                                </div>
                                <div className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30 rounded-2xl p-8 lg:p-12 border border-indigo-100 dark:border-indigo-900/50 aspect-[4/3] flex items-center justify-center">
                                    <div className="w-full max-w-xs space-y-3">
                                        <div className="h-3 bg-indigo-200 dark:bg-indigo-800 rounded-full w-full" />
                                        <div className="h-3 bg-indigo-300 dark:bg-indigo-700 rounded-full w-4/5" />
                                        <div className="h-3 bg-indigo-200 dark:bg-indigo-800 rounded-full w-3/5" />
                                        <div className="h-3 bg-indigo-100 dark:bg-indigo-900 rounded-full w-2/5" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Row 2: visual left, text right */}
                            <motion.div
                                initial={slideUp.initial}
                                whileInView={slideUp.animate}
                                viewport={{ once: true, margin: '-100px' }}
                                transition={slideUp.transition}
                                className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
                            >
                                <div className="order-2 lg:order-1 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 rounded-2xl p-8 lg:p-12 border border-violet-100 dark:border-violet-900/50 aspect-[4/3] flex items-center justify-center">
                                    <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
                                        {[65, 82, 91, 45, 73, 58].map((h, i) => (
                                            <div
                                                key={i}
                                                className="bg-indigo-300 dark:bg-indigo-700 rounded-lg"
                                                style={{ height: `${h}px` }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="order-1 lg:order-2">
                                    {/* <div className="flex items-center gap-2 mb-4">
                                        <LinkIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                        <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                                            {t('welcome.features.badge')}
                                        </span>
                                    </div> */}
                                    <h3 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                                        {t('welcome.features.alt2.title')}
                                    </h3>
                                    <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {t('welcome.features.alt2.desc')}
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* ─── TESTIMONIAL ─── */}
                <section className="py-24 lg:py-32 border-t border-gray-200/50 dark:border-slate-700/50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial={slideUp.initial}
                            whileInView={slideUp.animate}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={slideUp.transition}
                        >
                            <blockquote className="text-2xl lg:text-3xl font-medium italic text-gray-900 dark:text-white leading-relaxed">
                                &ldquo;{t('welcome.testimonial.quote')}&rdquo;
                            </blockquote>
                            <div className="mt-8 flex items-center justify-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
                                    <span className="text-sm font-bold text-white">ML</span>
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {t('welcome.testimonial.name')}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {t('welcome.testimonial.title')}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ─── STATS ─── */}
                <section className="py-24 lg:py-32">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={slideUp.initial}
                            whileInView={slideUp.animate}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={slideUp.transition}
                            className="grid md:grid-cols-3 gap-8 lg:gap-12 text-center"
                        >
                            <div>
                                <p className="text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    <AnimatedCounter target={500} suffix="+" />
                                </p>
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                                    {t('welcome.stats.students')}
                                </p>
                            </div>
                            <div>
                                <p className="text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    <AnimatedCounter target={1200} suffix="+" />
                                </p>
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                                    {t('welcome.stats.challenges')}
                                </p>
                            </div>
                            <div>
                                <p className="text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    <AnimatedCounter target={87} suffix="%" />
                                </p>
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                                    {t('welcome.stats.success')}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ─── CTA FINAL ─── */}
                <section className="py-24 lg:py-32 bg-slate-900 dark:bg-slate-950">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial={slideUp.initial}
                            whileInView={slideUp.animate}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={slideUp.transition}
                        >
                            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                                {t('welcome.cta.title')}
                            </h2>
                            <p className="mt-5 text-lg text-gray-400 leading-relaxed">
                                {t('welcome.cta.subtitle')}
                            </p>
                            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                                {canRegister && (
                                    <Link
                                        href={route('register')}
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-8 py-3.5 font-medium transition-all duration-200 text-sm"
                                    >
                                        {t('welcome.cta.button1')}
                                    </Link>
                                )}
                                <a
                                    href="#features"
                                    className="border border-slate-600 text-gray-300 hover:bg-slate-800 rounded-xl px-8 py-3.5 font-medium transition-all duration-200 text-sm"
                                >
                                    {t('welcome.cta.button2')}
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ─── FOOTER ─── */}
                <footer className="py-16 lg:py-20 border-t border-gray-200 dark:border-slate-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-4 gap-10 lg:gap-16">
                            {/* Brand column */}
                            <div className="md:col-span-2">
                                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                                    Komita
                                </span>
                                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
                                    {t('welcome.footer.description')}
                                </p>
                            </div>
                            {/* Product links */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                                    {t('welcome.footer.product')}
                                </h4>
                                <ul className="space-y-2.5">
                                    <li>
                                        <a
                                            href="#features"
                                            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                        >
                                            {t('nav.features')}
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#about"
                                            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                        >
                                            {t('nav.about')}
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            {/* Company links */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                                    {t('welcome.footer.company')}
                                </h4>
                                <ul className="space-y-2.5">
                                    <li>
                                        <a
                                            href="#"
                                            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                        >
                                            {t('welcome.footer.legal')}
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                        >
                                            {t('welcome.footer.privacy')}
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                        >
                                            {t('welcome.footer.terms')}
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-800">
                            <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                                {t('welcome.footer.copyright')}
                            </p>
                        </div>
                    </div>
                </footer>
            </motion.div>
        </GuestLayout>
    );
}
