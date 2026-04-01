// resources/js/Pages/Challenges/Create.jsx
import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { pageTransition } from '@/config/animations';
import AppLayout from '@/Components/AppLayout';
import Card from '@/Components/Card';
import Input from '@/Components/Input';
import Button from '@/Components/Button';

export default function CreateChallenge() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        duration: '',
        start_date: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('challenges.store'), {
            onSuccess: () => toast.success(t('success.challengeCreated')),
        });
    };

    const cancel = () => {
        router.visit(route('dashboard'));
    };

    return (
        <AppLayout breadcrumbs={[{ label: 'Home', href: route('home') }, { label: 'Dashboard', href: route('dashboard') }, { label: 'Creer challenge' }]}>
            <Head title={t('challenge.create.title')} />

            <motion.div
                initial={pageTransition.initial}
                animate={pageTransition.animate}
                transition={pageTransition.transition}
                className="py-8 lg:py-12"
            >
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {t('challenge.create.title')}
                        </h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {t('challenge.create.subtitle')}
                        </p>
                    </div>

                    <Card>
                        <div className="space-y-6">
                            <Input
                                id="title"
                                type="text"
                                label={t('challenge.create.name')}
                                placeholder={t('challenge.create.namePlaceholder')}
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                error={errors.title}
                            />

                            <Input
                                id="description"
                                type="textarea"
                                label={t('challenge.create.description')}
                                placeholder={t('challenge.create.descriptionPlaceholder')}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                error={errors.description}
                            />

                            <div className="grid sm:grid-cols-2 gap-6">
                                <Input
                                    id="duration"
                                    type="number"
                                    label={t('challenge.create.duration')}
                                    value={data.duration}
                                    onChange={(e) => setData('duration', e.target.value)}
                                    error={errors.duration}
                                    min="1"
                                    max="365"
                                />

                                <Input
                                    id="start_date"
                                    type="date"
                                    label={t('challenge.create.startDate')}
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                    error={errors.start_date}
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
                                <Button variant="outline" size="md" onClick={cancel}>
                                    {t('challenge.create.cancel')}
                                </Button>
                                <Button
                                    variant="primary"
                                    size="md"
                                    loading={processing}
                                    disabled={processing}
                                    onClick={submit}
                                >
                                    {t('challenge.create.submit')}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </motion.div>
        </AppLayout>
    );
}
