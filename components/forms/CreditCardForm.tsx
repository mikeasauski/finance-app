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
<<<<<<< HEAD
    { name: "pink", hex: "#db2777", bg: "bg-pink-600" },
    { name: "indigo", hex: "#4f46e5", bg: "bg-indigo-600" },
    { name: "teal", hex: "#0d9488", bg: "bg-teal-600" },
    { name: "cyan", hex: "#0891b2", bg: "bg-cyan-600" },
    { name: "yellow", hex: "#ca8a04", bg: "bg-yellow-600" },
    { name: "gray", hex: "#4b5563", bg: "bg-gray-600" },
=======
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
    { name: "black", hex: "#111827", bg: "bg-gray-900" },
];

export default function CreditCardForm({ onClose, initialData }: CreditCardFormProps) {
    const { addCard, updateCard } = useFinance();
    const { showToast } = useToast();

    const [name, setName] = useState(initialData?.name || "");
    const [limit, setLimit] = useState(initialData?.limit.toString() || "");
    const [closingDay, setClosingDay] = useState(initialData?.closingDay || "");
    const [dueDay, setDueDay] = useState(initialData?.dueDay || "");
    const [color, setColor] = useState(initialData?.color || "#000000");
    const [context, setContext] = useState<ContextType>(initialData?.context || "PF");
    const [selectedBankId, setSelectedBankId] = useState(initialData?.bankId || "");

    const handleBankSelect = (bankId: string) => {
        const bank = BANKS.find(b => b.id === bankId);
        if (bank) {
            setSelectedBankId(bankId);
            setColor(bank.color);
            if (!name) {
                setName(bank.name);
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !limit || !closingDay || !dueDay) {
            alert("Preencha todos os campos!");
            return;
        }

        const cardData: CreditCard = {
            id: initialData ? initialData.id : crypto.randomUUID(),
            name,
            limit: Number(limit),
            closingDay: Number(closingDay),
            dueDay: Number(dueDay),
            color,
            context,
            bankId: selectedBankId
        };

        if (initialData) {
            updateCard(cardData);
            showToast('success', 'Cartão atualizado com sucesso!');
        } else {
            addCard(cardData);
            showToast('success', 'Cartão criado com sucesso!');
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
                {initialData ? "Editar Cartão de Crédito" : "Novo Cartão de Crédito"}
            </h3>

            {/* Context Selector */}
            <div>
<<<<<<< HEAD
                <label className="block text-xs font-medium text-muted-foreground mb-2">Tipo de Cartão</label>
                <div className="flex p-1 bg-muted rounded-xl">
=======
                <label className="block text-xs font-medium text-gray-500 mb-2">Tipo de Cartão</label>
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

            {/* Bank Selection (Dropdown) */}
            <div>
<<<<<<< HEAD
                <label className="block text-sm font-medium text-foreground mb-2">Banco (Opcional)</label>
=======
                <label className="block text-sm font-medium text-gray-700 mb-2">Banco (Opcional)</label>
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                <div className="relative">
                    <div className="absolute left-3 top-2.5 z-10 pointer-events-none">
                        {selectedBankId ? (
                            (() => {
                                const bank = BANKS.find(b => b.id === selectedBankId);
                                return bank?.logoUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={bank.logoUrl} alt="" className="w-5 h-5 object-contain" />
                                ) : (
<<<<<<< HEAD
                                    <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[8px] font-bold text-foreground">
=======
                                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[8px] font-bold">
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                        {bank?.name.substring(0, 2)}
                                    </div>
                                );
                            })()
                        ) : (
<<<<<<< HEAD
                            <Briefcase className="text-muted-foreground" size={18} />
=======
                            <Briefcase className="text-gray-400" size={18} />
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                        )}
                    </div>
                    <select
                        value={selectedBankId}
                        onChange={(e) => handleBankSelect(e.target.value)}
<<<<<<< HEAD
                        className="w-full pl-10 p-2 bg-background border border-border rounded-lg appearance-none text-foreground"
=======
                        className="w-full pl-10 p-2 bg-white border border-gray-200 rounded-lg appearance-none"
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                    >
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
<<<<<<< HEAD
                <label className="block text-sm font-medium text-foreground mb-1">Nome do Cartão</label>
=======
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Cartão</label>
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
                    placeholder="Ex: Nubank Gold"
                />
            </div>

            {/* Limit */}
            <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Limite Total</label>
                <div className="relative">
<<<<<<< HEAD
                    <span className="absolute left-3 top-2.5 text-muted-foreground text-sm font-bold pointer-events-none">R$</span>
=======
                    <span className="absolute left-3 top-2.5 text-gray-400 text-sm font-bold pointer-events-none">R$</span>
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                    <input
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
<<<<<<< HEAD
                        <Calendar className="absolute left-3 top-2.5 text-muted-foreground pointer-events-none" size={18} />
=======
                        <Calendar className="absolute left-3 top-2.5 text-gray-400 pointer-events-none" size={18} />
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                        <input
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
<<<<<<< HEAD
                        <Calendar className="absolute left-3 top-2.5 text-muted-foreground pointer-events-none" size={18} />
=======
                        <Calendar className="absolute left-3 top-2.5 text-gray-400 pointer-events-none" size={18} />
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                        <input
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
<<<<<<< HEAD
                                color === c.hex || color === c.name ? "ring-2 ring-offset-2 ring-border scale-110" : ""
=======
                                color === c.hex || color === c.name ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : ""
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                            )}
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
