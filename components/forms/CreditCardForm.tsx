import React, { useState } from "react";
import { CreditCard as CardIcon, DollarSign, Calendar, Palette, User, Briefcase, X, Check } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/contexts/ToastContext";
import { CreditCard, ContextType } from "@/types";
import { BANKS } from "@/lib/banks";
import { cn } from "@/lib/utils";

interface CreditCardFormProps {
    onClose?: () => void;
    initialData?: CreditCard;
}

const COLORS = [
    { name: "purple", hex: "#9333ea", bg: "bg-purple-600" },
    { name: "blue", hex: "#2563eb", bg: "bg-blue-600" },
    { name: "green", hex: "#16a34a", bg: "bg-green-600" },
    { name: "orange", hex: "#ea580c", bg: "bg-orange-600" },
    { name: "red", hex: "#dc2626", bg: "bg-red-600" },
    { name: "pink", hex: "#db2777", bg: "bg-pink-600" },
    { name: "indigo", hex: "#4f46e5", bg: "bg-indigo-600" },
    { name: "teal", hex: "#0d9488", bg: "bg-teal-600" },
    { name: "cyan", hex: "#0891b2", bg: "bg-cyan-600" },
    { name: "yellow", hex: "#ca8a04", bg: "bg-yellow-600" },
    { name: "gray", hex: "#4b5563", bg: "bg-gray-600" },
];

export default function CreditCardForm({ onClose, initialData }: CreditCardFormProps) {
    const { addCard, updateCard } = useFinance();
    const { showToast } = useToast();

    const [context, setContext] = useState<ContextType>(initialData?.context || 'PF');
    const [selectedBankId, setSelectedBankId] = useState(initialData?.bankId || '');
    const [name, setName] = useState(initialData?.name || '');
    const [limit, setLimit] = useState(initialData?.limit?.toString() || '');
    const [closingDay, setClosingDay] = useState(initialData?.closingDay?.toString() || '');
    const [dueDay, setDueDay] = useState(initialData?.dueDay?.toString() || '');
    const [color, setColor] = useState(initialData?.color || COLORS[0].hex);

    const handleBankSelect = (bankId: string) => {
        setSelectedBankId(bankId);
        const bank = BANKS.find(b => b.id === bankId);
        if (bank) {
            setName(bank.name);
            if (bank.color) setColor(bank.color);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !limit || !closingDay || !dueDay) {
            showToast("error", "Preencha todos os campos obrigatórios");
            return;
        }

        const cardData = {
            name,
            bankId: selectedBankId,
            limit: Number(limit),
            closingDay: Number(closingDay),
            dueDay: Number(dueDay),
            color,
            context,
            invoice: initialData?.invoice || 0 // Preserve existing invoice amount
        };

        if (initialData) {
            updateCard({ ...cardData, id: initialData.id });
            showToast("success", "Cartão atualizado com sucesso!");
        } else {
            addCard({ ...cardData, id: crypto.randomUUID() });
            showToast("success", "Cartão criado com sucesso!");
        }
        onClose?.();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-foreground">
                    {initialData ? "Editar Cartão de Crédito" : "Novo Cartão de Crédito"}
                </h3>
            </div>

            {/* Context Selector */}
            <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">Tipo de Cartão</label>
                <div className="flex p-1 bg-muted rounded-xl">                    <button
                    type="button"
                    onClick={() => setContext('PF')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all",
                        context === 'PF'
                            ? "bg-card text-blue-600 shadow-sm"
                            : "text-muted-foreground hover:text-foreground")}
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
                                ? "bg-card text-orange-500 shadow-sm"
                                : "text-muted-foreground hover:text-foreground")}
                    >
                        <Briefcase size={18} />
                        Empresarial
                    </button>
                </div>
            </div>

            {/* Bank Selection (Dropdown) */}
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">Banco (Opcional)</label>                <div className="relative">
                    <div className="absolute left-3 top-2.5 z-10 pointer-events-none">
                        {selectedBankId ? (
                            (() => {
                                const bank = BANKS.find(b => b.id === selectedBankId);
                                return bank?.logoUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={bank.logoUrl} alt="" className="w-5 h-5 object-contain" />
                                ) : (
                                    <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[8px] font-bold text-foreground">                                        {bank?.name.substring(0, 2)}
                                    </div>
                                );
                            })()
                        ) : (
                            <Briefcase className="text-muted-foreground" size={18} />)}
                    </div>
                    <select
                        value={selectedBankId}
                        onChange={(e) => handleBankSelect(e.target.value)}
                        className="w-full pl-10 p-2 bg-background border border-border rounded-lg appearance-none text-foreground"                    >
                        <option value="">Selecione um banco...</option>
                        {BANKS.map((bank) => (
                            <option key={bank.id} value={bank.id}>
                                {bank.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Name */}
            <div>
                <label className="block text-sm font-medium text-foreground mb-1">Nome do Cartão</label>                <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground" placeholder="Ex: Nubank Gold"
                />
            </div>

            {/* Limit */}
            <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Limite Total</label>
                <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground text-sm font-bold pointer-events-none">R$</span>                    <input
                        type="number"
                        value={limit}
                        onChange={(e) => setLimit(e.target.value)}
                        className="w-full pl-10 p-2 bg-background border border-border rounded-lg font-semibold text-foreground"
                        placeholder="0,00"
                        required
                    />
                </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Dia Fechamento</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 text-muted-foreground pointer-events-none" size={18} />                        <input
                            type="number"
                            min="1"
                            max="31"
                            value={closingDay}
                            onChange={(e) => setClosingDay(e.target.value)}
                            className="w-full pl-10 p-2 bg-background border border-border rounded-lg text-foreground"
                            placeholder="Dia"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Dia Vencimento</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 text-muted-foreground pointer-events-none" size={18} />                        <input
                            type="number"
                            min="1"
                            max="31"
                            value={dueDay}
                            onChange={(e) => setDueDay(e.target.value)}
                            className="w-full pl-10 p-2 bg-background border border-border rounded-lg text-foreground"
                            placeholder="Dia"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Color Picker */}
            <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">Cor do Cartão</label>
                <div className="flex gap-2">
                    {COLORS.map((c) => (
                        <button
                            key={c.name}
                            type="button"
                            onClick={() => setColor(c.hex)}
                            className={cn(
                                "w-8 h-8 rounded-full transition-transform hover:scale-110",
                                c.bg,
                                color === c.hex || color === c.name ? "ring-2 ring-offset-2 ring-border scale-110" : "")}
                        />
                    ))}
                </div>
            </div>

            <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                Salvar Cartão
            </button>
        </form>
    );
}
