"use client";

import React, { useState, useEffect } from "react";
import {
    ArrowDownLeft,
    ArrowUpRight,
    DollarSign,
    FileText,
    Tag,
    Calendar,
    CreditCard,
    Smartphone,
    Banknote,
    ArrowRightLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFinance } from "@/contexts/FinanceContext";
import { Transaction, PaymentMethod, TransactionType } from "@/types";

interface TransactionFormProps {
    onClose?: () => void;
    initialData?: Transaction;
}

const CATEGORIES = [
    "Alimentação",
    "Transporte",
    "Moradia",
    "Lazer",
    "Saúde",
    "Educação",
    "Compras",
    "Outros"
];

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: any }[] = [
    { id: "credit", label: "Crédito", icon: CreditCard },
    { id: "debit", label: "Débito", icon: CreditCard },
    { id: "pix", label: "Pix", icon: Smartphone },
    { id: "cash", label: "Dinheiro", icon: Banknote },
    { id: "transfer", label: "Transferência", icon: ArrowRightLeft },
];

export default function TransactionForm({ onClose, initialData }: TransactionFormProps) {
    const { addTransaction, updateTransaction, cards } = useFinance();

    const [type, setType] = useState<TransactionType>(initialData?.type || "expense");
    const [amount, setAmount] = useState(initialData?.amount.toString() || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [category, setCategory] = useState(initialData?.category || "");
    const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initialData?.paymentMethod || "debit");
    const [installments, setInstallments] = useState(initialData?.installments?.total.toString() || "1");
    const [selectedCardId, setSelectedCardId] = useState(initialData?.cardId || "");

    // Set initial card if available and not editing
    useEffect(() => {
        if (!initialData && cards.length > 0 && !selectedCardId) {
            setSelectedCardId(cards[0].id);
        }
    }, [cards, selectedCardId, initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || !description || !category) {
            alert("Preencha todos os campos obrigatórios!");
            return;
        }

        const transactionData: Transaction = {
            id: initialData ? initialData.id : crypto.randomUUID(),
            type,
            subType: 'daily', // Default to daily for now
            context: 'PF', // Default to PF for now
            amount: Number(amount),
            description,
            category,
            date,
            paymentMethod,
            cardId: paymentMethod === 'credit' ? selectedCardId : undefined,
            installments: paymentMethod === 'credit' && installments ? {
                current: 1,
                total: Number(installments)
            } : undefined
        };

        if (initialData) {
            updateTransaction(transactionData);
        } else {
            addTransaction(transactionData);
        }

        if (onClose) onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-lg font-bold text-gray-800">
                {initialData ? "Editar Transação" : "Nova Transação"}
            </h3>

            {/* Type Selection */}
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
                        placeholder="Ex: Supermercado"
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
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Date */}
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
                    {PAYMENT_METHODS.map((method) => {
                        const Icon = method.icon;
                        return (
                            <button
                                key={method.id}
                                type="button"
                                onClick={() => setPaymentMethod(method.id)}
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
                            {cards.map(card => (
                                <option key={card.id} value={card.id}>{card.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Parcelas</label>
                        <select
                            value={installments}
                            onChange={(e) => setInstallments(e.target.value)}
                            className="w-full p-2 bg-white border border-gray-200 rounded-lg"
                        >
                            <option value="1">À vista</option>
                            {[...Array(11)].map((_, i) => (
                                <option key={i + 2} value={i + 2}>{i + 2}x</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                {initialData ? "Salvar Alterações" : "Salvar Transação"}
            </button>
        </form>
    );
}
