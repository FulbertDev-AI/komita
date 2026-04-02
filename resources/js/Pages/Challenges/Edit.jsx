import { Head, router, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { pageTransition } from '@/config/animations';
import AppLayout from '@/Components/AppLayout';
import Card from '@/Components/Card';
import Input from '@/Components/Input';
import Button from '@/Components/Button';

export default function EditChallenge() {
    const { challenge = {} } = usePage().props;

    const { data, setData, patch, processing, errors } = useForm({
        title: challenge.title || '',
        description: challenge.description || '',
        duration: challenge.duration || '',
        start_date: challenge.start_date || '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('challenges.update', challenge.id), {
            onSuccess: () => toast.success('Challenge mis a jour.'),
        });
    };

    return (
        <AppLayout breadcrumbs={[{ label: 'Home', href: route('home') }, { label: 'Challenge', href: route('challenges.show', challenge.id) }, { label: 'Modifier' }]}>
            <Head title="Modifier challenge" />

            <motion.div
                initial={pageTransition.initial}
                animate={pageTransition.animate}
                transition={pageTransition.transition}
                className="py-8 lg:py-12"
            >
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Modifier challenge</h1>
                    </div>

                    <Card>
                        <form onSubmit={submit} className="space-y-6">
                            <Input
                                id="title"
                                type="text"
                                label="Titre"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                error={errors.title}
                            />

                            <Input
                                id="description"
                                type="textarea"
                                label="Description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                error={errors.description}
                            />

                            <div className="grid sm:grid-cols-2 gap-6">
                                <Input
                                    id="duration"
                                    type="number"
                                    label="Duree (jours)"
                                    value={data.duration}
                                    onChange={(e) => setData('duration', e.target.value)}
                                    error={errors.duration}
                                    min="1"
                                    max="365"
                                />

                                <Input
                                    id="start_date"
                                    type="date"
                                    label="Date de debut"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                    error={errors.start_date}
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
                                <Button variant="outline" size="md" onClick={() => router.visit(route('challenges.show', challenge.id))}>
                                    Annuler
                                </Button>
                                <Button type="submit" variant="primary" size="md" loading={processing} disabled={processing}>
                                    Enregistrer
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </motion.div>
        </AppLayout>
    );
}
