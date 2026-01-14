"use client";

import { User, Building2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { UsageMode } from "@/types";

interface ModeSelectionProps {
    selectedMode: UsageMode | null;
    onSelect: (mode: UsageMode) => void;
}

export default function ModeSelection({ selectedMode, onSelect }: ModeSelectionProps) {
    const modes = [
        {
            id: 'PF' as UsageMode,
            title: "Apenas Pessoa Física",
            description: "Gerencie suas finanças pessoais, cartões e objetivos.",
            icon: User,
            color: "bg-orange-500"
        },
        {
            id: 'PJ' as UsageMode,
            title: "Apenas Pessoa Jurídica",
            description: "Controle o fluxo de caixa, pró-labore e despesas da empresa.",
            icon: Building2,
            color: "bg-blue-600"
        },
        {
            id: 'BOTH' as UsageMode,
            title: "Pessoa Física e Jurídica",
            description: "Organize o Financeiro pessoal e o da sua empresa no mesmo lugar se misturar PF com PJ.",
            icon: Users,
            color: "bg-purple-600"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {modes.map((mode) => (
                <button
                    key={mode.id}
                    onClick={() => onSelect(mode.id)}
                    className={cn(
                        "relative flex flex-col items-center p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg text-center group",
                        selectedMode === mode.id
                            ? `border-${mode.color.replace('bg-', '')} bg-white ring-2 ring-${mode.color.replace('bg-', '')} ring-offset-2`
                            : "border-gray-100 bg-white hover:border-gray-200"
                    )}
                >
                    <div className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110",
                        selectedMode === mode.id ? mode.color : "bg-gray-100 text-gray-500",
                        selectedMode === mode.id && "text-white"
                    )}>
                        <mode.icon size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{mode.title}</h3>
                    <p className="text-sm text-gray-500">{mode.description}</p>

                    {selectedMode === mode.id && (
                        <div className={cn(
                            "absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm",
                            mode.color
                        )}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                    )}
                </button>
            ))}
        </div>
    );
}
