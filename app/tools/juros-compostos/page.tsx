"use client";

import React, { useState } from 'react';
import { TrendingUp, Calculator } from 'lucide-react';
import CalculatorLayout from '@/components/tools/CalculatorLayout';

export default function JurosCompostosPage() {
    const [initialValue, setInitialValue] = useState('');
    const [monthlyContribution, setMonthlyContribution] = useState('');
    const [rate, setRate] = useState('');
    const [rateType, setRateType] = useState<'MONTHLY' | 'YEARLY'>('YEARLY');
    const [time, setTime] = useState('');
    const [timeType, setTimeType] = useState<'MONTHS' | 'YEARS'>('YEARS');
    const [result, setResult] = useState<{ totalInvested: number; totalInterest: number; totalFinal: number } | null>(null);

    const handleCalculate = () => {
        const initial = parseFloat(initialValue.replace(',', '.')) || 0;
        const monthly = parseFloat(monthlyContribution.replace(',', '.')) || 0;
        let interestRate = parseFloat(rate.replace(',', '.')) || 0;
        let period = parseFloat(time) || 0;

        if (!period) return;

        // Convert rate to monthly if needed
        if (rateType === 'YEARLY') {
            interestRate = (Math.pow(1 + interestRate / 100, 1 / 12) - 1) * 100;
        }

        // Convert time to months if needed
        if (timeType === 'YEARS') {
            period = period * 12;
        }

        const i = interestRate / 100;

        // Future Value of Initial Amount
        // FV = PV * (1 + i)^n
        const fvInitial = initial * Math.pow(1 + i, period);

        // Future Value of Monthly Contributions (Annuity)
        // FV = PMT * [((1 + i)^n - 1) / i]
        let fvMonthly = 0;
        if (monthly > 0 && i > 0) {
            fvMonthly = monthly * ((Math.pow(1 + i, period) - 1) / i);
        } else if (monthly > 0 && i === 0) {
            fvMonthly = monthly * period;
        }

        const totalFinal = fvInitial + fvMonthly;
        const totalInvested = initial + (monthly * period);
        const totalInterest = totalFinal - totalInvested;

        setResult({
            totalInvested,
            totalInterest,
            totalFinal
        });
    };

    return (
        <CalculatorLayout
            title="Calculadora de Juros Compostos"
            icon={TrendingUp}
            description="Simule o crescimento do seu patrimônio com o poder dos juros compostos ao longo do tempo."
            examples={[
                {
                    title: "Poupança Longo Prazo",
                    scenario: "R$ 1.000 inicial + R$ 500/mês por 10 anos a 10% a.a.",
                    result: "Total: ~R$ 108.000 (Investido: R$ 61.000)",
                    isPositive: true
                },
                {
                    title: "Investimento Curto Prazo",
                    scenario: "R$ 10.000 inicial por 2 anos a 12% a.a.",
                    result: "Total: ~R$ 12.544 (Juros: R$ 2.544)",
                    isPositive: true
                }
            ]}
            faq={[
                {
                    question: "O que são juros compostos?",
                    answer: "São 'juros sobre juros'. O rendimento de cada mês é somado ao capital para render mais no mês seguinte, criando uma bola de neve positiva."
                },
                {
                    question: "Qual a diferença de taxa mensal e anual?",
                    answer: "A taxa anual não é simplesmente a mensal x 12. Devido aos juros compostos, 1% ao mês resulta em 12,68% ao ano, não 12%."
                }
            ]}
        >
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Valor Inicial</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-muted-foreground font-bold">R$</span>
                            <input
                                type="number"
                                value={initialValue}
                                onChange={(e) => setInitialValue(e.target.value)}
                                placeholder="1000.00"
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
                                placeholder="500.00"
                                className="w-full pl-10 p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Taxa de Juros (%)</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={rate}
                                onChange={(e) => setRate(e.target.value)}
                                placeholder="10.00"
                                className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                            <select
                                value={rateType}
                                onChange={(e) => setRateType(e.target.value as any)}
                                className="bg-background border border-border rounded-xl px-2 focus:ring-2 focus:ring-primary focus:outline-none"
                            >
                                <option value="YEARLY">Anual</option>
                                <option value="MONTHLY">Mensal</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Período</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                placeholder="10"
                                className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                            <select
                                value={timeType}
                                onChange={(e) => setTimeType(e.target.value as any)}
                                className="bg-background border border-border rounded-xl px-2 focus:ring-2 focus:ring-primary focus:outline-none"
                            >
                                <option value="YEARS">Anos</option>
                                <option value="MONTHS">Meses</option>
                            </select>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleCalculate}
                    className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity text-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                    <Calculator size={20} />
                    Calcular Futuro
                </button>

                {result && (
                    <div className="bg-muted/50 rounded-xl p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                                <span>Total Investido:</span>
                                <span className="font-mono">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.totalInvested)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                                <span>Total em Juros:</span>
                                <span className="font-mono text-green-500">
                                    + {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.totalInterest)}
                                </span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border flex justify-between items-end">
                            <span className="font-bold text-foreground">Valor Final Acumulado:</span>
                            <span className="text-3xl font-bold text-primary">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.totalFinal)}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </CalculatorLayout>
    );
}
