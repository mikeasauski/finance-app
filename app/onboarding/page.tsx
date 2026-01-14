"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { UsageMode } from "@/types";
import ModeSelection from "@/components/onboarding/ModeSelection";
import ProfileForm from "@/components/onboarding/ProfileForm";
import { CheckCircle2 } from "lucide-react";

export default function OnboardingPage() {
    const router = useRouter();
    const { updateProfile, user } = useUser();
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [selectedMode, setSelectedMode] = useState<UsageMode | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // If user already has usageMode, redirect to dashboard
    useEffect(() => {
        // We can't strictly check this here because we might be in the middle of setting it up
        // But if we wanted to prevent re-entry:
        // if (user?.usageMode) router.push('/');
    }, [user, router]);

    const handleModeSelect = (mode: UsageMode) => {
        setSelectedMode(mode);
        // Add a small delay for visual feedback before moving to next step
        setTimeout(() => setStep(2), 300);
    };

    const handleProfileSubmit = async (data: { name: string; companyName?: string; photo?: string; companyLogo?: string }) => {
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (selectedMode) {
            updateProfile({
                name: data.name,
                companyName: data.companyName,
                photo: data.photo,
                companyLogo: data.companyLogo,
                usageMode: selectedMode,
                pin: user?.pin || "0000", // Keep existing pin or default
                email: user?.email
            });

            setStep(3);

            // Redirect after success animation
            setTimeout(() => {
                router.push('/');
            }, 2000);
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden min-h-[600px] flex flex-col">
                {/* Header */}
                <div className="p-8 border-b border-gray-100 text-center bg-white relative z-10">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">F</div>
                        <span className="font-bold text-xl text-gray-900">Finance.ai</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mt-4">
                        {step === 1 && "Como você deseja usar o Finance.ai?"}
                        {step === 2 && "Vamos configurar seu perfil"}
                        {step === 3 && "Tudo pronto!"}
                    </h1>
                    <p className="text-gray-500 mt-2">
                        {step === 1 && "Escolha a opção que melhor se adapta à sua necessidade."}
                        {step === 2 && "Preencha as informações para personalizarmos sua experiência."}
                        {step === 3 && "Redirecionando para seu Dashboard..."}
                    </p>

                    {/* Progress Steps */}
                    <div className="flex justify-center gap-2 mt-6">
                        <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= 1 ? "w-8 bg-blue-600" : "w-2 bg-gray-200"}`} />
                        <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= 2 ? "w-8 bg-blue-600" : "w-2 bg-gray-200"}`} />
                        <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= 3 ? "w-8 bg-blue-600" : "w-2 bg-gray-200"}`} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-8 bg-gray-50/50 overflow-y-auto">
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                            <ModeSelection selectedMode={selectedMode} onSelect={handleModeSelect} />
                        </div>
                    )}

                    {step === 2 && selectedMode && (
                        <div className="max-w-2xl mx-auto">
                            <button
                                onClick={() => setStep(1)}
                                className="text-sm text-gray-500 hover:text-gray-900 mb-6 flex items-center gap-1"
                            >
                                ← Voltar
                            </button>
                            <ProfileForm
                                mode={selectedMode}
                                onSubmit={handleProfileSubmit}
                                isLoading={isLoading}
                            />
                        </div>
                    )}

                    {step === 3 && (
                        <div className="flex flex-col items-center justify-center h-full animate-in zoom-in duration-500">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                                <CheckCircle2 size={48} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Configuração Concluída!</h2>
                            <p className="text-gray-500">Aproveite o máximo do Finance.ai</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
