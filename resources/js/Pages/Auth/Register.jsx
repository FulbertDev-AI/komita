// resources/js/Pages/Auth/Register.jsx
import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { pageTransition } from '@/config/animations';
import GuestLayout from '@/Components/GuestLayout';
import Input from '@/Components/Input';
import Button from '@/Components/Button';
import {
    AcademicCapIcon,
    BookOpenIcon,
} from '@heroicons/react/24/outline';

const roles = [
    { value: 'student', icon: AcademicCapIcon, labelKey: 'auth.register.student', descKey: 'auth.register.student.desc' },
    { value: 'professor', icon: BookOpenIcon, labelKey: 'auth.register.professor', descKey: 'auth.register.professor.desc' },
];

export default function Register() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title={t('auth.register.title')} />

            <motion.div
                initial={pageTransition.initial}
                animate={pageTransition.animate}
                transition={pageTransition.transition}
                className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12"
            >
                {/* Background gradient shapes */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 -right-20 w-72 h-72 bg-gradient-radial from-indigo-500/10 to-transparent rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-gradient-radial from-violet-500/10 to-transparent rounded-full blur-3xl" />
                </div>

                <div className="relative w-full max-w-md">
                    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-sm p-8 lg:p-10">
                        <div className="text-center mb-8">
                            <Link href="/">
                                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                    Komita
                                </span>
                            </Link>
                            <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                {t('auth.register.title')}
                            </h1>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                {t('auth.register.subtitle')}
                            </p>
                        </div>

                        <div className="space-y-5">
                            <Input
                                id="name"
                                type="text"
                                label={t('auth.register.name')}
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                error={errors.name}
                                autoComplete="name"
                            />

                            <Input
                                id="email"
                                type="email"
                                label={t('auth.register.email')}
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                error={errors.email}
                                autoComplete="username"
                            />

                            <Input
                                id="password"
                                type="password"
                                label={t('auth.register.password')}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                error={errors.password}
                                autoComplete="new-password"
                            />

                            <Input
                                id="password_confirmation"
                                type="password"
                                label={t('auth.register.confirmPassword')}
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                error={errors.password_confirmation}
                                autoComplete="new-password"
                            />

                            {/* Role selector */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('auth.register.role')}
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {roles.map((role) => (
                                        <button
                                            key={role.value}
                                            type="button"
                                            onClick={() => setData('role', role.value)}
                                            className={`
                                                flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer text-center
                                                ${data.role === role.value
                                                    ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-950/50'
                                                    : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900'
                                                }
                                            `}
                                        >
                                            <role.icon
                                                className={`h-6 w-6 ${
                                                    data.role === role.value
                                                        ? 'text-indigo-600 dark:text-indigo-400'
                                                        : 'text-gray-400 dark:text-gray-500'
                                                }`}
                                            />
                                            <span
                                                className={`text-xs font-medium ${
                                                    data.role === role.value
                                                        ? 'text-indigo-600 dark:text-indigo-400'
                                                        : 'text-gray-600 dark:text-gray-400'
                                                }`}
                                            >
                                                {t(role.labelKey)}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                                {errors.role && (
                                    <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                                        {errors.role}
                                    </p>
                                )}
                            </div>

                            <Button
                                variant="primary"
                                size="md"
                                loading={processing}
                                disabled={processing}
                                onClick={submit}
                                className="w-full"
                            >
                                {t('auth.register.submit')}
                            </Button>
                        </div>

                        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                            {t('auth.register.hasAccount')}{' '}
                            <Link
                                href={route('login')}
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-medium transition-colors"
                            >
                                {t('auth.register.login')}
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </GuestLayout>
    );
}
