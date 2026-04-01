// resources/js/Pages/Profile/Edit.jsx
import { useRef, useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { pageTransition, listContainer, listItem } from '@/config/animations';
import AppLayout from '@/Components/AppLayout';
import Card from '@/Components/Card';
import Input from '@/Components/Input';
import Button from '@/Components/Button';
import Modal from '@/Components/Modal';
import { CameraIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

function ProfileInfoSection({ user }) {
    const { t } = useTranslation();
    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        name: user.name,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email,
        specialty: user.specialty || '',
        contact_phone: user.contact_phone || '',
        social_linkedin: user.social_linkedin || '',
        social_github: user.social_github || '',
        social_instagram: user.social_instagram || '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'), {
            onSuccess: () => toast.success(t('success.profileUpdated')),
        });
    };

    return (
        <Card>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('profile.info.title')}
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 mb-6">
                {t('profile.info.subtitle')}
            </p>

            <div className="space-y-5">
                {/* Avatar */}
                <div className="flex items-center gap-5">
                    <div className="relative group">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">
                                {user.name?.charAt(0)?.toUpperCase()}
                            </span>
                        </div>
                        <button className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <CameraIcon className="h-6 w-6 text-white" />
                        </button>
                    </div>
                    <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-medium transition-colors">
                        {t('profile.avatar.change')}
                    </button>
                </div>

                <Input
                    id="name"
                    type="text"
                    label={t('profile.info.name')}
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    error={errors.name}
                    autoComplete="name"
                />

                <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                        id="first_name"
                        type="text"
                        label="Prenom"
                        value={data.first_name}
                        onChange={(e) => setData('first_name', e.target.value)}
                        error={errors.first_name}
                    />
                    <Input
                        id="last_name"
                        type="text"
                        label="Nom"
                        value={data.last_name}
                        onChange={(e) => setData('last_name', e.target.value)}
                        error={errors.last_name}
                    />
                </div>

                <Input
                    id="email"
                    type="email"
                    label={t('profile.info.email')}
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={errors.email}
                    autoComplete="username"
                />

                <Input
                    id="specialty"
                    type="text"
                    label="Specialite"
                    value={data.specialty}
                    onChange={(e) => setData('specialty', e.target.value)}
                    error={errors.specialty}
                />

                <Input
                    id="contact_phone"
                    type="text"
                    label="Contact telephone"
                    value={data.contact_phone}
                    onChange={(e) => setData('contact_phone', e.target.value)}
                    error={errors.contact_phone}
                />

                <Input
                    id="social_linkedin"
                    type="url"
                    label="LinkedIn"
                    value={data.social_linkedin}
                    onChange={(e) => setData('social_linkedin', e.target.value)}
                    error={errors.social_linkedin}
                    placeholder="https://linkedin.com/in/..."
                />

                <Input
                    id="social_github"
                    type="url"
                    label="GitHub"
                    value={data.social_github}
                    onChange={(e) => setData('social_github', e.target.value)}
                    error={errors.social_github}
                    placeholder="https://github.com/..."
                />

                <Input
                    id="social_instagram"
                    type="url"
                    label="Instagram"
                    value={data.social_instagram}
                    onChange={(e) => setData('social_instagram', e.target.value)}
                    error={errors.social_instagram}
                    placeholder="https://instagram.com/..."
                />

                <div className="flex items-center gap-3 pt-2">
                    <Button
                        variant="primary"
                        size="md"
                        loading={processing}
                        disabled={processing}
                        onClick={submit}
                    >
                        {t('profile.info.save')}
                    </Button>
                    {recentlySuccessful && (
                        <span className="text-sm text-green-600 dark:text-green-400">
                            {t('profile.info.saved')}
                        </span>
                    )}
                </div>
            </div>
        </Card>
    );
}

function PasswordSection() {
    const { t } = useTranslation();
    const { data, setData, put, processing, errors, reset, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            onSuccess: () => {
                reset();
                toast.success(t('success.passwordUpdated'));
            },
        });
    };

    return (
        <Card>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('profile.password.title')}
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 mb-6">
                {t('profile.password.subtitle')}
            </p>

            <div className="space-y-5">
                <Input
                    id="current_password"
                    type="password"
                    label={t('profile.password.current')}
                    value={data.current_password}
                    onChange={(e) => setData('current_password', e.target.value)}
                    error={errors.current_password}
                    autoComplete="current-password"
                />

                <Input
                    id="password"
                    type="password"
                    label={t('profile.password.new')}
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    error={errors.password}
                    autoComplete="new-password"
                />

                <Input
                    id="password_confirmation"
                    type="password"
                    label={t('profile.password.confirm')}
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    error={errors.password_confirmation}
                    autoComplete="new-password"
                />

                <div className="flex items-center gap-3 pt-2">
                    <Button
                        variant="primary"
                        size="md"
                        loading={processing}
                        disabled={processing}
                        onClick={submit}
                    >
                        {t('profile.password.save')}
                    </Button>
                    {recentlySuccessful && (
                        <span className="text-sm text-green-600 dark:text-green-400">
                            {t('profile.password.saved')}
                        </span>
                    )}
                </div>
            </div>
        </Card>
    );
}

function DeleteAccountSection() {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const { data, setData, delete: destroy, processing, errors, reset } = useForm({
        password: '',
    });

    const confirmDelete = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            onSuccess: () => setShowModal(false),
            onFinish: () => reset(),
        });
    };

    return (
        <>
            <Card>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('profile.delete.title')}
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 mb-6">
                    {t('profile.delete.subtitle')}
                </p>
                <Button
                    variant="outline"
                    size="md"
                    onClick={() => setShowModal(true)}
                    className="border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    {t('profile.delete.button')}
                </Button>
            </Card>

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={t('profile.delete.title')}
            >
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
                    {t('profile.delete.subtitle')}
                </p>

                <Input
                    id="delete_password"
                    type="password"
                    label={t('profile.password.current')}
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    error={errors.password}
                    autoComplete="current-password"
                />

                <div className="flex items-center justify-end gap-3 mt-6">
                    <Button variant="outline" size="md" onClick={() => setShowModal(false)}>
                        {t('common.cancel')}
                    </Button>
                    <Button
                        variant="primary"
                        size="md"
                        loading={processing}
                        disabled={processing}
                        onClick={confirmDelete}
                        className="bg-red-600 hover:bg-red-500"
                    >
                        {t('profile.delete.button')}
                    </Button>
                </div>
            </Modal>
        </>
    );
}

export default function EditProfile() {
    const { t } = useTranslation();
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <AppLayout>
            <Head title={t('profile.title')} />

            <motion.div
                initial={pageTransition.initial}
                animate={pageTransition.animate}
                transition={pageTransition.transition}
                className="py-8 lg:py-12"
            >
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {t('profile.title')}
                        </h1>
                    </div>

                    <motion.div
                        variants={listContainer}
                        initial="hidden"
                        animate="show"
                        className="space-y-6"
                    >
                        <motion.div variants={listItem}>
                            <ProfileInfoSection user={user} />
                        </motion.div>
                        <motion.div variants={listItem}>
                            <PasswordSection />
                        </motion.div>
                        <motion.div variants={listItem}>
                            <DeleteAccountSection />
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </AppLayout>
    );
}
