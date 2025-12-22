"use client";

import React, { useState } from 'react';
import { Users, Calculator } from 'lucide-react';
import CalculatorLayout from '@/components/tools/CalculatorLayout';
import { TAX_TABLES_2025 } from '@/lib/tax_tables_2025';

export default function CustoFuncionarioPage() {
    const [salary, setSalary] = useState('');
    const [transport, setTransport] = useState('');
    const [meal, setMeal] = useState('');
    const [regime, setRegime] = useState<'SIMPLES' | 'NORMAL'>('SIMPLES');
    const [result, setResult] = useState<{ total: number; provisions: number; taxes: number } | null>(null);

    const handleCalculate = () => {
        const salaryValue = parseFloat(salary.replace(',', '.')) || 0;
        const transportValue = parseFloat(transport.replace(',', '.')) || 0;
        const mealValue = parseFloat(meal.replace(',', '.')) || 0;

        if (!salaryValue) return;

        // Provisions
        const vacationProvision = (salaryValue / 12) * 1.3333; // Férias + 1/3
        const thirteenthProvision = salaryValue / 12; // 13º Salário
        const fgts = salaryValue * 0.08; // FGTS

        let taxes = fgts; // Start with FGTS

        // INSS Patronal (only for Lucro Presumido/Real)
        if (regime === 'NORMAL') {
            const inssPatronal = salaryValue * 0.20; // 20% INSS Patronal
            // Other system S taxes could be added here, but keeping it simple
            taxes += inssPatronal;
        }

        const provisions = vacationProvision + thirteenthProvision;
        const benefits = transportValue + mealValue;

        const total = salaryValue + taxes + provisions + benefits;

        setResult({
            total,
            provisions,
            taxes
        });
    };

    return (
        <CalculatorLayout
            title="Custo de Funcionário"
            icon={Users}
            description="Calcule quanto um funcionário realmente custa para sua empresa, incluindo impostos e provisões."
            examples={[
                {
                    title: "Simples Nacional",
                    scenario: "Salário R$ 2.000,00",
                    result: "Custo Total: ~R$ 2.800,00 (+40%)",
                    isPositive: true
                },
                {
                    title: "Lucro Presumido",
                    scenario: "Salário R$ 2.000,00",
                    result: "Custo Total: ~R$ 3.400,00 (+70%)",
                    isPositive: false
                }
            ]}
            faq={[
                {
                    question: "O que são provisões?",
                    answer: "São valores que você deve guardar mensalmente para pagar Férias e 13º Salário no futuro."
                },
                {
                    question: "Simples Nacional paga INSS Patronal?",
                    answer: "Geralmente não (Anexos I, II, III e V). Apenas o Anexo IV paga INSS Patronal de 20%."
                }
            ]}
        >
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Salário Bruto</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-muted-foreground font-bold">R$</span>
                        <input
                            type="number"
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                            placeholder="2000.00"
                            className="w-full pl-10 p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Vale Transporte (Mensal)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-muted-foreground font-bold">R$</span>
                            <input
                                type="number"
                                value={transport}
                                onChange={(e) => setTransport(e.target.value)}
                                placeholder="0.00"
                                className="w-full pl-10 p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Vale Refeição (Mensal)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-muted-foreground font-bold">R$</span>
                            <input
                                type="number"
                                value={meal}
                                onChange={(e) => setMeal(e.target.value)}
                                placeholder="0.00"
                                className="w-full pl-10 p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Regime Tributário</label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setRegime('SIMPLES')}
                            className={`p-3 rounded-xl border transition-all text-sm font-medium ${regime === 'SIMPLES'
                                    ? "bg-primary/10 border-primary text-primary"
                                    : "bg-background border-border hover:border-primary/50"
                                }`}
                        >
                            Simples Nacional
                        </button>
                        <button
                            onClick={() => setRegime('NORMAL')}
                            className={`p-3 rounded-xl border transition-all text-sm font-medium ${regime === 'NORMAL'
                                    ? "bg-primary/10 border-primary text-primary"
                                    : "bg-background border-border hover:border-primary/50"
                                }`}
                        >
                            Lucro Presumido / Real
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleCalculate}
                    className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity text-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                    <Calculator size={20} />
                    Calcular Custo
                </button>

                {result && (
                    <div className="bg-muted/50 rounded-xl p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                                <span>Salário + Benefícios:</span>
                                <span className="font-mono">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(salary || '0') + parseFloat(transport || '0') + parseFloat(meal || '0'))}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                                <span>Impostos (FGTS {regime === 'NORMAL' ? '+ INSS' : ''}):</span>
                                <span className="font-mono text-red-500">
                                    + {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.taxes)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                                <span>Provisões (Férias + 13º):</span>
                                <span className="font-mono text-orange-500">
                                    + {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.provisions)}
                                </span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border flex justify-between items-end">
                            <span className="font-bold text-foreground">Custo Total Mensal:</span>
                            <span className="text-3xl font-bold text-primary">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.total)}
                            </span>
                        </div>
                        <p className="text-xs text-center text-muted-foreground mt-2">
                            * Estimativa baseada em alíquotas padrão de 2025.
                        </p>
                    </div>
                )}
            </div>
        </CalculatorLayout>
    );
}
