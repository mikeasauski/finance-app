"use client";

import React, { useState } from 'react';
import { Plane, Calculator } from 'lucide-react';
import CalculatorLayout from '@/components/tools/CalculatorLayout';
import { TAX_TABLES_2025 } from '@/lib/tax_tables_2025';

export default function FeriasPage() {
    const [salary, setSalary] = useState('');
    const [days, setDays] = useState('30');
    const [sellVacation, setSellVacation] = useState(false);
    const [advance13, setAdvance13] = useState(false);
    const [result, setResult] = useState<{ totalNet: number; gross: number; inss: number; irrf: number; bonus13: number } | null>(null);

    const calculateINSS = (value: number) => {
        const brackets = TAX_TABLES_2025.INSS;
        const teto = brackets[brackets.length - 1].limit;
        const calculationBase = Math.min(value, teto);
        const bracket = brackets.find(b => calculationBase <= b.limit) || brackets[brackets.length - 1];
        return (calculationBase * bracket.rate) - bracket.deduction;
    };

    const calculateIRRF = (base: number) => {
        if (base <= 0) return 0;
        const brackets = TAX_TABLES_2025.IRRF;
        const bracket = brackets.find(b => base <= b.limit) || brackets[brackets.length - 1];
        return (base * bracket.rate) - bracket.deduction;
    };

    const handleCalculate = () => {
        const salaryValue = parseFloat(salary.replace(',', '.')) || 0;
        const vacationDays = parseInt(days);

        if (!salaryValue) return;

        // Base Vacation Value
        const vacationValue = (salaryValue / 30) * vacationDays;
        const oneThird = vacationValue / 3;
        const grossVacation = vacationValue + oneThird;

        // Abono Pecuniário (Selling 10 days)
        // Usually you sell 10 days. The calculation is separate.
        // Abono is not subject to INSS/IRRF.
        let abonoValue = 0;
        let abonoOneThird = 0;

        if (sellVacation) {
            // Assuming the 'days' selected is the days TAKEN.
            // If user selects 20 days and 'sell', it means 20 days rest + 10 days sell.
            // But let's simplify: 'days' is how many days of vacation they are taking OFF.
            // If they sell, it's usually +10 days of salary + 1/3.

            // Let's assume standard: Sell 10 days.
            abonoValue = (salaryValue / 30) * 10;
            abonoOneThird = abonoValue / 3;
        }

        // 13th Advance (50%)
        let bonus13 = 0;
        if (advance13) {
            bonus13 = salaryValue / 2;
        }

        // Taxes are calculated on Gross Vacation (Rest days)
        const inss = calculateINSS(grossVacation);
        const baseIRRF = grossVacation - inss;
        const irrf = calculateIRRF(baseIRRF);

        // Total Net
        // Net Vacation + Abono (Net) + 13th Advance (Net - no tax on advance usually, tax is at end of year)
        const netVacation = grossVacation - inss - irrf;
        const totalNet = netVacation + abonoValue + abonoOneThird + bonus13;

        setResult({
            totalNet,
            gross: grossVacation,
            inss,
            irrf,
            bonus13
        });
    };

    return (
        <CalculatorLayout
            title="Calculadora de Férias"
            icon={Plane}
            description="Simule o valor a receber nas suas férias, incluindo 1/3 constitucional, abono pecuniário e adiantamento do 13º."
            examples={[
                {
                    title: "30 Dias",
                    scenario: "Salário R$ 3.000,00",
                    result: "Líquido: ~R$ 3.600,00",
                    isPositive: true
                },
                {
                    title: "20 Dias + Venda",
                    scenario: "Salário R$ 3.000,00",
                    result: "Líquido: ~R$ 4.800,00",
                    isPositive: true
                }
            ]}
            faq={[
                {
                    question: "O que é vender férias?",
                    answer: "É converter 1/3 dos seus dias de férias (geralmente 10 dias) em dinheiro. Você trabalha esses dias e recebe por eles + o valor das férias."
                },
                {
                    question: "Incide imposto no abono?",
                    answer: "Não. O valor da venda das férias (abono pecuniário) é isento de INSS e IRRF."
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

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Dias de Descanso</label>
                    <select
                        value={days}
                        onChange={(e) => setDays(e.target.value)}
                        className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                        <option value="30">30 dias</option>
                        <option value="20">20 dias</option>
                        <option value="15">15 dias</option>
                        <option value="10">10 dias</option>
                    </select>
                </div>

                <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 border border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                        <input
                            type="checkbox"
                            checked={sellVacation}
                            onChange={(e) => setSellVacation(e.target.checked)}
                            className="w-5 h-5 text-primary rounded focus:ring-primary"
                        />
                        <span className="text-sm font-medium">Vender Férias (Abono Pecuniário)</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 border border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                        <input
                            type="checkbox"
                            checked={advance13}
                            onChange={(e) => setAdvance13(e.target.checked)}
                            className="w-5 h-5 text-primary rounded focus:ring-primary"
                        />
                        <span className="text-sm font-medium">Adiantar 1ª parcela do 13º</span>
                    </label>
                </div>

                <button
                    onClick={handleCalculate}
                    className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity text-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                    <Calculator size={20} />
                    Calcular Férias
                </button>

                {result && (
                    <div className="bg-muted/50 rounded-xl p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                                <span>Férias Bruto + 1/3:</span>
                                <span className="font-mono">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.gross)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                                <span>Descontos (INSS/IRRF):</span>
                                <span className="font-mono text-red-500">
                                    - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.inss + result.irrf)}
                                </span>
                            </div>
                            {sellVacation && (
                                <div className="flex justify-between items-center text-sm text-muted-foreground">
                                    <span>Abono Pecuniário (Isento):</span>
                                    <span className="font-mono text-green-500">
                                        + {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((parseFloat(salary) / 30 * 10) * 1.333)}
                                    </span>
                                </div>
                            )}
                            {result.bonus13 > 0 && (
                                <div className="flex justify-between items-center text-sm text-muted-foreground">
                                    <span>Adiantamento 13º:</span>
                                    <span className="font-mono text-green-500">
                                        + {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.bonus13)}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="pt-4 border-t border-border flex justify-between items-end">
                            <span className="font-bold text-foreground">Total Líquido a Receber:</span>
                            <span className="text-3xl font-bold text-primary">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.totalNet)}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </CalculatorLayout>
    );
}
