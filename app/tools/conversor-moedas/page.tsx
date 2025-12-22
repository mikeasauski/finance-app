"use client";

import React, { useState } from 'react';
import { ArrowLeftRight, RefreshCw } from 'lucide-react';
import CalculatorLayout from '@/components/tools/CalculatorLayout';
import { TAX_TABLES_2025 } from '@/lib/tax_tables_2025';
import { cn } from '@/lib/utils';

// Mock rates for MVP (In production, fetch from API)
const MOCK_RATES = {
    USD: 6.15,
    EUR: 6.50,
    GBP: 7.80
};

export default function ConversorMoedasPage() {
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP'>('USD');
    const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD'>('CASH');
    const [result, setResult] = useState<{ totalBRL: number; iof: number; rate: number } | null>(null);

    const handleCalculate = () => {
        const value = parseFloat(amount.replace(',', '.'));
        if (!value) return;

        const rate = MOCK_RATES[currency];
        const iofRate = paymentMethod === 'CASH' ? TAX_TABLES_2025.IOF.CASH : TAX_TABLES_2025.IOF.CARD;

        const baseTotal = value * rate;
        const iofValue = baseTotal * iofRate;
        const totalBRL = baseTotal + iofValue;

        setResult({
            totalBRL,
            iof: iofValue,
            rate
        });
    };

    return (
        <CalculatorLayout
            title="Conversor de Moedas"
            icon={ArrowLeftRight}
            description="Converta valores de moedas estrangeiras para Real (BRL) considerando não apenas a cotação comercial, mas também o IOF (Imposto sobre Operações Financeiras) que varia conforme a forma de pagamento (Dinheiro ou Cartão)."
            examples={[
                {
                    title: "Cenário A (Dinheiro em Espécie)",
                    scenario: "$ 1.000,00 em Papel (IOF 1,1%)",
                    result: "Total: R$ 6.217,65 (Mais barato)",
                    isPositive: true
                },
                {
                    title: "Cenário B (Cartão de Crédito)",
                    scenario: "$ 1.000,00 no Cartão (IOF 4,38%)",
                    result: "Total: R$ 6.419,37 (Mais caro)",
                    isPositive: false
                }
            ]}
            faq={[
                {
                    question: "Qual a taxa de IOF hoje?",
                    answer: "Em 2025, o IOF para compra de moeda em espécie é 1,1% e para uso de cartão (crédito/débito/pré-pago) é 4,38%."
                },
                {
                    question: "Vale a pena usar conta global?",
                    answer: "Sim. Contas globais (Wise, Nomad, etc) usam o IOF de 1,1% (mesmo do dinheiro) e cotação comercial, sendo mais vantajosas que o cartão de crédito tradicional."
                },
                {
                    question: "O que é Dólar Comercial vs Turismo?",
                    answer: "Comercial é usado entre empresas e bancos. Turismo é o que você paga na casa de câmbio, que inclui custos operacionais e margem de lucro."
                }
            ]}
        >
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Valor em Moeda Estrangeira</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-muted-foreground font-bold">
                                {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'}
                            </span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="1000.00"
                                className="w-full pl-8 p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Moeda</label>
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value as any)}
                            className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                        >
                            <option value="USD">Dólar Americano (USD)</option>
                            <option value="EUR">Euro (EUR)</option>
                            <option value="GBP">Libra Esterlina (GBP)</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Forma de Pagamento</label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setPaymentMethod('CASH')}
                            className={cn(
                                "p-3 rounded-xl border transition-all text-sm font-medium",
                                paymentMethod === 'CASH'
                                    ? "bg-primary/10 border-primary text-primary"
                                    : "bg-background border-border hover:border-primary/50"
                            )}
                        >
                            Dinheiro em Espécie
                            <span className="block text-xs opacity-70 font-normal mt-1">IOF 1,1%</span>
                        </button>
                        <button
                            onClick={() => setPaymentMethod('CARD')}
                            className={cn(
                                "p-3 rounded-xl border transition-all text-sm font-medium",
                                paymentMethod === 'CARD'
                                    ? "bg-primary/10 border-primary text-primary"
                                    : "bg-background border-border hover:border-primary/50"
                            )}
                        >
                            Cartão / Pré-pago
                            <span className="block text-xs opacity-70 font-normal mt-1">IOF 4,38%</span>
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleCalculate}
                    className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity text-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                    <RefreshCw size={20} />
                    Converter para Real
                </button>

                {result && (
                    <div className="bg-muted/50 rounded-xl p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex justify-between items-center text-sm text-muted-foreground">
                            <span>Cotação Utilizada:</span>
                            <span className="font-mono">R$ {result.rate.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-muted-foreground">
                            <span>IOF ({paymentMethod === 'CASH' ? '1,1%' : '4,38%'}):</span>
                            <span className="font-mono text-red-500">+ {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.iof)}</span>
                        </div>
                        <div className="pt-4 border-t border-border flex justify-between items-end">
                            <span className="font-bold text-foreground">Total em Reais:</span>
                            <span className="text-3xl font-bold text-primary">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.totalBRL)}
                            </span>
                        </div>
                        <p className="text-xs text-center text-muted-foreground mt-2">
                            * Cotação aproximada. Consulte seu banco para valores exatos.
                        </p>
                    </div>
                )}
            </div>
        </CalculatorLayout>
    );
}
