"use client";

import Link from "next/link";
import {
    Fuel,
    Percent,
    ArrowLeftRight,
    Users,
    Wallet,
    Plane,
    Briefcase,
    TrendingUp,
    Home,
    Target,
    Calculator
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ToolsPage() {
    const { t } = useLanguage();

    const modules = [
        {
            title: "Calculadoras de Bolso",
            description: "Ferramentas rápidas para o dia a dia.",
            tools: [
                {
                    title: "Etanol ou Gasolina",
                    icon: Fuel,
                    href: "/tools/etanol-gasolina",
                    description: "Descubra qual combustível compensa mais."
                },
                {
                    title: "Desconto Real",
                    icon: Percent,
                    href: "/tools/desconto-real",
                    description: "Verifique se a promoção vale a pena."
                },
                {
                    title: "Conversor de Moedas",
                    icon: ArrowLeftRight,
                    href: "/tools/conversor-moedas",
                    description: "Converta valores com taxas atualizadas."
                }
            ]
        },
        {
            title: "Trabalhista & Empreendedor",
            description: "Gestão de custos e salários.",
            tools: [
                {
                    title: "Custo de Funcionário",
                    icon: Users,
                    href: "/tools/custo-funcionario",
                    description: "Quanto custa contratar alguém?"
                },
                {
                    title: "Salário Líquido 2025",
                    icon: Wallet,
                    href: "/tools/salario-liquido",
                    description: "Calcule os descontos de INSS e IRRF."
                },
                {
                    title: "Férias",
                    icon: Plane,
                    href: "/tools/ferias",
                    description: "Simule o valor das suas férias."
                },
                {
                    title: "Rescisão",
                    icon: Briefcase,
                    href: "/tools/rescisao",
                    description: "Estime os valores de desligamento."
                }
            ]
        },
        {
            title: "Financeiras & Investimentos",
            description: "Planeje seu futuro financeiro.",
            tools: [
                {
                    title: "Juros Compostos",
                    icon: TrendingUp,
                    href: "/tools/juros-compostos",
                    description: "Veja o poder dos juros no longo prazo."
                },
                {
                    title: "Financiamento",
                    icon: Home,
                    href: "/tools/financiamento",
                    description: "Compare SAC vs PRICE."
                },
                {
                    title: "Independência Financeira",
                    icon: Target,
                    href: "/tools/independencia-financeira",
                    description: "Quanto falta para viver de renda?"
                }
            ]
        }
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                    <Calculator className="text-primary" />
                    Ferramentas & Calculadoras
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                    Simuladores educativos para simplificar suas decisões financeiras.
                </p>
            </div>

            <div className="grid gap-8">
                {modules.map((module, i) => (
                    <section key={i} className="space-y-4">
                        <div className="border-b border-border pb-2">
                            <h2 className="text-xl font-bold text-foreground">{module.title}</h2>
                            <p className="text-sm text-muted-foreground">{module.description}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {module.tools.map((tool, j) => (
                                <Link
                                    key={j}
                                    href={tool.href}
                                    className="group bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-md hover:border-primary/50 transition-all"
                                >
                                    <div className="p-3 bg-primary/10 rounded-lg w-fit text-primary mb-4 group-hover:scale-110 transition-transform">
                                        <tool.icon size={24} />
                                    </div>
                                    <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                        {tool.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {tool.description}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}
