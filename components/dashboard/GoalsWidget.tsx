"use client";

import React from "react";
import { Plane, Car, Plus } from "lucide-react";

import { useRouter } from "next/navigation";

import { useLanguage } from "@/contexts/LanguageContext";

export default function GoalsWidget() {
    const router = useRouter();
    const { t } = useLanguage();

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
                {/* Goal 1 */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                        <Plane size={24} />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                            <h4 className="font-semibold text-gray-800">Viagem</h4>
                            <span className="text-sm font-bold text-orange-600">20%</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">R$ 1.200 {t('of')} R$ 6.000</p>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500 w-[20%]" />
                        </div>
                    </div>
                </div>

                {/* Goal 2 */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                        <Car size={24} />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                            <h4 className="font-semibold text-gray-800">Carro Novo</h4>
                            <span className="text-sm font-bold text-blue-600">14%</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">R$ 3.400 {t('of')} R$ 25.000</p>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 w-[14%]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
