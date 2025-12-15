"use client";

import React from "react";
import { Plane, Car, Plus, Home, Star, Shield, Target } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";

import { useRouter } from "next/navigation";

import { useLanguage } from "@/contexts/LanguageContext";

export default function GoalsWidget() {
    const router = useRouter();
    const { t, locale } = useLanguage();
    const { goals } = useFinance();

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'plane': return <Plane size={24} />;
            case 'car': return <Car size={24} />;
            case 'home': return <Home size={24} />;
            case 'star': return <Star size={24} />;
            case 'shield': return <Shield size={24} />;
            case 'target': return <Target size={24} />;
            default: return <Target size={24} />;
        }
    };

    const getColorClasses = (color: string) => {
        switch (color) {
            case 'orange': return { bg: 'bg-orange-100', text: 'text-orange-600', bar: 'bg-orange-500' };
            case 'blue': return { bg: 'bg-blue-100', text: 'text-blue-600', bar: 'bg-blue-600' };
            case 'green': return { bg: 'bg-green-100', text: 'text-green-600', bar: 'bg-green-600' };
            case 'purple': return { bg: 'bg-purple-100', text: 'text-purple-600', bar: 'bg-purple-600' };
            case 'red': return { bg: 'bg-red-100', text: 'text-red-600', bar: 'bg-red-600' };
            default: return { bg: 'bg-gray-100', text: 'text-gray-600', bar: 'bg-gray-600' };
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">{t('my_goals')}</h3>
                <button
                    onClick={() => router.push('/planning')}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    title={t('manage_goals')}
                >
                    <Plus size={20} className="text-blue-600" />
                </button>
            </div>

            <div className="space-y-4">
                {goals.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p>{t('no_goals_yet') || "No goals yet"}</p>
                        <button
                            onClick={() => router.push('/planning')}
                            className="text-blue-600 font-medium mt-2 hover:underline"
                        >
                            {t('create_goal') || "Create one"}
                        </button>
                    </div>
                ) : (
                    goals.map(goal => {
                        const percentage = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                        const colors = getColorClasses(goal.color);

                        return (
                            <div key={goal.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className={`p-3 ${colors.bg} ${colors.text} rounded-xl`}>
                                    {getIcon(goal.icon)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-semibold text-gray-800">{goal.name}</h4>
                                        <span className={`text-sm font-bold ${colors.text}`}>{percentage}%</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-2">
                                        {new Intl.NumberFormat(locale.code === 'pt-BR' ? 'pt-BR' : 'en-US', { style: 'currency', currency: locale.code === 'pt-BR' ? 'BRL' : 'USD', maximumFractionDigits: 0 }).format(goal.currentAmount)}
                                        {' '}{t('of')}{' '}
                                        {new Intl.NumberFormat(locale.code === 'pt-BR' ? 'pt-BR' : 'en-US', { style: 'currency', currency: locale.code === 'pt-BR' ? 'BRL' : 'USD', maximumFractionDigits: 0 }).format(goal.targetAmount)}
                                    </p>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${colors.bar}`} style={{ width: `${percentage}%` }} />
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
