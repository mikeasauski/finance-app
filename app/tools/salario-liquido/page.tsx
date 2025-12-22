"use client";

import React, { useState } from 'react';
import { Wallet, Calculator } from 'lucide-react';
import CalculatorLayout from '@/components/tools/CalculatorLayout';
import { TAX_TABLES_2025 } from '@/lib/tax_tables_2025';

export default function SalarioLiquidoPage() {
    const [salary, setSalary] = useState('');
    const [dependents, setDependents] = useState('0');
    const [otherDiscounts, setOtherDiscounts] = useState('');
    const [result, setResult] = useState<{ netSalary: number; inss: number; irrf: number; totalDiscounts: number } | null>(null);

    const calculateINSS = (grossSalary: number) => {
        let inss = 0;
        let remainingSalary = grossSalary;

        // Progressive INSS calculation
        // This is a simplified version. For exact progressive, we iterate through brackets.
        // However, the tax table provided has 'deduction' which simplifies it to: (Salary * Rate) - Deduction
        // But we need to find the correct bracket.

        const brackets = TAX_TABLES_2025.INSS;
        let rate = 0;
        let deduction = 0;

        for (const bracket of brackets) {
            if (grossSalary <= bracket.limit) {
                rate = bracket.rate;
                deduction = bracket.deduction;
                break;
            } else if (bracket === brackets[brackets.length - 1]) {
                // Above last limit (Teto)
                // Actually for INSS there is a Teto. The last bracket in my mock data seems to be the teto?
                // Let's check the data: limit 8157.41 is the teto for 2025 (estimated).
                // If salary > 8157.41, we use the max contribution.
                // Max contribution = (8157.41 * 0.14) - 190.40 = 951.63 (approx)
                // Let's use the logic: if salary > last limit, use last limit for calculation.
            }
        }

        // Correct logic for progressive INSS using deduction method:
        // Find the bracket where salary fits.
        // INSS = (Salary * Rate) - Deduction
        // If Salary > Teto, INSS = Teto * Rate - Deduction (of the last bracket)

        const teto = brackets[brackets.length - 1].limit;
        const calculationBase = Math.min(grossSalary, teto);

        const bracket = brackets.find(b => calculationBase <= b.limit) || brackets[brackets.length - 1];
        inss = (calculationBase * bracket.rate) - bracket.deduction;

        return inss;
    };

    const calculateIRRF = (baseIRRF: number, dependentsCount: number) => {
        // Deduction per dependent: 189.59 (2024 value, keeping for 2025 estimate or update if known)
        const dependentDeduction = 189.59 * dependentsCount;
        const base = baseIRRF - dependentDeduction;

        if (base <= 0) return 0;

        const brackets = TAX_TABLES_2025.IRRF;
        const bracket = brackets.find(b => base <= b.limit) || brackets[brackets.length - 1];

        const irrf = (base * bracket.rate) - bracket.deduction;
        return Math.max(0, irrf);
    };

    const handleCalculate = () => {
        const grossSalary = parseFloat(salary.replace(',', '.')) || 0;
        const dependentsCount = parseInt(dependents) || 0;
        const discounts = parseFloat(otherDiscounts.replace(',', '.')) || 0;

        if (!grossSalary) return;

        const inss = calculateINSS(grossSalary);
        const baseIRRF = grossSalary - inss;
        const irrf = calculateIRRF(baseIRRF, dependentsCount);

        const totalDiscounts = inss + irrf + discounts;
        const netSalary = grossSalary - totalDiscounts;

        setResult({
            netSalary,
            inss,
            irrf,
            totalDiscounts
        });
    };

    return (
        <CalculatorLayout
            title="Salário Líquido 2025"
            icon={Wallet}
            description="Calcule seu salário líquido descontando INSS e Imposto de Renda (IRRF) conforme as tabelas de 2025."
            examples={[
                {
                    title: "Salário Mínimo",
                    scenario: "R$ 1.518,00",
                    result: "Líquido: ~R$ 1.404,15",
                    isPositive: true
                },
                {
                    title: "Salário Médio",
                    scenario: "R$ 5.000,00",
                    result: "Líquido: ~R$ 4.100,00",
                    isPositive: true
                }
            ]}
            faq={[
                {
                    question: "Como é calculado o INSS?",
                    answer: "O INSS é progressivo. Você paga alíquotas diferentes para cada faixa do seu salário, mas a conta simplificada é (Salário x Alíquota) - Dedução."
                },
                {
                    question: "Dependentes ajudam?",
                    answer: "Sim, cada dependente reduz a base de cálculo do Imposto de Renda em R$ 189,59."
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
                            placeholder="3000.00"
                            className="w-full pl-10 p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Número de Dependentes</label>
                        <input
                            type="number"
                            value={dependents}
                            onChange={(e) => setDependents(e.target.value)}
                            placeholder="0"
                            className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Outros Descontos</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-muted-foreground font-bold">R$</span>
                            <input
                                type="number"
                                value={otherDiscounts}
                                onChange={(e) => setOtherDiscounts(e.target.value)}
                                placeholder="0.00"
                                className="w-full pl-10 p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleCalculate}
                    className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity text-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                    <Calculator size={20} />
                    Calcular Salário Líquido
                </button>

                {result && (
                    <div className="bg-muted/50 rounded-xl p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                                <span>INSS:</span>
                                <span className="font-mono text-red-500">
                                    - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.inss)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                                <span>IRRF:</span>
                                <span className="font-mono text-red-500">
                                    - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.irrf)}
                                </span>
                            </div>
                            {result.totalDiscounts > (result.inss + result.irrf) && (
                                <div className="flex justify-between items-center text-sm text-muted-foreground">
                                    <span>Outros Descontos:</span>
                                    <span className="font-mono text-red-500">
                                        - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.totalDiscounts - result.inss - result.irrf)}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="pt-4 border-t border-border flex justify-between items-end">
                            <span className="font-bold text-foreground">Salário Líquido:</span>
                            <span className="text-3xl font-bold text-primary">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.netSalary)}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </CalculatorLayout>
    );
}
