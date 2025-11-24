"use client";

import React, { useState } from "react";
import { CreditCard as CardIcon, DollarSign, Calendar, Palette } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import { cn } from "@/lib/utils";

interface CreditCardFormProps {
    onClose?: () => void;
}

const COLORS = [
    { name: "purple", bg: "bg-purple-600", text: "text-purple-600" },
    { name: "blue", bg: "bg-blue-600", text: "text-blue-600" },
    { name: "green", bg: "bg-green-600", text: "text-green-600" },
    { name: "orange", bg: "bg-orange-600", text: "text-orange-600" },
    { name: "red", bg: "bg-red-600", text: "text-red-600" },
    { name: "black", bg: "bg-gray-900", text: "text-gray-900" },
];

export default function CreditCardForm({ onClose }: CreditCardFormProps) {
    const { addCard } = useFinance();

    const [name, setName] = useState("");
    const [limit, setLimit] = useState("");
    const [closingDay, setClosingDay] = useState("");
    const [dueDay, setDueDay] = useState("");
    const [color, setColor] = useState("purple");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !limit || !closingDay || !dueDay) {
            alert("Preencha todos os campos!");
            return;
        }

        addCard({
            id: crypto.randomUUID(),
            name,
            limit: Number(limit),
            closingDay: Number(closingDay),
            dueDay: Number(dueDay),
            color
        });

        if (onClose) onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-lg font-bold text-gray-800">Novo Cartão de Crédito</h3>

            {/* Name */}
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Nome do Cartão</label>
                <div className="relative">
                    <CardIcon className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 p-2 bg-gray-50 border border-gray-200 rounded-lg"
                        placeholder="Ex: Nubank"
                        required
                    />
                </div>
            </div>

            {/* Limit */}
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Limite Total</label>
                <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 text-sm font-bold">R$</span>
                    <input
                        type="number"
                        value={limit}
                        onChange={(e) => setLimit(e.target.value)}
                        className="w-full pl-10 p-2 bg-gray-50 border border-gray-200 rounded-lg font-semibold"
                        placeholder="0,00"
                        required
                    />
                </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Dia Fechamento</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            type="number"
                            min="1"
                            max="31"
                            value={closingDay}
                            onChange={(e) => setClosingDay(e.target.value)}
                            className="w-full pl-10 p-2 bg-gray-50 border border-gray-200 rounded-lg"
                            placeholder="Dia"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Dia Vencimento</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            type="number"
                            min="1"
                            max="31"
                            value={dueDay}
                            onChange={(e) => setDueDay(e.target.value)}
                            className="w-full pl-10 p-2 bg-gray-50 border border-gray-200 rounded-lg"
                            placeholder="Dia"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Color Picker */}
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Cor do Cartão</label>
                <div className="flex gap-2">
                    {COLORS.map((c) => (
                        <button
                            key={c.name}
                            type="button"
                            onClick={() => setColor(c.name)}
                            className={cn(
                                "w-8 h-8 rounded-full transition-transform hover:scale-110",
                                c.bg,
                                color === c.name ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : ""
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
