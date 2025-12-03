"use client";

import { useState } from "react";
import { Target, TrendingUp, ShieldAlert, Calculator, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PlanningPage() {
    const [activeTab, setActiveTab] = useState<'debts' | 'investments' | 'goals'>('debts');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Planejamento Futuro</h1>
                <p className="text-gray-500">Ferramentas para alcançar sua liberdade financeira</p>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-gray-100 rounded-xl w-full md:w-fit">
                <button
                    onClick={() => setActiveTab('debts')}
                    className={cn(
                        "flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all",
                        activeTab === 'debts' ? "bg-white text-red-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    <ShieldAlert size={18} />
                    Gestão de Dívidas
                </button>
                <button
                    onClick={() => setActiveTab('investments')}
                    className={cn(
                        "flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all",
                        activeTab === 'investments' ? "bg-white text-green-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    <TrendingUp size={18} />
                    Investimentos
                </button>
                <button
                    onClick={() => setActiveTab('goals')}
                    className={cn(
                        "flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all",
                        activeTab === 'goals' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    <Target size={18} />
                    Metas de Vida
                </button>
            </div>

            {/* Content */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
                {activeTab === 'debts' && <DebtManager />}
                {activeTab === 'investments' && <InvestmentSimulator />}
                {activeTab === 'goals' && <GoalsPlanner />}
            </div>
        </div>
    );
}

// --- Subcomponents ---

function DebtManager() {
    const [debts, setDebts] = useState<{ id: string; name: string; amount: number; interest: number }[]>([]);
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [interest, setInterest] = useState("");

    const addDebt = () => {
        if (!name || !amount) return;
        setDebts([...debts, { id: crypto.randomUUID(), name, amount: Number(amount), interest: Number(interest) }]);
        setName("");
        setAmount("");
        setInterest("");
    };

    const removeDebt = (id: string) => {
        setDebts(debts.filter(d => d.id !== id));
    };

    const totalDebt = debts.reduce((acc, d) => acc + d.amount, 0);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Adicionar Dívida</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Nome (ex: Cartão X)"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="p-2 border border-gray-200 rounded-lg"
                        />
                        <input
                            type="number"
                            placeholder="Valor (R$)"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="p-2 border border-gray-200 rounded-lg"
                        />
                        <input
                            type="number"
                            placeholder="Juros Mensal (%)"
                            value={interest}
                            onChange={(e) => setInterest(e.target.value)}
                            className="p-2 border border-gray-200 rounded-lg"
                        />
                    </div>
                    <button
                        onClick={addDebt}
                        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        <Plus size={18} /> Adicionar
                    </button>
                </div>

                <div className="w-full md:w-64 bg-red-50 p-4 rounded-xl border border-red-100">
                    <p className="text-sm text-red-600 font-medium">Total em Dívidas</p>
                    <p className="text-2xl font-bold text-red-700">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalDebt)}
                    </p>
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="font-semibold text-gray-800">Sua Lista (Estratégia Bola de Neve)</h3>
                <p className="text-sm text-gray-500">Recomendamos pagar primeiro as dívidas com maiores juros ou menores valores.</p>

                {debts.length === 0 ? (
                    <p className="text-gray-400 italic py-4">Nenhuma dívida cadastrada. Parabéns!</p>
                ) : (
                    <div className="space-y-2">
                        {debts.sort((a, b) => a.amount - b.amount).map((debt, index) => (
                            <div key={debt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{debt.name}</p>
                                        <p className="text-xs text-gray-500">{debt.interest}% a.m.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-gray-700">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(debt.amount)}
                                    </span>
                                    <button onClick={() => removeDebt(debt.id)} className="text-gray-400 hover:text-red-500">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function InvestmentSimulator() {
    const [initial, setInitial] = useState("1000");
    const [monthly, setMonthly] = useState("500");
    const [rate, setRate] = useState("10"); // Annual
    const [years, setYears] = useState("10");

    const calculateResult = () => {
        const p = Number(initial);
        const pm = Number(monthly);
        const r = Number(rate) / 100 / 12; // Monthly rate
        const n = Number(years) * 12; // Months

        // FV = P * (1 + r)^n + PMT * (((1 + r)^n - 1) / r)
        const futureValue = p * Math.pow(1 + r, n) + pm * ((Math.pow(1 + r, n) - 1) / r);
        const totalInvested = p + (pm * n);
        const totalInterest = futureValue - totalInvested;

        return { futureValue, totalInvested, totalInterest };
    };

    const result = calculateResult();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Calculator size={20} className="text-green-600" />
                        Simulador de Juros Compostos
                    </h3>

                    <div className="space-y-3">
                        <div>
                            <label className="text-sm text-gray-600">Investimento Inicial</label>
                            <input type="number" value={initial} onChange={e => setInitial(e.target.value)} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Aporte Mensal</label>
                            <input type="number" value={monthly} onChange={e => setMonthly(e.target.value)} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Taxa de Juros (% ao ano)</label>
                            <input type="number" value={rate} onChange={e => setRate(e.target.value)} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Tempo (anos)</label>
                            <input type="number" value={years} onChange={e => setYears(e.target.value)} className="w-full p-2 border rounded-lg" />
                        </div>
                    </div>
                </div>

                <div className="bg-green-50 p-6 rounded-2xl border border-green-100 flex flex-col justify-center space-y-6">
                    <div>
                        <p className="text-sm text-green-700 font-medium mb-1">Total Acumulado</p>
                        <p className="text-4xl font-bold text-green-800">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.futureValue)}
                        </p>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-green-200">
                        <div className="flex justify-between text-sm">
                            <span className="text-green-700">Total Investido</span>
                            <span className="font-bold text-green-800">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.totalInvested)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-green-700">Rendimento (Juros)</span>
                            <span className="font-bold text-green-600">+{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.totalInterest)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function GoalsPlanner() {
    return (
        <div className="text-center py-12 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="text-blue-600" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Metas de Vida</h3>
            <p className="text-gray-500 max-w-md mx-auto">
                Em breve você poderá criar metas visuais para comprar sua casa, carro ou fazer aquela viagem dos sonhos.
            </p>
        </div>
    );
}
