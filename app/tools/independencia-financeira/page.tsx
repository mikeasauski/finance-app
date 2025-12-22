"use client";

import React, { useState } from 'react';
import { Target, Calculator } from 'lucide-react';
import CalculatorLayout from '@/components/tools/CalculatorLayout';

export default function IndependenciaFinanceiraPage() {
    const [monthlyCost, setMonthlyCost] = useState('');
    const [currentSavings, setCurrentSavings] = useState('');
    const [monthlyContribution, setMonthlyContribution] = useState('');
    const [rate, setRate] = useState(''); // Yearly real return
    const [result, setResult] = useState<{ targetAmount: number; months: number; years: number } | null>(null);

    const handleCalculate = () => {
        const cost = parseFloat(monthlyCost.replace(',', '.')) || 0;
        const savings = parseFloat(currentSavings.replace(',', '.')) || 0;
        const contribution = parseFloat(monthlyContribution.replace(',', '.')) || 0;
        const yearlyRate = parseFloat(rate.replace(',', '.')) || 0;

        if (!cost || !contribution) return;

        // Rule of 300 (4% Safe Withdrawal Rate)
        // Target = Monthly Cost * 300 (equivalent to Cost * 12 / 0.04)
        const targetAmount = cost * 300;

        // Calculate time
        // r = monthly real rate
        const r = (Math.pow(1 + yearlyRate / 100, 1 / 12) - 1);

        // n = ln( (FV*r + PMT) / (PV*r + PMT) ) / ln(1+r)
        // FV = targetAmount
        // PV = savings
        // PMT = contribution

        let n = 0;
        if (r === 0) {
            // Simple division if rate is 0 (unlikely but possible input)
            const remaining = targetAmount - savings;
            n = remaining / contribution;
        } else {
            const numerator = (targetAmount * r) + contribution;
            const denominator = (savings * r) + contribution;

            if (denominator === 0) {
                // Should not happen if contribution > 0
                n = 0;
            } else {
                n = Math.log(numerator / denominator) / Math.log(1 + r);
            }
        }

        setResult({
            targetAmount,
            months: Math.ceil(n),
            years: Math.ceil(n / 12)
        });
    };

    return (
        <CalculatorLayout
            title="Independência Financeira (FIRE)"
            icon={Target}
            description="Descubra quanto você precisa acumular e quanto tempo falta para viver de renda."
            examples={[
                {
                    title: "Regra dos 4%",
                    scenario: "Custo de vida R$ 5.000",
                    result: "Precisa de R$ 1.500.000 investidos.",
                    isPositive: true
                },
                {
                    title: "Aceleração",
                    scenario: "Aumentar aportes reduz drasticamente o tempo.",
                    result: "Poupar 50% da renda antecipa a aposentadoria em anos.",
                    isPositive: true
                }
            ]}
            faq={[
                {
                    question: "O que é a Regra dos 300?",
                    answer: "É uma simplificação da regra dos 4%. Multiplicando seu custo mensal por 300, você encontra o valor necessário para que 4% de retirada anual cubra suas despesas."
                },
                {
                    question: "Taxa Real vs Nominal?",
                    answer: "Sempre use a Taxa Real (rendimento acima da inflação). Se seu investimento rende 10% e a inflação é 4%, sua taxa real é ~6%."
                }
            ]}
        >
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Custo de Vida Mensal</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-muted-foreground font-bold">R$</span>
                        <input
                            type="number"
                            value={monthlyCost}
                            onChange={(e) => setMonthlyCost(e.target.value)}
                            placeholder="5000.00"
                            className="w-full pl-10 p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Patrimônio Atual</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-muted-foreground font-bold">R$</span>
                            <input
                                type="number"
                                value={currentSavings}
                                onChange={(e) => setCurrentSavings(e.target.value)}
                                placeholder="50000.00"
                                className="w-full pl-10 p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Aporte Mensal</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-muted-foreground font-bold">R$</span>
                            <input
                                type="number"
                                value={monthlyContribution}
                                onChange={(e) => setMonthlyContribution(e.target.value)}
                                placeholder="2000.00"
                                className="w-full pl-10 p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Rentabilidade Real Anual (%)</label>
                    <input
                        type="number"
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                        placeholder="6.0"
                        className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        * Acima da inflação. Conservador: 4-5%. Moderado: 6-7%. Arrojado: 8%+.
                    </p>
                </div>

                <button
                    onClick={handleCalculate}
                    className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity text-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                    <Calculator size={20} />
                    Calcular Liberdade
                </button>

                {result && (
                    <div className="bg-muted/50 rounded-xl p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <div className="text-center space-y-2">
                            <span className="text-sm text-muted-foreground block">Você precisa acumular</span>
                            <span className="text-4xl font-bold text-primary block">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.targetAmount)}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                            <div className="text-center">
                                <span className="text-xs text-muted-foreground block">Tempo Estimado</span>
                                <span className="text-xl font-bold text-foreground">{result.years} Anos</span>
                                <span className="text-xs text-muted-foreground block">({result.months} meses)</span>
                            </div>
                            <div className="text-center">
                                <span className="text-xs text-muted-foreground block">Renda Passiva Mensal</span>
                                <span className="text-xl font-bold text-foreground">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(monthlyCost))}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </CalculatorLayout>
    );
}
