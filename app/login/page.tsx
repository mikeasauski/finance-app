"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Camera, ArrowRight, ShieldCheck } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

export default function LoginPage() {
    const { login, updateProfile, hasProfile, isAuthenticated } = useUser();
    const router = useRouter();

    // Login State
    const [pin, setPin] = useState("");
    const [error, setError] = useState("");

    // Create Profile State
    const [name, setName] = useState("");
    const [newPin, setNewPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");
    const [step, setStep] = useState<'name' | 'pin'>('name');

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, router]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (login(pin)) {
            router.push("/");
        } else {
            setError("Senha incorreta");
            setPin("");
        }
    };

    const handleCreateProfile = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPin !== confirmPin) {
            setError("As senhas não coincidem");
            return;
        }
        if (newPin.length < 4) {
            setError("A senha deve ter pelo menos 4 dígitos");
            return;
        }

        updateProfile({
            name,
            pin: newPin,
            photo: undefined // Future: Add photo upload
        });
        router.push("/");
    };

    // if (isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-blue-600 p-8 text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <ShieldCheck className="text-white" size={40} />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Finance App</h1>
                    <p className="text-blue-100 mt-2">Segurança e Privacidade</p>
                </div>

                <div className="p-8">
                    {hasProfile ? (
                        // LOGIN SCREEN
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="text-center mb-8">
                                <h2 className="text-xl font-semibold text-gray-800">Bem-vindo de volta!</h2>
                                <p className="text-gray-500 text-sm">Digite sua senha para acessar</p>
                            </div>

                            <div className="space-y-2">
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                                    <input
                                        type="password"
                                        value={pin}
                                        onChange={(e) => {
                                            setPin(e.target.value);
                                            setError("");
                                        }}
                                        className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-center text-2xl tracking-widest"
                                        placeholder="••••"
                                        maxLength={6}
                                        autoFocus
                                    />
                                </div>
                                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                            >
                                Desbloquear
                            </button>
                        </form>
                    ) : (
                        // CREATE PROFILE SCREEN
                        <form onSubmit={handleCreateProfile} className="space-y-6">
                            <div className="text-center mb-8">
                                <h2 className="text-xl font-semibold text-gray-800">Criar Perfil</h2>
                                <p className="text-gray-500 text-sm">Configure seu acesso seguro</p>
                            </div>

                            {step === 'name' ? (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Como você se chama?</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 text-gray-400" size={20} />
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="Seu nome"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => name && setStep('pin')}
                                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        Continuar <ArrowRight size={20} />
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Crie uma senha (PIN)</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                                            <input
                                                type="password"
                                                value={newPin}
                                                onChange={(e) => setNewPin(e.target.value)}
                                                className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-center text-xl tracking-widest"
                                                placeholder="••••"
                                                maxLength={6}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirme a senha</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                                            <input
                                                type="password"
                                                value={confirmPin}
                                                onChange={(e) => setConfirmPin(e.target.value)}
                                                className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-center text-xl tracking-widest"
                                                placeholder="••••"
                                                maxLength={6}
                                                required
                                            />
                                        </div>
                                    </div>
                                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setStep('name')}
                                            className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                                        >
                                            Voltar
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                                        >
                                            Concluir
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
