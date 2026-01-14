"use client";

import { useState, useRef } from "react";
import { Upload, User, Building2 } from "lucide-react";
import { UsageMode } from "@/types";
import { cn } from "@/lib/utils";

interface ProfileFormProps {
    mode: UsageMode;
    onSubmit: (data: { name: string; companyName?: string; photo?: string; companyLogo?: string }) => void;
    isLoading: boolean;
}

export default function ProfileForm({ mode, onSubmit, isLoading }: ProfileFormProps) {
    const [name, setName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [photo, setPhoto] = useState<string | undefined>(undefined);
    const [companyLogo, setCompanyLogo] = useState<string | undefined>(undefined);

    const photoInputRef = useRef<HTMLInputElement>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'logo') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === 'photo') setPhoto(reader.result as string);
                else setCompanyLogo(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            name,
            companyName: mode !== 'PF' ? companyName : undefined,
            photo,
            companyLogo: mode !== 'PF' ? companyLogo : undefined
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Profile Section */}
                {(mode === 'PF' || mode === 'BOTH') && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <User className="text-orange-500" />
                            <h3 className="font-semibold text-gray-900">Perfil Pessoal</h3>
                        </div>

                        <div className="flex flex-col items-center gap-4">
                            <div
                                onClick={() => photoInputRef.current?.click()}
                                className={cn(
                                    "w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer transition-all hover:border-orange-500 hover:bg-orange-50 relative overflow-hidden group",
                                    photo ? "border-orange-500 border-solid" : "border-gray-300"
                                )}
                            >
                                {photo ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center p-4">
                                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2 group-hover:text-orange-500" />
                                        <span className="text-xs text-gray-500">Sua Foto</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white text-xs font-bold">Alterar</span>
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={photoInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'photo')}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Seu Nome Completo</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                placeholder="Ex: Michael Silva"
                            />
                        </div>
                    </div>
                )}

                {/* Company Profile Section */}
                {(mode === 'PJ' || mode === 'BOTH') && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <Building2 className="text-blue-600" />
                            <h3 className="font-semibold text-gray-900">Perfil da Empresa</h3>
                        </div>

                        <div className="flex flex-col items-center gap-4">
                            <div
                                onClick={() => logoInputRef.current?.click()}
                                className={cn(
                                    "w-32 h-32 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all hover:border-blue-600 hover:bg-blue-50 relative overflow-hidden group",
                                    companyLogo ? "border-blue-600 border-solid" : "border-gray-300"
                                )}
                            >
                                {companyLogo ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={companyLogo} alt="Logo" className="w-full h-full object-contain p-2" />
                                ) : (
                                    <div className="text-center p-4">
                                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2 group-hover:text-blue-600" />
                                        <span className="text-xs text-gray-500">Logo da Empresa</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white text-xs font-bold">Alterar</span>
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={logoInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'logo')}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Nome da Empresa</label>
                            <input
                                type="text"
                                required
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                                placeholder="Ex: Minha Empresa Ltda"
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="pt-6 flex justify-end">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isLoading ? "Salvando..." : "Concluir Configuração"}
                </button>
            </div>
        </form>
    );
}
