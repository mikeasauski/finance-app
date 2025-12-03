"use client";

import React, { useState, useEffect } from "react";
import {
    ArrowDownLeft,
    ArrowUpRight,
    DollarSign,
    FileText,
    Tag,
    Smartphone,
    Banknote,
    ArrowRightLeft,
    Calendar,
    CreditCard,
    Landmark,
    X,
    HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/contexts/ToastContext";
import { Transaction, TransactionType, TransactionSubType, PaymentMethod, ContextType } from "@/types";
import { BRANDS, Brand } from "@/lib/brands";
import { CATEGORIES, PAYMENT_METHODS } from "@/lib/constants";

interface TransactionFormProps {
    onClose?: () => void;
    initialData?: Transaction;
    defaultType?: TransactionType;
    lockType?: boolean;
}

export default function TransactionForm({ onClose, initialData, defaultType, lockType = false }: TransactionFormProps) {
    const { addTransaction, updateTransaction, cards = [], accounts = [] } = useFinance();
    const { showToast } = useToast();

    const [type, setType] = useState<TransactionType>(initialData?.type || defaultType || "expense");
    const [amount, setAmount] = useState(initialData?.amount?.toString() || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [category, setCategory] = useState(initialData?.category || "");
    const [date, setDate] = useState(initialData?.date || "");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initialData?.paymentMethod || "debit");
    const [installments, setInstallments] = useState(initialData?.installments?.total?.toString() || "1");
    const [selectedCardId, setSelectedCardId] = useState(initialData?.cardId || "");
    const [selectedAccountId, setSelectedAccountId] = useState(initialData?.accountId || "");
    const [selectedBrandId, setSelectedBrandId] = useState(initialData?.brandId || "");

    // New States
    const [isSubscription, setIsSubscription] = useState(!!initialData?.recurrence);
    const [subscriptionDay, setSubscriptionDay] = useState(initialData?.recurrence?.day?.toString() || "15");
    const [isPaid, setIsPaid] = useState(initialData?.isPaid ?? true);

    const [recurrenceType, setRecurrenceType] = useState<'fixed' | 'subscription'>(
        initialData?.subType === 'subscription' ? 'subscription' : 'fixed'
    );

    // Set default date on mount to avoid hydration mismatch
    useEffect(() => {
        if (!date && !initialData?.date) {
            setDate(new Date().toISOString().split('T')[0]);
        }
    }, []);

    // ... (keep existing effects)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || !description || !category) {
            alert("Preencha todos os campos obrigatórios!");
            return;
        }

        const transactionData: Transaction = {
            id: initialData ? initialData.id : crypto.randomUUID(),
            type,
            subType: isSubscription ? recurrenceType : (Number(installments) > 1 ? 'installment' : 'daily'),
            context: 'PF', // Default to PF for now
            amount: Number(amount),
            description,
            category,
            date,
            paymentMethod,
            status: isPaid ? 'paid' : 'pending',
            cardId: paymentMethod === 'credit' ? selectedCardId : undefined,
            accountId: paymentMethod !== 'credit' && paymentMethod !== 'cash' ? selectedAccountId : undefined,
            isPaid: isPaid,
            installments: paymentMethod === 'credit' && Number(installments) > 1 ? {
                current: 1,
                total: Number(installments)
            } : undefined,
            brandId: selectedBrandId,
            recurrence: isSubscription ? {
                frequency: 'monthly',
                day: Number(subscriptionDay),
                infinite: true
            } : undefined
        };

        if (initialData) {
            updateTransaction(transactionData);
            showToast('success', 'Transação atualizada com sucesso!');
        } else {
            addTransaction(transactionData);
            showToast('success', 'Transação criada com sucesso!');
        }

        if (onClose) onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6 relative">
            {/* Close Button */}
            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <X size={20} />
                </button>
            )}

            <h3 className="text-lg font-bold text-gray-800 pr-8">
                {initialData ? "Editar Transação" : (defaultType === 'income' ? "Nova Renda" : "Nova Transação")}
            </h3>

            {/* Status Selection (Paid vs Pending) */}
            <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
                <button
                    type="button"
                    onClick={() => setIsPaid(true)}
                    className={cn(
                        "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                        isPaid
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    {type === 'income' ? 'Recebido' : 'Pago'}
                </button>
                <button
                    type="button"
                    onClick={() => setIsPaid(false)}
                    className={cn(
                        "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                        !isPaid
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    {type === 'income' ? 'A Receber' : 'Pendente'}
                </button>
            </div>

            {/* Type Selection - Only show if not locked */}
            {!lockType && (
                <div className="flex p-1 bg-gray-100 rounded-xl">
                    <button
                        type="button"
                        onClick={() => setType("expense")}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all",
                            type === "expense"
                                ? "bg-white text-red-600 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        <ArrowDownLeft size={18} />
                        Despesa
                    </button>
                    <button
                        type="button"
                        onClick={() => setType("income")}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all",
                            type === "income"
                                ? "bg-white text-green-600 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        <ArrowUpRight size={18} />
                        Receita
                    </button>
                </div>
            )}

            {/* Recurrence Options */}
            <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Recorrência</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="subscription"
                            checked={isSubscription}
                            onChange={(e) => {
                                setIsSubscription(e.target.checked);
                                // Default to 'fixed' (Cobrança Recorrente) when enabling
                                if (e.target.checked && !initialData?.subType) {
                                    // We'll handle subtype selection in the radio buttons below
                                }
                            }}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="subscription" className="text-sm text-gray-600 cursor-pointer">
                            Habilitar
                        </label>
                    </div>
                </div>

                {isSubscription && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 pt-2 border-t border-gray-200">
                        {/* Option 1: Fixed (Cobrança Recorrente) */}
                        <div className="flex items-start gap-3">
                            <input
                                type="radio"
                                id="type-fixed"
                                name="recurrenceType"
                                checked={recurrenceType === 'fixed'}
                                onChange={() => setRecurrenceType('fixed')}
                                className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <label htmlFor="type-fixed" className="text-sm font-medium text-gray-900 cursor-pointer">
                                        Cobrança Recorrente
                                    </label>
                                    <div className="group relative">
                                        <HelpCircle size={14} className="text-gray-400 cursor-help" />
                                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                            Esta opção é para utilizar em recorrências de Aluguel, Conta de água, Conta de luz, Conta de internet, Conta de Gás...
                                            <div className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-gray-800 rotate-45"></div>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500">Consome o limite total do cartão (de cartão de crédito).</p>
                            </div>
                        </div>

                        {/* Option 2: Subscription (Assinatura Recorrente) */}
                        <div className="flex items-start gap-3">
                            <input
                                type="radio"
                                id="type-subscription"
                                name="recurrenceType"
                                checked={recurrenceType === 'subscription'}
                                onChange={() => setRecurrenceType('subscription')}
                                className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <label htmlFor="type-subscription" className="text-sm font-medium text-gray-900 cursor-pointer">
                                        Assinatura Recorrente
                                    </label>
                                    <div className="group relative">
                                        <HelpCircle size={14} className="text-gray-400 cursor-help" />
                                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                            Esta opção é para assinaturas digitais com cobranças mensais creditadas mensalmente do cartão de crédito.
                                            <div className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-gray-800 rotate-45"></div>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500">Não consome o limite futuro, apenas o mês atual.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Subscription Day */}
            {isSubscription && (
                <div className="animate-in fade-in slide-in-from-top-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Dia do Vencimento</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            type="number"
                            min="1"
                            max="31"
                            value={subscriptionDay}
                            onChange={(e) => setSubscriptionDay(e.target.value)}
                            className="w-full pl-10 p-2 bg-gray-50 border border-gray-200 rounded-lg"
                            placeholder="Dia (ex: 15)"
                            required={isSubscription}
                        />
                    </div>
                </div>
            )}

            {/* Amount */}
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Valor</label>
                <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400 text-sm font-bold">R$</span>
                    <input
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full pl-10 p-2 bg-gray-50 border border-gray-200 rounded-lg font-semibold text-lg"
                        placeholder="0,00"
                        required
                    />
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Descrição</label>
                <div className="relative">
                    <FileText className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full pl-10 p-2 bg-gray-50 border border-gray-200 rounded-lg"
                        placeholder="Ex: Netflix, Aluguel..."
                        required
                    />
                </div>
            </div>

            {/* Category */}
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Categoria</label>
                <div className="relative">
                    <Tag className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full pl-10 p-2 bg-gray-50 border border-gray-200 rounded-lg appearance-none"
                        required
                    >
                        <option value="">Selecione...</option>
                        {CATEGORIES?.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Brand Selection (Dropdown) */}
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Marca / Empresa (Opcional)</label>
                <div className="relative">
                    <div className="absolute left-3 top-2.5 z-10 pointer-events-none">
                        {selectedBrandId ? (
                            (() => {
                                const brand = BRANDS?.find(b => b.id === selectedBrandId);
                                return brand?.logoUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={brand.logoUrl} alt="" className="w-5 h-5 object-contain" />
                                ) : (
                                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[8px] font-bold">
                                        {brand?.name.substring(0, 2)}
                                    </div>
                                );
                            })()
                        ) : (
                            <Tag className="text-gray-400" size={18} />
                        )}
                    </div>
                    <select
                        value={selectedBrandId}
                        onChange={(e) => setSelectedBrandId(e.target.value)}
                        className="w-full pl-10 p-2 bg-white border border-gray-200 rounded-lg appearance-none"
                    >
                        <option value="">Selecione uma marca...</option>
                        {BRANDS?.filter(b => b.type !== 'bank').map((brand) => (
                            <option key={brand.id} value={brand.id}>
                                {brand.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Date (Only if not subscription, or initial date) */}
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Data</label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full pl-10 p-2 bg-gray-50 border border-gray-200 rounded-lg"
                        required
                    />
                </div>
            </div>

            {/* Payment Method */}
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Método de Pagamento</label>
                <div className="grid grid-cols-3 gap-2">
                    {PAYMENT_METHODS?.map((method) => {
                        const Icon = method.icon;
                        return (
                            <button
                                key={method.id}
                                type="button"
                                onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-1 p-2 rounded-lg border transition-all",
                                    paymentMethod === method.id
                                        ? "border-blue-500 bg-blue-50 text-blue-700"
                                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                )}
                            >
                                <Icon size={16} />
                                <span className="text-[10px] font-medium">{method.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Paid Status Toggle */}
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <input
                    type="checkbox"
                    id="isPaid"
                    checked={isPaid}
                    onChange={(e) => setIsPaid(e.target.checked)}
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500 border-gray-300"
                />
                <label htmlFor="isPaid" className="text-sm font-medium text-gray-700 select-none cursor-pointer flex-1">
                    {isPaid ? "Pago / Recebido" : "Pendente / A Pagar"}
                </label>
            </div>

            {/* Account Selection (for non-credit, non-cash) */}
            {paymentMethod !== 'credit' && paymentMethod !== 'cash' && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Conta Bancária {isPaid ? "" : "(Opcional)"}</label>
                    <div className="relative">
                        <Landmark className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <select
                            value={selectedAccountId}
                            onChange={(e) => setSelectedAccountId(e.target.value)}
                            className="w-full pl-10 p-2 bg-white border border-gray-200 rounded-lg appearance-none"
                            required={isPaid}
                        >
                            <option value="">Selecione a conta...</option>
                            {accounts?.map(acc => (
                                <option key={acc.id} value={acc.id}>{acc.name} (R$ {acc.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Credit Card Options */}
            {paymentMethod === 'credit' && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-100 animate-in fade-in slide-in-from-top-2">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Cartão</label>
                        <select
                            value={selectedCardId}
                            onChange={(e) => setSelectedCardId(e.target.value)}
                            className="w-full p-2 bg-white border border-gray-200 rounded-lg"
                        >
                            {cards?.map(card => (
                                <option key={card.id} value={card.id}>{card.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Quantidade de Parcelas</label>
                        <input
                            type="number"
                            min="1"
                            max="99"
                            value={installments}
                            onChange={(e) => setInstallments(e.target.value)}
                            className="w-full p-2 bg-white border border-gray-200 rounded-lg"
                            placeholder="1"
                        />
                    </div>
                </div>
            )}

            <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                {initialData ? "Salvar Alterações" : "Salvar Transação"}
            </button>
        </form>
    );
}
