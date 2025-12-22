"use client";

import React, { useState } from 'react';
import { Home, Calculator } from 'lucide-react';
import CalculatorLayout from '@/components/tools/CalculatorLayout';

export default function FinanciamentoPage() {
    const [value, setValue] = useState('');
    const [downPayment, setDownPayment] = useState('');
    const [rate, setRate] = useState('');
    const [years, setYears] = useState('30');
    const [system, setSystem] = useState<'SAC' | 'PRICE'>('SAC');
    const [result, setResult] = useState<{ firstInstallment: number; lastInstallment: number; totalInterest: number; totalPaid: number } | null>(null);

    const handleCalculate = () => {
        const propertyValue = parseFloat(value.replace(',', '.')) || 0;
        const entry = parseFloat(downPayment.replace(',', '.')) || 0;
        const yearlyRate = parseFloat(rate.replace(',', '.')) || 0;
        const termYears = parseFloat(years) || 0;

        if (!propertyValue || !termYears) return;

        const principal = propertyValue - entry;
        const months = termYears * 12;
        const monthlyRate = (Math.pow(1 + yearlyRate / 100, 1 / 12) - 1);

        let firstInstallment = 0;
        let lastInstallment = 0;
        let totalPaid = 0;

        if (system === 'SAC') {
            const amortization = principal / months;
            firstInstallment = amortization + (principal * monthlyRate);
            // Last installment: amortization + (amortization * monthlyRate)
            // Actually, interest is on remaining balance.
            // Month 1 balance: Principal. Interest: P * i. Payment: A + P*i.
            // Month N balance: Amortization. Interest: A * i. Payment: A + A*i.
            lastInstallment = amortization + (amortization * monthlyRate);

            // Total Paid in SAC is Arithmetic Progression Sum?
            // Sum of installments.
            // Installment(k) = A + (P - (k-1)A) * i
            // Total = n * A + i * sum(P - (k-1)A)
            // Simplified: Total = Principal + Total Interest
            // Total Interest = (n * (FirstInterest + LastInterest)) / 2 ? No.
            // Total Interest = (P * i * (n + 1)) / 2
            const totalInterest = (principal * monthlyRate * (months + 1)) / 2;
            totalPaid = principal + totalInterest;

        } else { // PRICE
            // PMT = P * [ i(1+i)^n ] / [ (1+i)^n - 1 ]
            const pmt = principal * ((monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1));
            firstInstallment = pmt;
            lastInstallment = pmt;
            totalPaid = pmt * months;
        }

        const totalInterest = totalPaid - principal;

        setResult({
            firstInstallment,
            lastInstallment,
            totalInterest,
            totalPaid
        });
    };

    return (
        <CalculatorLayout
            title="Simulador de Financiamento"
            icon={Home}
            description="Compare os sistemas SAC (parcelas decrescentes) e PRICE (parcelas fixas) para seu financiamento imobiliário."
            examples={[
                {
                    title: "SAC (Mais comum)",
                    scenario: "R$ 200k em 30 anos a 10% a.a.",
                    result: "Começa pagando ~R$ 2.100 e termina ~R$ 560. Juros totais menores.",
                    isPositive: true
                },
                {
                    title: "PRICE (Tabela Price)",
                    scenario: "R$ 200k em 30 anos a 10% a.a.",
                    result: "Parcela fixa de ~R$ 1.600. Paga mais juros no total.",
                    isPositive: false
                }
            ]}
            faq={[
                {
                    question: "Qual a diferença entre SAC e PRICE?",
                    answer: "No SAC, você amortiza mais dívida no começo, então as parcelas diminuem e o total de juros é menor. Na PRICE, a parcela é fixa, mas você paga mais juros no final."
                },
                {
                    question: "O que compõe a parcela?",
                    answer: "A parcela é composta por Amortização (o que abate da dívida) + Juros (lucro do banco) + Seguros/Taxas."
                }
            ]}
        >
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Valor do Imóvel</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-muted-foreground font-bold">R$</span>
                        <input
                            type="number"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="300000.00"
                            className="w-full pl-10 p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Entrada</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-muted-foreground font-bold">R$</span>
                            <input
                                type="number"
                                value={downPayment}
                                onChange={(e) => setDownPayment(e.target.value)}
                                placeholder="60000.00"
                                className="w-full pl-10 p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Taxa de Juros (Anual %)</label>
                        <input
                            type="number"
                            value={rate}
                            onChange={(e) => setRate(e.target.value)}
                            placeholder="10.5"
                            className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Prazo (Anos)</label>
                        <input
                            type="number"
                            value={years}
                            onChange={(e) => setYears(e.target.value)}
                            placeholder="30"
                            className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Sistema de Amortização</label>
                        <select
                            value={system}
                            onChange={(e) => setSystem(e.target.value as any)}
                            className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                        >
                            <option value="SAC">SAC (Decrescente)</option>
                            <option value="PRICE">PRICE (Fixa)</option>
                        </select>
                    </div>
                </div>

                <button
                    onClick={handleCalculate}
                    className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity text-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                    <Calculator size={20} />
                    Simular Financiamento
                </button>

                {result && (
                    <div className="bg-muted/50 rounded-xl p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-background rounded-lg border border-border">
                                <span className="text-xs text-muted-foreground block mb-1">Primeira Parcela</span>
                                <span className="text-xl font-bold text-foreground">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.firstInstallment)}
                                </span>
                            </div>
                            <div className="p-4 bg-background rounded-lg border border-border">
                                <span className="text-xs text-muted-foreground block mb-1">Última Parcela</span>
                                <span className="text-xl font-bold text-foreground">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.lastInstallment)}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2 pt-2">
                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                                <span>Valor Financiado:</span>
                                <span className="font-mono">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(value) - parseFloat(downPayment))}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                                <span>Total de Juros:</span>
                                <span className="font-mono text-red-500">
                                    + {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.totalInterest)}
                                </span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border flex justify-between items-end">
                            <span className="font-bold text-foreground">Custo Total:</span>
                            <span className="text-3xl font-bold text-primary">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.totalPaid)}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </CalculatorLayout>
    );
}
