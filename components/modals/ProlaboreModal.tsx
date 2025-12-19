"use client";

import { useState } from "react";
import { X, Wallet, ArrowRight } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";

interface ProlaboreModalProps {
    onClose: () => void;
}

export default function ProlaboreModal({ onClose }: ProlaboreModalProps) {
    const [amount, setAmount] = useState("");
    const { accounts, addTransaction } = useFinance();
    const [error, setError] = useState("");

    // Filter accounts by context
    const pjAccounts = accounts.filter(a => a.context === 'PJ');
    const pfAccounts = accounts.filter(a => a.context === 'PF');

    const [sourceAccountId, setSourceAccountId] = useState(pjAccounts[0]?.id || "");
    const [destinationAccountId, setDestinationAccountId] = useState(pfAccounts[0]?.id || "");

    const handleConfirm = () => {
        const value = parseFloat(amount.replace(',', '.'));
        if (isNaN(value) || value <= 0) {
            setError("Por favor, insira um valor válido.");
            return;
        }

        const sourceAccount = accounts.find(a => a.id === sourceAccountId);
        const destinationAccount = accounts.find(a => a.id === destinationAccountId);

        if (!sourceAccount || !destinationAccount) {
            setError("Selecione as contas de origem e destino.");
            return;
        }

        if (sourceAccount.balance < value) {
            setError(`Saldo insuficiente na conta ${sourceAccount.name}. Saldo atual: R$ ${sourceAccount.balance.toFixed(2)}`);
            return;
        }

        // 1. Create Expense in PJ (Transfer Out)
        const expenseTransaction = {
            id: crypto.randomUUID(),
            description: "Pagamento de Pró-labore",
            amount: value,
            type: 'expense' as const,
            subType: 'daily' as const,
            category: 'Salário/Pró-labore',
            date: new Date().toISOString(),
            paymentMethod: 'transfer' as const,
            status: 'paid' as const,
            isPaid: true,
            context: 'PJ' as const,
            accountId: sourceAccountId
        };

        // 2. Create Income in PF (Transfer In)
        const incomeTransaction = {
            id: crypto.randomUUID(),
            description: "Recebimento de Pró-labore",
            amount: value,
            type: 'income' as const,
            subType: 'daily' as const,
            category: 'Salário',
            date: new Date().toISOString(),
            paymentMethod: 'transfer' as const,
            status: 'paid' as const,
            isPaid: true,
            context: 'PF' as const,
            accountId: destinationAccountId
        };

        try {
            addTransaction(expenseTransaction);
            addTransaction(incomeTransaction);
            alert(`Pró-labore de R$ ${value.toFixed(2)} realizado com sucesso!`);
            onClose();
        } catch (e: any) {
            setError(e.message);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-green-600 p-6 text-white flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Wallet size={24} />
                            Lançar Pró-labore
                        </h2>
                        <p className="text-green-100 text-sm mt-1">
                            Transferência entre contas (PJ para PF)
                        </p>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Valor do Pró-labore</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">R$</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => {
                                    setAmount(e.target.value);
                                    setError("");
                                }}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-semibold text-gray-900"
                                placeholder="0,00"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">De (Conta Empresarial)</label>
                            <select
                                value={sourceAccountId}
                                onChange={(e) => setSourceAccountId(e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                            >
                                {pjAccounts.map(acc => (
                                    <option key={acc.id} value={acc.id}>
                                        {acc.name} (Saldo: R$ {acc.balance.toFixed(2)})
                                    </option>
                                ))}
                                {pjAccounts.length === 0 && <option value="">Nenhuma conta PJ encontrada</option>}
                            </select>
                        </div>

                        <div className="flex justify-center">
                            <ArrowRight className="text-gray-400" size={20} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Para (Conta Pessoal)</label>
                            <select
                                value={destinationAccountId}
                                onChange={(e) => setDestinationAccountId(e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                            >
                                {pfAccounts.map(acc => (
                                    <option key={acc.id} value={acc.id}>
                                        {acc.name} (Saldo: R$ {acc.balance.toFixed(2)})
                                    </option>
                                ))}
                                {pfAccounts.length === 0 && <option value="">Nenhuma conta PF encontrada</option>}
                            </select>
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

                    <button
                        onClick={handleConfirm}
                        className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20 flex items-center justify-center gap-2"
                    >
                        Confirmar Transferência
                    </button>
                </div>
            </div>
        </div>
    );
}
