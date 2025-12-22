import React, { useState } from "react";
import { Check, User, Briefcase, Star } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/contexts/ToastContext";
import { Account, ContextType } from "@/types";
import { BANKS } from "@/lib/banks";
import { cn } from "@/lib/utils";

interface AccountFormProps {
    onClose?: () => void;
    initialData?: Account;
}

export default function AccountForm({ onClose, initialData }: AccountFormProps) {
    const { addAccount, updateAccount } = useFinance();
    const { showToast } = useToast();

    const [name, setName] = useState(initialData?.name || "");
    const [initialBalance, setInitialBalance] = useState(initialData?.initialBalance.toString() || "");
    const [context, setContext] = useState<ContextType>(initialData?.context || "PF");
    const [selectedBankId, setSelectedBankId] = useState(initialData?.bankId || "");
    const [isFavorite, setIsFavorite] = useState(initialData?.isFavorite || false);

    const handleBankSelect = (bankId: string) => {
        const bank = BANKS.find(b => b.id === bankId);
        if (bank) {
            setSelectedBankId(bankId);
            if (!name) {
                setName(`${bank.name} Conta`);
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !initialBalance || !selectedBankId) {
            alert("Preencha todos os campos!");
            return;
        }

        const accountData: Account = {
            id: initialData ? initialData.id : crypto.randomUUID(),
            name,
            bankId: selectedBankId,
            initialBalance: Number(initialBalance),
            balance: initialData ? initialData.balance : Number(initialBalance), // If editing, keep current balance logic (simplified for now)
            isFavorite,
            context
        };

        if (initialData) {
            updateAccount(accountData);
            showToast('success', 'Conta atualizada com sucesso!');
        } else {
            addAccount(accountData);
            showToast('success', 'Conta criada com sucesso!');
        }

        if (onClose) onClose();
    };

    return (
<<<<<<< HEAD
        <form onSubmit={handleSubmit} className="bg-card p-6 rounded-2xl shadow-sm border border-border space-y-6">
            <h3 className="text-lg font-bold text-foreground">
=======
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-lg font-bold text-gray-800">
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                {initialData ? "Editar Conta Bancária" : "Nova Conta Bancária"}
            </h3>

            {/* Context Selector */}
            <div>
<<<<<<< HEAD
                <label className="block text-xs font-medium text-muted-foreground mb-2">Tipo de Conta</label>
                <div className="flex p-1 bg-muted rounded-xl">
=======
                <label className="block text-xs font-medium text-gray-500 mb-2">Tipo de Conta</label>
                <div className="flex p-1 bg-gray-100 rounded-xl">
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                    <button
                        type="button"
                        onClick={() => setContext('PF')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all",
                            context === 'PF'
<<<<<<< HEAD
                                ? "bg-card text-blue-600 shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
=======
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                        )}
                    >
                        <User size={18} />
                        Pessoal
                    </button>
                    <button
                        type="button"
                        onClick={() => setContext('PJ')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all",
                            context === 'PJ'
<<<<<<< HEAD
                                ? "bg-card text-blue-600 shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
=======
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                        )}
                    >
                        <Briefcase size={18} />
                        Empresarial
                    </button>
                </div>
            </div>

            {/* Bank Selection */}
            <div>
<<<<<<< HEAD
                <label className="block text-sm font-medium text-foreground mb-2">Banco</label>
=======
                <label className="block text-sm font-medium text-gray-700 mb-2">Banco</label>
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {BANKS.map((bank) => (
                        <button
                            key={bank.id}
                            type="button"
                            onClick={() => handleBankSelect(bank.id)}
                            className={`relative p-2 rounded-xl border transition-all flex flex-col items-center gap-1 ${selectedBankId === bank.id
<<<<<<< HEAD
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-500/20'
                                : 'border-border hover:border-foreground/20 hover:bg-muted'
                                } `}
                            title={bank.name}
                        >
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-card shadow-sm flex items-center justify-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={bank.logoUrl} alt={bank.name} className="w-6 h-6 object-contain" />
                            </div>
                            <span className="text-[10px] text-muted-foreground truncate w-full text-center">{bank.name}</span>
=======
                                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                } `}
                            title={bank.name}
                        >
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-white shadow-sm flex items-center justify-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={bank.logoUrl} alt={bank.name} className="w-6 h-6 object-contain" />
                            </div>
                            <span className="text-[10px] text-gray-600 truncate w-full text-center">{bank.name}</span>
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                            {selectedBankId === bank.id && (
                                <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-0.5">
                                    <Check size={10} />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Name */}
            <div>
<<<<<<< HEAD
                <label className="block text-sm font-medium text-foreground mb-1">Nome da Conta</label>
=======
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Conta</label>
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
<<<<<<< HEAD
                    className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground"
=======
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                    placeholder="Ex: Nubank Principal"
                />
            </div>

            {/* Initial Balance */}
            <div>
<<<<<<< HEAD
                <label className="block text-xs font-medium text-muted-foreground mb-1">Saldo Inicial</label>
                <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground text-sm font-bold">R$</span>
=======
                <label className="block text-xs font-medium text-gray-500 mb-1">Saldo Inicial</label>
                <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 text-sm font-bold">R$</span>
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                    <input
                        type="number"
                        value={initialBalance}
                        onChange={(e) => setInitialBalance(e.target.value)}
<<<<<<< HEAD
                        className="w-full pl-10 p-2 bg-background border border-border rounded-lg font-semibold text-foreground"
=======
                        className="w-full pl-10 p-2 bg-gray-50 border border-gray-200 rounded-lg font-semibold"
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                        placeholder="0,00"
                        required
                    />
                </div>
            </div>

            {/* Favorite Toggle */}
<<<<<<< HEAD
            <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-100 dark:border-yellow-900/30">
=======
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl border border-yellow-100">
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                <button
                    type="button"
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={cn(
                        "p-2 rounded-full transition-colors",
<<<<<<< HEAD
                        isFavorite ? "bg-yellow-400 text-white shadow-sm" : "bg-card text-muted-foreground border border-border"
=======
                        isFavorite ? "bg-yellow-400 text-white shadow-sm" : "bg-white text-gray-400 border border-gray-200"
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                    )}
                >
                    <Star size={20} fill={isFavorite ? "currentColor" : "none"} />
                </button>
                <div>
<<<<<<< HEAD
                    <p className="text-sm font-medium text-foreground">Conta Favorita</p>
                    <p className="text-xs text-muted-foreground">Sugerir esta conta em novos lançamentos</p>
=======
                    <p className="text-sm font-medium text-gray-800">Conta Favorita</p>
                    <p className="text-xs text-gray-500">Sugerir esta conta em novos lançamentos</p>
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                </div>
            </div>

            <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                Salvar Conta
            </button>
        </form>
    );
}
