import React, { useState } from "react";
<<<<<<< HEAD
import { CreditCard as CardIcon, MoreVertical, Edit2, Trash2, FileText, Sparkles, Calendar } from "lucide-react";
import { CreditCard } from "@/types";
import { getBankById } from "@/lib/banks";
import { useLanguage } from "@/contexts/LanguageContext";
=======
import { CreditCard as CardIcon, MoreVertical, Edit2, Trash2, FileText, Sparkles } from "lucide-react";
import { CreditCard } from "@/types";
import { getBankById } from "@/lib/banks";
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc

interface CreditCardWidgetProps {
    card: CreditCard;
    currentInvoice: number;
    onEdit?: () => void;
    onDelete?: () => void;
    onViewInvoice?: () => void;
}

export default function CreditCardWidget({ card, currentInvoice, onEdit, onDelete, onViewInvoice }: CreditCardWidgetProps) {
<<<<<<< HEAD
    const { t } = useLanguage();
    const [showMenu, setShowMenu] = useState(false);
    const [imgError, setImgError] = useState(false);
=======
    const [showMenu, setShowMenu] = useState(false);
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
    const availableLimit = card.limit - currentInvoice;
    const progress = (currentInvoice / card.limit) * 100;

    const bank = card.bankId ? getBankById(card.bankId) : null;
    const textColor = bank?.textColor === 'black' ? 'text-gray-900' : 'text-white';
    const subTextColor = bank?.textColor === 'black' ? 'text-gray-600' : 'text-gray-300';

    // Best Buy Logic
    const today = new Date();
    const currentDay = today.getDate();
    // Best buy day is usually the day after closing
    let bestBuyDay = card.closingDay + 1;
    // Handle month overflow (e.g. closing day 31)
    if (bestBuyDay > 31) bestBuyDay = 1;

    // Check if today is the best buy day (or within a small window, e.g., 2 days after closing)
<<<<<<< HEAD
=======
    // For simplicity, let's say it's the best buy period if we are between closingDay + 1 and closingDay + 3
    // But strictly "Best Day" is closingDay + 1.
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
    const isBestBuyDay = currentDay === bestBuyDay;

    return (
        <div
<<<<<<< HEAD
            className={`p-5 rounded-2xl shadow-xl relative overflow-hidden transition-all hover:scale-[1.02] ${textColor} ${!card.color.startsWith('#') ? (
                card.color === 'purple' ? 'bg-gradient-to-br from-purple-600 to-purple-800' :
                    card.color === 'orange' ? 'bg-gradient-to-br from-orange-500 to-orange-700' :
                        card.color === 'green' ? 'bg-gradient-to-br from-green-600 to-green-800' :
                            card.color === 'red' ? 'bg-gradient-to-br from-red-600 to-red-800' :
                                card.color === 'pink' ? 'bg-gradient-to-br from-pink-600 to-pink-800' :
                                    card.color === 'indigo' ? 'bg-gradient-to-br from-indigo-600 to-indigo-800' :
                                        card.color === 'teal' ? 'bg-gradient-to-br from-teal-600 to-teal-800' :
                                            card.color === 'cyan' ? 'bg-gradient-to-br from-cyan-600 to-cyan-800' :
                                                card.color === 'yellow' ? 'bg-gradient-to-br from-yellow-500 to-yellow-700' :
                                                    card.color === 'gray' ? 'bg-gradient-to-br from-gray-600 to-gray-800' :
                                                        card.color === 'black' ? 'bg-gradient-to-br from-gray-900 to-gray-800' :
                                                            'bg-gradient-to-br from-blue-600 to-blue-800'
            ) : ''
                }`}
            style={{
                background: card.color.startsWith('#') ? card.color : undefined
            }}
        >

            {/* Best Buy Badge */}
            {isBestBuyDay && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-[9px] font-bold px-2 py-0.5 rounded-b-md shadow-sm flex items-center gap-1 z-10 animate-in slide-in-from-top-2">
                    <Sparkles size={8} />
                    {t('best_buy_day_badge')}
                </div>
            )}

            <div className="flex justify-between items-start mb-4">
                <div className="p-1.5 bg-white rounded-lg shadow-sm">
                    {bank && !imgError ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={bank.logoUrl}
                            alt={bank.name}
                            className="w-5 h-5 object-contain"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <CardIcon size={20} className="text-current" />
=======
            className={`p-6 rounded-2xl shadow-xl relative overflow-hidden transition-all hover:scale-[1.02] ${textColor}`}
            style={{
                background: card.color.startsWith('#') ? card.color : undefined,
                backgroundImage: !card.color.startsWith('#') ? `linear-gradient(to bottom right, var(--tw-gradient-stops))` : undefined
            }}
        >
            {/* Fallback gradient class if no hex color */}
            {!card.color.startsWith('#') && (
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color === 'purple' ? 'from-purple-600 to-purple-800' :
                    card.color === 'orange' ? 'from-orange-500 to-orange-700' :
                        card.color === 'green' ? 'from-green-600 to-green-800' :
                            card.color === 'red' ? 'from-red-600 to-red-800' :
                                card.color === 'black' ? 'from-gray-900 to-gray-800' :
                                    'from-blue-600 to-blue-800'
                    } -z-10`} />
            )}

            {/* Best Buy Badge */}
            {isBestBuyDay && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-3 py-1 rounded-b-lg shadow-sm flex items-center gap-1 z-10 animate-in slide-in-from-top-2">
                    <Sparkles size={10} />
                    MELHOR DIA DE COMPRA
                </div>
            )}

            <div className="flex justify-between items-start mb-8">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    {bank ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={bank.logoUrl} alt={bank.name} className="w-6 h-6 object-contain" />
                    ) : (
                        <CardIcon size={24} className="text-current" />
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                    )}
                </div>
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                    >
<<<<<<< HEAD
                        <MoreVertical size={16} />
=======
                        <MoreVertical size={20} />
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                    </button>

                    {showMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowMenu(false)}
                            />
<<<<<<< HEAD
                            <div className="absolute right-0 top-6 z-20 bg-white rounded-lg shadow-lg py-1 w-32 overflow-hidden">
=======
                            <div className="absolute right-0 top-8 z-20 bg-white rounded-lg shadow-lg py-1 w-32 overflow-hidden">
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                <button
                                    onClick={() => {
                                        onViewInvoice?.();
                                        setShowMenu(false);
                                    }}
<<<<<<< HEAD
                                    className="w-full px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <FileText size={12} />
                                    {t('view_invoice')}
=======
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <FileText size={14} />
                                    Ver Fatura
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                </button>
                                <button
                                    onClick={() => {
                                        onEdit?.();
                                        setShowMenu(false);
                                    }}
<<<<<<< HEAD
                                    className="w-full px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <Edit2 size={12} />
                                    {t('edit')}
=======
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <Edit2 size={14} />
                                    Editar
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                </button>
                                <button
                                    onClick={() => {
                                        onDelete?.();
                                        setShowMenu(false);
                                    }}
<<<<<<< HEAD
                                    className="w-full px-3 py-1.5 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                    <Trash2 size={12} />
                                    {t('delete')}
=======
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                    <Trash2 size={14} />
                                    Excluir
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

<<<<<<< HEAD
            <div className="mb-4">
                <h4 className={`text-xs mb-0.5 ${subTextColor}`}>{card.name}</h4>
                <p className="text-lg font-bold tracking-wider">**** **** **** 1234</p>
            </div>

            <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                    <span className={subTextColor}>{t('current_invoice')}</span>
                    <span className="font-semibold text-sm">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currentInvoice)}
                    </span>
=======
            <div className="mb-6">
                <h4 className={`text-sm mb-1 ${subTextColor}`}>{card.name}</h4>
                <p className="text-2xl font-bold tracking-wider">**** **** **** 1234</p>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className={subTextColor}>Fatura Atual</span>
                    <span className="font-semibold">R$ {currentInvoice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                </div>

                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                </div>

<<<<<<< HEAD
                <div className={`flex justify-between text-[10px] mt-0.5 ${subTextColor}`}>
                    <span>{t('available')}: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(availableLimit)}</span>
                    <span>{t('limit')}: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(card.limit)}</span>
                </div>
            </div>

            <div className={`mt-4 pt-3 border-t border-white/10 flex justify-between text-xs ${subTextColor}`}>
                <div>
                    <p className="text-[10px] opacity-80">{t('closes_day')}</p>
                    <p className="font-medium">Dia {card.closingDay}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] opacity-80">{t('due_day')}</p>
=======
                <div className={`flex justify-between text-xs mt-1 ${subTextColor}`}>
                    <span>Disponível: R$ {availableLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    <span>Limite: R$ {card.limit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
            </div>

            <div className={`mt-6 pt-4 border-t border-white/10 flex justify-between text-sm ${subTextColor}`}>
                <div>
                    <p className="text-xs opacity-80">Fechamento</p>
                    <p className="font-medium">Dia {card.closingDay}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs opacity-80">Vencimento</p>
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                    <p className="font-medium">Dia {card.dueDay}</p>
                </div>
            </div>
        </div>
    );
}
