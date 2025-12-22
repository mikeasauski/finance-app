"use client";

import { useState } from "react";
import { Trash2, Download, Globe, Palette, Shield, AlertTriangle } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SettingsPage() {
    const { showToast } = useToast();
    const { theme, setTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState("");
    const [deleteType, setDeleteType] = useState<'all' | 'transactions' | 'cards' | null>(null);

    const handleExportData = () => {
        const data = {
            transactions: JSON.parse(localStorage.getItem('finance_transactions') || '[]'),
            cards: JSON.parse(localStorage.getItem('finance_cards') || '[]'),
            accounts: JSON.parse(localStorage.getItem('finance_accounts') || '[]'),
            documents: JSON.parse(localStorage.getItem('finance_documents') || '[]'),
            user: JSON.parse(localStorage.getItem('finance_user_profile') || '{}'),
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `finance_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast('success', t('backup_success'));
    };

    const handleDelete = () => {
        if (deleteConfirmation !== "DELETAR") {
            showToast('error', t('wrong_confirmation'));
            return;
        }

        if (deleteType === 'all') {
            localStorage.clear();
        } else if (deleteType === 'transactions') {
            localStorage.removeItem('finance_transactions');
        } else if (deleteType === 'cards') {
            localStorage.removeItem('finance_cards');
        }

        showToast('success', t('data_deleted'));
        setTimeout(() => window.location.reload(), 1500);
    };

    const openDeleteModal = (type: 'all' | 'transactions' | 'cards') => {
        setDeleteType(type);
        setDeleteConfirmation("");
        setDeleteModalOpen(true);
    };

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">{t('settings_title')}</h1>
                <p className="text-gray-500 dark:text-slate-400">{t('settings_subtitle')}</p>
            </div>

            {/* Appearance & Language */}
            <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 space-y-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-200 flex items-center gap-2">
                    <Palette size={20} className="text-purple-600 dark:text-purple-400" />
                    {t('appearance_language')}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Theme Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('theme')}</label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => setTheme('light')}
                                className={`p-3 rounded-xl border text-sm font-medium transition-all ${theme === 'light'
                                    ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20'
                                    : 'border-border hover:bg-muted text-muted-foreground'
                                    }`}
                            >
                                {t('light')}
                            </button>
                            <button
                                onClick={() => setTheme('dark')}
                                className={`p-3 rounded-xl border text-sm font-medium transition-all ${theme === 'dark'
                                    ? 'border-slate-500 bg-slate-800 text-white ring-2 ring-slate-500/20'
                                    : 'border-border hover:bg-muted text-muted-foreground'
                                    }`}
                            >
                                {t('dark')}
                            </button>
                            <button
                                onClick={() => setTheme('entrepreneur')}
                                className={`p-3 rounded-xl border text-sm font-medium transition-all ${theme === 'entrepreneur'
                                    ? 'border-pink-500 bg-pink-50 text-pink-700 ring-2 ring-pink-500/20'
                                    : 'border-border hover:bg-muted text-muted-foreground'
                                    }`}
                            >
                                {t('entrepreneur')}
                            </button>
                        </div>
                    </div>

                    {/* Language Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">{t('language')}</label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-3 text-gray-400" size={18} />
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as any)}
                                className="w-full pl-10 p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl appearance-none dark:text-slate-200"
                            >
                                <option value="pt">Português (Brasil)</option>
                                <option value="en">English (US)</option>
                                <option value="es">Español</option>
                                <option value="it">Italiano</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Data Management */}
            <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 space-y-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-200 flex items-center gap-2">
                    <Shield size={20} className="text-blue-600 dark:text-blue-400" />
                    {t('data_management')}
                </h2>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
                    <div>
                        <h3 className="font-medium text-gray-900 dark:text-slate-200">{t('export_backup')}</h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400">{t('export_backup_desc')}</p>
                    </div>
                    <button
                        onClick={handleExportData}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors font-medium shadow-sm"
                    >
                        <Download size={18} />
                        {t('export')}
                    </button>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-800">
                    <h3 className="font-medium text-red-600 flex items-center gap-2">
                        <AlertTriangle size={18} />
                        {t('danger_zone')}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={() => openDeleteModal('transactions')}
                            className="p-4 text-left border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                        >
                            <span className="block font-medium text-red-900 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300">{t('delete_transactions')}</span>
                            <span className="text-xs text-red-600/70 dark:text-red-400/70">{t('delete_transactions_desc')}</span>
                        </button>

                        <button
                            onClick={() => openDeleteModal('cards')}
                            className="p-4 text-left border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                        >
                            <span className="block font-medium text-red-900 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300">{t('delete_cards')}</span>
                            <span className="text-xs text-red-600/70 dark:text-red-400/70">{t('delete_cards_desc')}</span>
                        </button>

                        <button
                            onClick={() => openDeleteModal('all')}
                            className="col-span-1 md:col-span-2 p-4 text-left border border-red-200 dark:border-red-900/50 bg-red-100/50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors group"
                        >
                            <div className="flex items-center gap-2 text-red-900 dark:text-red-400 font-bold">
                                <Trash2 size={18} />
                                {t('delete_all')}
                            </div>
                            <span className="text-xs text-red-700 dark:text-red-400/80">{t('delete_all_desc')}</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-6 animate-in zoom-in-95">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">{t('delete_confirmation_title')}</h3>
                            <p className="text-gray-500 mt-2">
                                {t('delete_confirmation_desc')}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                {t('type_delete_instruction')}
                            </label>
                            <input
                                type="text"
                                value={deleteConfirmation}
                                onChange={(e) => setDeleteConfirmation(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 outline-none uppercase"
                                placeholder="DELETAR"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleteConfirmation !== "DELETAR"}
                                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {t('erase')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
