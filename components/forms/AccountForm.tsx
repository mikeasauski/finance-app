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
        <form onSubmit={handleSubmit} className="bg-card p-6 rounded-2xl shadow-sm border border-border space-y-6">
            <h3 className="text-lg font-bold text-foreground">                {initialData ? "Editar Conta Bancária" : "Nova Conta Bancária"}
            </h3>

            {/* Context Selector */}
            <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">Tipo de Conta</label>
                <div className="flex p-1 bg-muted rounded-xl">                    <button
                        type="button"
                        onClick={() => setContext('PF')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all",
                            context === 'PF'
                                ? "bg-card text-blue-600 shadow-sm"
                                : "text-muted-foreground hover:text-foreground"                        )}
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
                                ? "bg-card text-blue-600 shadow-sm"
                                : "text-muted-foreground hover:text-foreground"                        )}
                    >
                        <Briefcase size={18} />
                        Empresarial
                    </button>
                </div>
            </div>

            {/* Bank Selection */}
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">Banco</label>                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {BANKS.map((bank) => (
                        <button
                            key={bank.id}
                            type="button"
                            onClick={() => handleBankSelect(bank.id)}
                            className={`relative p-2 rounded-xl border transition-all flex flex-col items-center gap-1 ${selectedBankId === bank.id
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-500/20'
                                : 'border-border hover:border-foreground/20 hover:bg-muted'
                                } `}
                            title={bank.name}
                        >
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-card shadow-sm flex items-center justify-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={bank.logoUrl} alt={bank.name} className="w-6 h-6 object-contain" />
                            </div>
                            <span className="text-[10px] text-muted-foreground truncate w-full text-center">{bank.name}</span>                            {selectedBankId === bank.id && (
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
                <label className="block text-sm font-medium text-foreground mb-1">Nome da Conta</label>                <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground"                    placeholder="Ex: Nubank Principal"
                />
            </div>

            {/* Initial Balance */}
            <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Saldo Inicial</label>
                <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground text-sm font-bold">R$</span>                    <input
                        type="number"
                        value={initialBalance}
                        onChange={(e) => setInitialBalance(e.target.value)}
                        className="w-full pl-10 p-2 bg-background border border-border rounded-lg font-semibold text-foreground"                        placeholder="0,00"
                        required
                    />
                </div>
            </div>

            {/* Favorite Toggle */}
            <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-100 dark:border-yellow-900/30">                <button
                    type="button"
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={cn(
                        "p-2 rounded-full transition-colors",
                        isFavorite ? "bg-yellow-400 text-white shadow-sm" : "bg-card text-muted-foreground border border-border"                    )}
                >
                    <Star size={20} fill={isFavorite ? "currentColor" : "none"} />
                </button>
                <div>
                    <p className="text-sm font-medium text-foreground">Conta Favorita</p>
                    <p className="text-xs text-muted-foreground">Sugerir esta conta em novos lançamentos</p>                </div>
            </div>

            <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                Salvar Conta
            </button>
        </form>
    );
}
